export interface ProductInterface {
    id: number;
    nombre: string;
    subtitulo: string;
    descuento: number | null;
    descripcion: string | null;
    imagen_url: string | null;
    imagen_url2: string | null;
    stock: number;
    precio: number;
}