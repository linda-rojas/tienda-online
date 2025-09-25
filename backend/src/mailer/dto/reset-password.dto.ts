import { IsDefined, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    token: string;

    @IsNotEmpty({ message: "El campo contraseña no puede ir vacio" })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, una minúscula y un número.'
    })
    @IsDefined({ message: "El campo contraseña es obligatorio" })
    nuevaContraseña: string;
}