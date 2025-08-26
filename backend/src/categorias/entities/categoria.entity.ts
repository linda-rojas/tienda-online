import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoriesInterface } from "../interfaces/categories.interface";
import { Producto } from "src/productos/entities/producto.entity";

@Entity({ name: 'categorias' })
export class Categoria implements CategoriesInterface{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'varchar', length: 50, nullable: false})
    nombre: string;

    @OneToMany(() => Producto, (producto) => producto.categoria, {cascade: true})
    productos: Producto[];

}
