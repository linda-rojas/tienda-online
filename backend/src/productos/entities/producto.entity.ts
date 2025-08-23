import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ProductInterface } from "../interfaces/product.interface";

@Entity({ name: 'productos' })
export class Producto implements ProductInterface {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 15 })
    categoria: string
    
    @Column({ type: 'varchar', length: 50 })
    nombre: string

    @Column({ type: 'varchar', length: 150 })
    subtitulo: string

    @Column({ type: 'numeric', nullable: true })
    descuento: number;

    @Column({ type: 'text', nullable: true })
    descripcion: string

    @Column({ type: 'text', nullable: true })
    imagen_url: string;

    @Column({ type: 'text', nullable: true })
    imagen_url2: string

    @Column({ type: 'numeric' })
    stock: number

    @Column({ type: 'numeric' })
    precio: number;
}

