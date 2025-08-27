import { IsNotEmpty } from "class-validator";
import { RoleInterface } from "../interfaces/role.interface";

export class CreateRoleDto implements RoleInterface{
    @IsNotEmpty({message: "El id del rol no Puede ir vacio"})
    id: number;

    @IsNotEmpty({message: "El nombre del rol no Puede ir vacio"})
    nombre: string;
}
