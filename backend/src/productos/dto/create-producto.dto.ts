import { IsNotEmpty } from "class-validator";
import { ProductInterface } from "../interfaces/product.interface";

export class CreateProductoDto implements ProductInterface {
    id: number;
    
    categoria: string;
    
    @IsNotEmpty({message: "El nombre del producto no Puede ir vacio"})
    nombre: string;

    subtitulo: string;

    descuento: number;

    descripcion: string;

    imagen_url: string;

    imagen_url2: string;

    stock: number;

    precio: number;
}
