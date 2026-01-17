export interface ProductInterface {
    id: number;
    nombre: string;
    subtitulo: string;
    descuento: number | null;
    descripcion: string | null;
    stock: number;
    precio: number;
}