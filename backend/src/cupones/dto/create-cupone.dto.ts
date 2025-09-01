import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator";
import { CouponsInterface } from "../interfaces/coupons.interface";


export class CreateCuponeDto implements CouponsInterface{
    id: number;
    @IsNotEmpty({message: "El nombre del cupon es obligatorio"})
    nombre: string;

    @IsNotEmpty({message: "El descuento no puede ir vacio"})
    @IsInt({message: "El descuento debe ser entre 1 y 100"})
    @Max(100, {message: "El descuento máximo es de 100"})
    @Min(1, {message: "El descuento máximo es de 1"})

    porcentaje: number;
    
    @IsNotEmpty({message: "La fecha del cupon es obligatoria"})
    @IsDateString({}, {message: "Fecha no válida"})
    expiracionFecha: Date;
}
