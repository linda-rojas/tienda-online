import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {
    id: number;
    @IsNotEmpty({message: "el nombre de la categoria no puede ir vacio"})
    nombre: string;
}
