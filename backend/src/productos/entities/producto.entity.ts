import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductInterface } from "../interfaces/product.interface";
import { Categoria } from "../../categorias/entities/categoria.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";

@Entity({ name: 'productos' })
export class Producto implements ProductInterface {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    nombre: string

    @Column({ type: 'varchar', length: 150, nullable: true })
    subtitulo: string

    @Column({ type: 'numeric', nullable: true })
    descuento: number;

    @Column({ type: 'text', nullable: false })
    descripcion: string

    @Column({ type: 'text', nullable: true })
    imagen_url: string;

    @Column({ type: 'text', nullable: true })
    imagen_url2: string

    @Column({ type: 'numeric', nullable: false })
    stock: number

    @Column({ type: 'numeric', nullable: false })
    precio: number;

    @Column({ name: "categoriaId", type: "int", nullable: false })
    categoriaId: number;

    @ManyToOne(() => Categoria)
    @JoinColumn({ name: "categoriaId" })
    categoria: Categoria;

    @Column({ type: 'int', nullable: true })
    usuarioId: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.productos)
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario; // Relación con Usuario
}

