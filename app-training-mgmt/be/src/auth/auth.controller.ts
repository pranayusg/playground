import {
  Controller,
  Post,
  Request,
  Body,
  Param,
  Get,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UpdateSystemUserDto } from 'src/system-user/dto/update-system-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'auth',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Auth')
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
export class AuthController {
  constructor(private authService: AuthService) {}

  //@UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() creds: LoginDto) {
    return this.authService.login(creds);
  }

  @Post('/set-password/:jwtToken')
  setPassword(
    @Param('jwtToken') token: string,
    @Body() updateCredentialDto: UpdateSystemUserDto,
  ) {
    return this.authService.setPassword(token, updateCredentialDto);
  }

  @Post('/forgot-password/:username')
  forgorPassword(@Param('username') username: string) {
    return this.authService.forgotPassword(username);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/change-password')
  changePasswordTokenGenerate(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.changePasswordTokenGenerate(token);
  }

  @ApiBearerAuth()
  @Get('/refresh/')
  getNewAccessToken(@Request() req) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    return this.authService.createAccessTokenFromRefreshToken(refreshToken);
  }
}
