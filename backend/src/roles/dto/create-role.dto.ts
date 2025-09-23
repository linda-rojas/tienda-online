import { IsDefined, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { RoleInterface } from "../interfaces/role.interface";

export class CreateRoleDto implements RoleInterface {
    @IsNotEmpty({ message: "El nombre del rol no Puede ir vacio" })
    @IsString({ message: 'El nombre no es valido' })
    @MaxLength(30, { message: 'El nombre no puede tener mas de 30 caracteres' })
    @IsDefined()
    nombre: string;
}
