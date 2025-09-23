import { PartialType } from '@nestjs/mapped-types';
import { CreateDireccioneDto } from './create-direccione.dto';
import { IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator';

export class UpdateDireccioneDto extends PartialType(CreateDireccioneDto) {
    @IsNotEmpty({ message: "departamento no Puede ir vacio" })
    @MaxLength(100, { message: 'El campo departamento no puede tener mas de 100 caracteres' })
    @IsOptional()
    departamento: string;

    @IsNotEmpty({ message: "ciudad no Puede ir vacio" })
    @MaxLength(100, { message: 'El campo ciudad no puede tener mas de 100 caracteres' })
    @IsOptional()
    ciudad: string;

    @IsNotEmpty({ message: "Direccion no Puede ir vacio" })
    @MaxLength(255, { message: 'El campo direccion no puede tener mas de 255 caracteres' })
    @IsOptional()
    direccion: string;

    @IsNotEmpty({ message: "celular no Puede ir vacio" })
    @Length(10, 10, { message: 'El número de celular debe tener exactamente 10 dígitos' })
    @IsOptional()
    celular?: string;
}
