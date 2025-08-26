import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    id: number;
    nombre: string;
    apellidos: string;
    celular: number;
    @IsNotEmpty({message: "El correo del usuario no Puede ir vacio"})
    correo: string;
    contraseña: string;
    direcciones: string
}
