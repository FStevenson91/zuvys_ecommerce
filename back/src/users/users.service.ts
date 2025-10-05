import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getUsers(page?: number, limit?: number): Promise<Users[]> {
    const users = await this.usersRepository.find();

    if (users.length === 0) {
      throw new NotFoundException('Usuarios no encontrados');
    }

    if (page !== undefined && limit !== undefined) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return users.slice(startIndex, endIndex);
    }

    return users;
  }
  async findById(id: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        order: {
          orderDetails: {
            products: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Eliminar isAdmin de la respuesta usando destructuring
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isAdmin, ...rest } = user;
    return rest;
  }
}
