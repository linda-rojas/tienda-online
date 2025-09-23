import { PartialType } from '@nestjs/mapped-types';
import { CreateCuponeDto } from './create-cupone.dto';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, Max, MaxLength, Min } from 'class-validator';
import { IsFutureDate } from 'src/common/validators/is-future-date.validator';

export class UpdateCuponeDto extends PartialType(CreateCuponeDto) {
    @IsNotEmpty({ message: "El nombre del cupon es obligatorio" })
    @MaxLength(30, { message: 'El nombre no puede tener mas de 30 caracteres' })
    @IsOptional()
    nombre?: string;

    @IsNotEmpty({ message: "El descuento no puede ir vacio" })
    @IsInt({ message: "El descuento debe ser entre 1 y 100" })
    @Max(100, { message: "El descuento máximo es de 100" })
    @Min(1, { message: "El descuento máximo es de 1" })
    @IsOptional()
    porcentaje?: number;

    @IsNotEmpty({ message: "La fecha del cupon es obligatoria" })
    @IsDateString({}, { message: "Fecha no válida" })
    @IsFutureDate({ message: "La fecha de expiración debe ser futura" })
    @IsOptional()
    expiracionFecha?: Date;
}
