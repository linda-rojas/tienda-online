import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsNotEmpty({ message: "El nombre del rol no Puede ir vacio" })
    @IsString({ message: 'El nombre no es valido' })
    @MaxLength(30, { message: 'El nombre no puede tener mas de 30 caracteres' })
    @IsOptional()
    nombre?: string;
}
