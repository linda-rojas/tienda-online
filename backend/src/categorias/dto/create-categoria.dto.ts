import { IsDefined, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { CategoriesInterface } from "../interfaces/categories.interface";

export class CreateCategoriaDto implements CategoriesInterface {
    id: number;

    @IsNotEmpty({ message: "el nombre de la categoria no puede ir vacio" })
    @MaxLength(50, { message: 'El nombre no puede tener mas de 50 caracteres' })
    @IsDefined({ message: 'El nombre es obligatorio' })
    @IsString()
    nombre: string;
}
