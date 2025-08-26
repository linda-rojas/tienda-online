import { PartialType } from '@nestjs/mapped-types';
import { CreateDireccioneDto } from './create-direccione.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateDireccioneDto extends PartialType(CreateDireccioneDto) {
    id: number;
        departamento: string;
        ciudad: string;
        @IsNotEmpty({message: "Direccion no Puede ir vacio"})
        direccion: string;
        celular: number;
}
