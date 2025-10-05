import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  IsNotEmpty,
  Min,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Nokia Ladrillo',
    minLength: 3,
    maxLength: 80,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'El nombre del producto debe tener al menos 3 caracteres.',
  })
  @MaxLength(80, {
    message: 'El nombre del producto no puede exceder los 80 caracteres.',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Teléfono clásico robusto y durable',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres.',
  })
  @MaxLength(500, {
    message: 'La descripción no puede exceder los 100 caracteres.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Precio del producto en dólares',
    example: 99.99,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'El precio debe ser mayor o igual a 0.' })
  price: number;

  @ApiProperty({
    description: 'Cantidad disponible en stock',
    example: 100,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'El stock debe ser mayor o igual a 0.' })
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/image.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida.' })
  imgUrl?: string;

  @ApiProperty({
    description: 'ID de la categoría a la que pertenece el producto',
    example: '45bfb122-9b90-4b07-8e92-ea84b97c9c44',
  })
  @IsNotEmpty()
  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido.' })
  categoryId: string;
}
