import { Type } from "class-transformer";
import {  ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, Length, ValidateNested } from "class-validator";

export class TransactionContentsDto {
  @IsNotEmpty({ message: 'El ID del producto no puede estar vacío' })
  @IsInt({ message: 'Producto no válido' })
  productoId: number;

  @IsNotEmpty({ message: 'Cantidad no puede estar vacía' })
  @IsInt({ message: 'Cantidad no válida' }) // Validate quantity too
  cantidad: number;

  @IsNotEmpty({ message: 'Precio no puede estar vacío' })
  @IsNumber({}, { message: 'Precio no válido' })
  precio: number;
}

export class CreateTransaccionDto {
  @IsNotEmpty({message: 'El Total no puede ir vacio'})
  @IsNumber({}, {message: 'Cantidad no válida'})
  total: number

  @IsArray()
  @ArrayNotEmpty({message: 'Los Contenidos no pueden ir vacios'})
  @ValidateNested()
  @Type(() => TransactionContentsDto)
  contents: TransactionContentsDto[]
}
