import { IsDefined, IsNotEmpty, IsNumber, isNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { ProductInterface } from "../interfaces/product.interface";
import { Categoria } from "../../categorias/entities/categoria.entity";

export class CreateProductoDto implements Omit<ProductInterface, 'id'> {

    @IsNotEmpty({ message: "El nombre del producto no Puede ir vacio" })
    @IsString({ message: 'El nombre no es valido' })
    @IsDefined()
    @MaxLength(50, { message: 'El nombre no puede tener mas de 50 caracteres' })
    nombre: string;

    @MaxLength(150, { message: 'El subtitulo no puede tener mas de 150 caracteres' })
    subtitulo: string;

    @IsNumber()
    @IsOptional()
    descuento: number;

    @IsNotEmpty({ message: "La descripcion del producto no Puede ir vacia" })
    @IsString({ message: 'La descripcion no es valida' })
    descripcion: string;

    imagen_url: string;
    imagen_url2: string;

    @IsNotEmpty({ message: "El stock del producto no Puede ir vacio" })
    @IsNumber({ maxDecimalPlaces: 0 }, { message: 'stock no válido' })
    @Min(1, { message: 'El stock no puede ser menor a 1' })
    stock: number;

    @IsNotEmpty({ message: "El precio del producto no Puede ir vacio" })
    @IsNumber({ maxDecimalPlaces: 3 }, { message: 'precio no válido' })
    @Min(1, { message: 'El precio no puede ser menor a 1' })
    precio: number;

    @IsNotEmpty({ message: "La categoriaId del producto no Puede ir vacio" })
    @IsNumber({ maxDecimalPlaces: 3 }, { message: 'categoriaId no válido' })
    categoriaId: Categoria;
}
