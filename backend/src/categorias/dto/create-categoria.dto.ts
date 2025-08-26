import { IsNotEmpty } from "class-validator";
import { CategoriesInterface } from "../interfaces/categories.interface";

export class CreateCategoriaDto implements CategoriesInterface{
    id: number;
    @IsNotEmpty({message: "el nombre de la categoria no puede ir vacio"})
    nombre: string;
}
