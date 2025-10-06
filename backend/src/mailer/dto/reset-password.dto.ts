import { IsDefined, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    token: string;

    @IsNotEmpty({ message: "El campo nuevaContraseña no puede ir vacio" })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La nuevaContraseña debe tener una letra mayúscula, una minúscula y un número.'
    })
    @IsDefined({ message: "El campo nuevaContraseña es obligatorio" })
    nuevaContraseña: string;
}