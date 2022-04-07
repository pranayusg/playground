import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/users/get-user.decorator';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'Login success',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiTags('Auth')
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Body() data: LoginUserDTO, @GetUser() user) {
    return this.authService.login(user);
  }
}
