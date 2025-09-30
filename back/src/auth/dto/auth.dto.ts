import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Felipe Stevenson',
    minLength: 3,
    maxLength: 80,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'El nombre debe contener al menos 3 carácteres.',
  })
  @MaxLength(80, {
    message: 'El nombre debe ser máximo de 80 carácteres.',
  })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'usuario@example.com',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña segura con mayúscula, minúscula, número y símbolo',
    example: 'Miclave123!',
    minLength: 8,
    maxLength: 15,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.',
  })
  password: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Av. Siempre Viva 742',
    minLength: 3,
    maxLength: 80,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: 987654321,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @ApiProperty({
    description: 'País del usuario',
    example: 'Chile',
    minLength: 5,
    maxLength: 20,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country: string | undefined;

  @ApiProperty({
    description: 'Ciudad del usuario',
    example: 'Santiago',
    minLength: 5,
    maxLength: 20,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city: string | undefined;
}

export class LoginDto extends PickType(CreateUserDto, ['email', 'password']) {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.',
  })
  password: string;
}
