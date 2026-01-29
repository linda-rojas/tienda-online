import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class GetProductsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "La cantidad debe ser un número" })
    categoria_id?: number

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "La cantidad debe ser un número" })
    @Min(1)
    take?: number

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "La cantidad debe ser un número" })
    skip?: number

    @IsOptional()
    @IsString()
    q?: string; // texto a buscar
}