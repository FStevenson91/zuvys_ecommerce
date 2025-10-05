import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Array de IDs de productos a agregar a la orden',
    example: [
      '784b1f33-40d9-4fea-880e-e5452e0467fe',
      'e8cc1b78-6356-4b65-b923-489f069434f6',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  products: string[];
}
