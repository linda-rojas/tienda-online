import { IsNotEmpty } from "class-validator";
import { ResidenceInterface } from "../interfaces/residence.interface";


export class CreateDireccioneDto implements ResidenceInterface{
    id: number;
    departamento: string;
    ciudad: string;
    @IsNotEmpty({message: "Direccion no Puede ir vacio"})
    direccion: string;
    celular: number;
}
