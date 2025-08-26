import { IsNotEmpty, IsNumber, isNumber, IsString } from "class-validator";
import { ProductInterface } from "../interfaces/product.interface";
import { Categoria } from "src/categorias/entities/categoria.entity";

export class CreateProductoDto implements ProductInterface {
    id: number;
    
    @IsNotEmpty({message: "El nombre del producto no Puede ir vacio"})
    @IsString({message: 'El nombre no es valido'})
    nombre: string;

    subtitulo: string;

    @IsNumber({maxDecimalPlaces: 0}, {message: 'Cantidad no válida'})
    descuento: number;

    descripcion: string;

    imagen_url: string;

    imagen_url2: string;

    @IsNumber({maxDecimalPlaces: 0}, {message: 'Cantidad no válida'})
    stock: number;

    @IsNumber({maxDecimalPlaces: 3}, {message: 'Cantidad no válida'})
    precio: number;

    categoriaId: Categoria;
}
