import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
        id: number;
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
