import { ArrayNotEmpty, IsArray, IsDefined, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, MaxLength, ValidateNested } from "class-validator";
import { UserInterface } from "../interfaces/user.interface";
import { Type } from "class-transformer";
import { Direccione } from "src/direcciones/entities/direccione.entity";
import { CreateDireccioneDto } from "src/direcciones/dto/create-direccione.dto";

export class CreateUsuarioDto implements UserInterface {
    id: number;

    @IsNotEmpty({ message: "El nombre del usuario no Puede ir vacio" })
    @IsString()
    @MaxLength(30, { message: 'El nombre no puede tener mas de 30 caracteres' })
    @IsDefined({ message: "El nombre del usuario es obligatorio" })
    nombre: string;

    @IsNotEmpty({ message: "El campo apellidos no puede ir vacio" })
    @IsString()
    @MaxLength(50, { message: 'El apellidos no puede tener mas de 50 caracteres' })
    @IsDefined({ message: "El campo apellidos es obligatorio" })
    apellidos: string;

    @IsNotEmpty({ message: "El campo celular no puede ir vacio" })
    @IsString()
    @Length(10, 10, { message: 'El número de celular debe tener exactamente 10 dígitos' })
    @IsDefined({ message: "El campo celular es obligatorio" })
    celular: string;

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
    contraseña: string;

    @IsArray({ message: 'Debes enviar un arreglo de direcciones' })
    @ArrayNotEmpty({ message: 'Debes incluir una dirección' })
    @ValidateNested({ each: true })
    @Type(() => CreateDireccioneDto)
    direcciones: CreateDireccioneDto[];
}
