import { IsNotEmpty, IsNumber } from "class-validator";
import { ResidenceInterface } from "../interfaces/residence.interface";


export class CreateDireccioneDto implements ResidenceInterface{
    id: number;
    @IsNotEmpty({message: "Departamento no Puede ir vacio"})
    departamento: string;

    @IsNotEmpty({message: "Ciudad no Puede ir vacio"})
    ciudad: string;

    @IsNotEmpty({message: "Dirección no Puede ir vacio"})
    direccion: string;

    @IsNotEmpty({message: "Celular no Puede ir vacio"})
    @IsNumber()
    celular: number;
}
