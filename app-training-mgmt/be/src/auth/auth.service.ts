import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SystemUserService } from 'src/system-user/system-user.service';
import { UpdateSystemUserDto } from 'src/system-user/dto/update-system-user.dto';
import { EmployeeStatus } from 'src/employee/employee-status.enum';
import { EmployeeRepository } from 'src/employee/employee.repository';
import * as bcrypt from 'bcrypt';
import { IPayload } from 'src/auth/payload.interface';
import { EmailService } from 'src/email/email.service';
import {
  EMAIL_SENT_MESSAGE,
  INVALID_TOKEN,
  RESET_PASSWORD_MESSAGE,
  SET_PASSWORD_MESSAGE,
  USER_PRESENT,
} from 'src/core/constant/constatnts';
import { LoginData } from 'src/auth/auth.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private systemUserService: SystemUserService,
    private jwtService: JwtService,
    private employeeRepo: EmployeeRepository,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}
  private REFRESH_TOKEN_EXPIRY = this.configService.get('REFRESH_TOKEN_EXPIRY');
  private SET_PASSWORD_JWT_TOKEN_EXPIRY = this.configService.get(
    'SET_PASSWORD_TOKEN_EXPIRY',
  );
  private RESET_PASSWORD_JWT_TOKEN_EXPIRY = this.configService.get(
    'RESET_PASSWORD_TOKEN_EXPIRY',
  );

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.systemUserService.findOne(username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(data: LoginData) {
    const user = await this.systemUserService.findOne(data.username);
    if (user) {
      return await this.handleLogin(user, data);
    } else {
      return await this.verifyEmployee(data);
    }
  }

  private async handleLogin(user: any, data: LoginData) {
    if (!data.password) {
      return {
        message: USER_PRESENT,
      };
    } else {
      const passwordMatch = await bcrypt.compare(data.password, user.password);
      if (passwordMatch) {
        try {
          const payload: IPayload = {
            username: user.username.id,
            role: user.type,
          };
          const currentTimestamp = new Date();
          const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.REFRESH_TOKEN_EXPIRY,
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          });
          const hashedRefreshToken = await bcrypt.hash(
            refreshToken,
            this.configService.get('SALT'),
          );
          const updatedUser = await this.systemUserService.updateData(
            user.username.id,
            {
              lastLoggedIn: currentTimestamp,
              refreshToken: hashedRefreshToken,
            },
          );

          return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken,
            role: updatedUser.type,
            lastLoggedIn: currentTimestamp,
          };
        } catch (error) {
          this.logger.error(
            error.message,
            error.stack,
            `${AuthService.name}/handleLogin`,
          );
          throw new InternalServerErrorException(error.message);
        }
      } else {
        throw new BadRequestException(`Incorrect password`);
      }
    }
  }

  private async verifyEmployee(data: LoginData) {
    const employee = await this.employeeRepo.findOne({
      where: { id: data.username, status: EmployeeStatus.Active },
    });

    if (employee) {
      try {
        const payload: IPayload = { username: data.username, role: '' };
        const jwtToken = this.jwtService.sign(payload, {
          expiresIn: this.SET_PASSWORD_JWT_TOKEN_EXPIRY,
        });

        await this.emailService.sendSetPasswordMail(
          employee,
          jwtToken,
          this.SET_PASSWORD_JWT_TOKEN_EXPIRY,
        );

        return {
          message: EMAIL_SENT_MESSAGE,
        };
      } catch (error) {
        this.logger.error(
          error.message,
          error.stack,
          `${AuthService.name}/handleLogin`,
        );
        throw new InternalServerErrorException(error.message);
      }
    } else {
      throw new BadRequestException(
        'User not active or not present in the employee table',
      );
    }
  }

  async setPassword(token: string, updateCredentialDto: UpdateSystemUserDto) {
    let isValid: IPayload;

    try {
      isValid = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(INVALID_TOKEN);
    }

    if (isValid) {
      const { username } = isValid;
      const user = await this.systemUserService.findOne(username);

      if (user) {
        await this.systemUserService.reSetPassword(
          username,
          updateCredentialDto,
        );
        return { message: RESET_PASSWORD_MESSAGE };
      } else {
        await this.systemUserService.setPassword(username, updateCredentialDto);
        return { message: SET_PASSWORD_MESSAGE };
      }
    }
  }

  async forgotPassword(username: string) {
    try {
      const employee: any = await this.systemUserService.findOne(username);
      if (!employee) {
        throw new BadRequestException(
          `You do not have any previous password to reset.`,
        );
      }
      const payload: IPayload = {
        username: employee.username.id,
        role: employee.type,
      };
      const jwtToken = this.jwtService.sign(payload, {
        expiresIn: this.RESET_PASSWORD_JWT_TOKEN_EXPIRY,
      });
      this.emailService.sendResetPasswordMail(
        employee.username,
        jwtToken,
        this.RESET_PASSWORD_JWT_TOKEN_EXPIRY,
      );
      return { message: EMAIL_SENT_MESSAGE };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async reSetPassword(token: string, updateCredentialDto: UpdateSystemUserDto) {
    let isValid: IPayload;
    try {
      isValid = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(INVALID_TOKEN);
    }
    if (isValid) {
      const { username } = isValid;

      await this.systemUserService.reSetPassword(username, updateCredentialDto);
      return { message: RESET_PASSWORD_MESSAGE };
    }
  }

  async changePasswordTokenGenerate(token: string) {
    let isValid: IPayload;
    try {
      isValid = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(INVALID_TOKEN);
    }
    if (isValid) {
      const { username, role } = isValid;

      try {
        const payload: IPayload = { username: username, role: role };
        const jwtToken = this.jwtService.sign(payload, {
          expiresIn: this.SET_PASSWORD_JWT_TOKEN_EXPIRY,
        });
        return { token: jwtToken };
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async createAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const decoded: any = this.jwtService.decode(refreshToken);
      if (!decoded) {
        throw new Error();
      }

      const user = await this.systemUserService.getOnewithNoRelation(
        decoded.username,
      );

      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException(INVALID_TOKEN);
      }

      await this.jwtService.verify(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
      const payload: IPayload = {
        username: user.username,
        role: user.type,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch {
      throw new UnauthorizedException(INVALID_TOKEN);
    }
  }
}
