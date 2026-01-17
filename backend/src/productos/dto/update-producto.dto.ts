import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';
import { ProductInterface } from '../interfaces/product.interface';
import { Transform, Type } from 'class-transformer';

export class UpdateProductoDto implements Partial<Omit<ProductInterface, 'id'>> {

        @IsNotEmpty({ message: "El nombre del producto no Puede ir vacio" })
        @IsString({ message: 'El nombre no es valido' })
        @MaxLength(50, { message: 'El nombre no puede tener mas de 50 caracteres' })
        @IsOptional()
        nombre?: string;

        @IsNotEmpty({ message: "El nombre del producto no Puede ir vacio" })
        @IsString({ message: 'El nombre no es valido' })
        @MaxLength(150, { message: 'El subtitulo no puede tener mas de 150 caracteres' })
        @IsOptional()
        subtitulo?: string;

        @IsNumber()
        @Min(0)
        @Type(() => Number)
        @Transform(({ value }) => (value === undefined || value === null ? 0 : value))
        @IsOptional()
        descuento?: number;

        @IsNotEmpty({ message: "La descripcion del producto no Puede ir vacia" })
        @IsString({ message: 'La descripcion no es valida' })
        @IsOptional()
        descripcion?: string;

        @IsOptional()
        @IsArray({ message: 'Las imágenes deben ser un arreglo' })
        @IsUrl({}, { each: true, message: 'Cada imagen debe ser una URL válida' })
        imagenesUrl?: string[];

        @IsNotEmpty({ message: "El stock del producto no Puede ir vacio" })
        @IsNumber({ maxDecimalPlaces: 0 }, { message: 'stock no válido' })
        @IsOptional()
        stock?: number;

        @IsNotEmpty({ message: "El precio del producto no Puede ir vacio" })
        @IsNumber({ maxDecimalPlaces: 3 }, { message: 'precio no válido' })
        @IsOptional()
        precio?: number;

        @IsNotEmpty({ message: "La categoriaId del producto no Puede ir vacio" })
        @IsNumber({ maxDecimalPlaces: 3 }, { message: 'categoriaId no válido' })
        @IsOptional()
        categoriaId?: number;
}
