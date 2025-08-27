import { IsNotEmpty } from "class-validator";
import { UserInterface } from "../interfaces/user.interface";

export class CreateUsuarioDto implements UserInterface {
    id: number;
    @IsNotEmpty({message: "El nombre del usuario no Puede ir vacio"})
    nombre: string;
    apellidos: string;
    celular: number;
    correo: string;
    contraseña: string;
}
