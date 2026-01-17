import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './producto.entity'; // Relación con Producto

@Entity({ name: 'imagenes' })
export class Imagen {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    url: string;

    @Column({ type: 'varchar', length: 255 })
    type: string;

    // primary | secondary | gallery

    @ManyToOne(() => Producto, (producto) => producto.imagenes, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'productoId' })
    producto: Producto; // Relación con Producto
}
