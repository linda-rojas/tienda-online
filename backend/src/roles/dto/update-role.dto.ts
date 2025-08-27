import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsNotEmpty({message: "El id del usuario no Puede ir vacio"})
    id: number;

    @IsNotEmpty({message: "El nombre del rol no Puede ir vacio"})
    nombre: string;
}
