import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './producto.entity';

export type ImageType = 'primary' | 'secondary' | 'gallery';

@Entity({ name: 'imagenes' })
export class Imagen {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    url: string;

    @Column({ type: 'varchar', length: 20 })
    type: ImageType;


    @Column({ nullable: true })
    publicId: string;


    @ManyToOne(() => Producto, (producto) => producto.imagenes, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'productoId' })
    producto: Producto; // Relación con Producto
}
