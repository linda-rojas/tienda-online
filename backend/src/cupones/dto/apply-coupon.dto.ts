import { IsNotEmpty } from 'class-validator';

export class ApplyCouponDto {
    @IsNotEmpty({message: "El nombre del cupon es obligatorio"})
        cupon_nombre: string;
}
