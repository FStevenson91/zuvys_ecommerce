import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({
    description: 'Credenciales para iniciar sesión',
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Ejemplo válido',
        value: {
          email: 'usuario@example.com',
          password: 'Miclave123!',
        },
      },
    },
  })
  signin(@Body() credentials: LoginDto) {
    return this.authService.signIn(credentials);
  }

  @Post('register')
  createUser(@Body() user: CreateUserDto) {
    return this.authService.createUser(user);
  }
}
