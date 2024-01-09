import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPayload } from 'src/auth/payload.interface';
import { SystemUser } from 'src/system-user/entities/system-user.entity';
import { SystemUserService } from 'src/system-user/system-user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private systemUserService: SystemUserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IPayload) {
    const { username } = payload;
    const user: SystemUser = await this.systemUserService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      username: user.username,
      role: user.type,
      lastLoggedIn: user.lastLoggedIn,
    };
  }
}
