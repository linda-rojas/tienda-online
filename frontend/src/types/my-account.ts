export interface Direccion {
    id: number;
    direccion: string;
    ciudad: string;
    departamento: string;
    celular: string;
}

export interface TransaccionItem {
    producto?: { nombre?: string };
    cantidad: number;
    precio: number;
}

export interface Transaccion {
    transaccionDate: string;
    total: number;
    cupon?: string | null;
    contents?: TransaccionItem[];
    usuario?: { id: number };
}

export type ActiveTab = 'perfil' | 'direcciones' | 'compras';

export interface ProfileForm {
    nombre: string;
    apellidos: string;
    correo: string;
    celular: string;
}

export interface ProfileTouched {
    nombre: boolean;
    apellidos: boolean;
    correo: boolean;
    celular: boolean;
}
