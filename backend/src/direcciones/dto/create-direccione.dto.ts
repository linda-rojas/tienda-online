import { IsDefined, IsNotEmpty, IsNumber, IsPositive, Length, MaxLength } from "class-validator";
import { ResidenceInterface } from "../interfaces/residence.interface";


export class CreateDireccioneDto implements Omit<ResidenceInterface, 'id'> {
    @IsNotEmpty({ message: "Departamento no Puede ir vacio" })
    @MaxLength(100, { message: 'El campo departamento no puede tener mas de 100 caracteres' })
    @IsDefined({ message: 'El departamento es obligatorio' })
    departamento: string;

    @IsNotEmpty({ message: "Ciudad no Puede ir vacio" })
    @MaxLength(100, { message: 'El campo ciudad no puede tener mas de 100 caracteres' })
    @IsDefined({ message: 'El campo departamento es obligatorio' })
    ciudad: string;

    @IsNotEmpty({ message: "Dirección no Puede ir vacio" })
    @MaxLength(255, { message: 'El campo direccion no puede tener mas de 255 caracteres' })
    @IsDefined({ message: 'El campo direccion es obligatorio' })
    direccion: string;

    @IsNotEmpty({ message: "celular no Puede ir vacio" })
    @IsDefined({ message: 'El campo celular es obligatorio' })
    @Length(10, 10, { message: 'El número de celular debe tener exactamente 10 dígitos' })
    celular: string;
}
