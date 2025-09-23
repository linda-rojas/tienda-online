import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, Length, Matches, MaxLength } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @IsNotEmpty({ message: "El nombre del usuario no Puede ir vacio" })
    @MaxLength(30, { message: 'El nombre no puede tener mas de 30 caracteres' })
    @IsOptional()
    nombre?: string;

    @MaxLength(50, { message: 'El apellidos no puede tener mas de 50 caracteres' })
    @IsNotEmpty({ message: "El campo apellidos no puede ir vacio" })
    @IsOptional()
    apellidos?: string;

    @IsNotEmpty({ message: "El campo celular no puede ir vacio" })
    @Length(10, 10, { message: 'El número de celular debe tener exactamente 10 dígitos' })
    @IsOptional()
    celular?: string;

    @IsEmail({}, { message: 'El correo no es válido' })
    @IsNotEmpty({ message: "El correo no puede ir vacio" })
    @MaxLength(100, { message: 'El correo no puede tener mas de 100 caracteres' })
    @IsOptional()
    correo?: string;

    @IsNotEmpty({ message: "El campo contraseña no puede ir vacio" })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, una minúscula y un número.'
    })
    @IsOptional()
    contraseña?: string;
}
