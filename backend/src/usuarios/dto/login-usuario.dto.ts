import { IsDefined, IsEmail, IsNotEmpty, Matches, MaxLength } from "class-validator";

export class LoginUsuarioDto {
    @IsEmail({}, { message: 'El correo no es válido' })
    @IsNotEmpty({ message: "El correo no puede ir vacio" })
    @MaxLength(100, { message: 'El correo no puede tener mas de 100 caracteres' })
    @IsDefined({ message: "El campo correo es obligatorio" })
    correo: string;

    @IsNotEmpty({ message: "El campo contraseña no puede ir vacio" })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, una minúscula y un número.'
    })
    @IsDefined({ message: "El campo contraseña es obligatorio" })
    contrasena: string;
}
