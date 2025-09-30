import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(credentials: LoginDto) {
    const findUser: Users | null = await this.usersRepository.findOneBy({
      email: credentials.email,
    });
    if (!findUser) {
      throw new BadRequestException('Credenciales incorrectas');
    }
    const passwordMatch = await bcrypt.compare(
      credentials.password,
      findUser.password,
    );
    if (!passwordMatch)
      throw new BadRequestException('Credenciales incorrectas');

    const payload = {
      id: findUser.id,
      email: findUser.email,
      isAdmin: findUser.isAdmin,
      roles: findUser.isAdmin ? ['Admin'] : ['User'],
    };

    const token = this.jwtService.sign(payload);

    return token;
  }

  async createUser(user: CreateUserDto) {
    try {
      const findUser = await this.usersRepository.findOneBy({
        email: user.email,
      });
      if (findUser) {
        throw new BadRequestException('El usuario ya está registrado');
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await this.usersRepository.save({
        ...user,
        password: hashedPassword,
      });
      const { password, ...userWithoutPassword } = newUser;
      return {
        data: userWithoutPassword,
        message: 'Usuario registrado correctamente',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('No se pudo registrar el usuario');
    }
  }
}
