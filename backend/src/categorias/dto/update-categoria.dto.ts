import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {

    @IsNotEmpty({ message: "el nombre de la categoria no puede ir vacio" })
    @MaxLength(50, { message: 'El nombre no puede tener mas de 50 caracteres' })
    @IsString()
    nombre: string;
}
