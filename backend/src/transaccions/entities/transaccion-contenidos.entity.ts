import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { TransactionContentsInterface } from "../interfaces/TransactionContentsInterface.interface"
import { Producto } from "src/productos/entities/producto.entity"
import { Transaccion } from "./transaccion.entity"

@Entity({ name: 'contenidotransacciones' })
export class TransaccionContenidos implements TransactionContentsInterface {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'int' })
    cantidad: number

    @Column({ type: 'decimal' })
    precio: number

    @ManyToOne(() => Producto, (producto) => producto.id, { eager: true, cascade: true })
    @JoinColumn({ name: 'productoId' })  // Especifica que la columna en la base de datos es 'productoId'
    producto: Producto

    @ManyToOne(() => Transaccion, (transaccion) => transaccion.contents, { cascade: true })
    @JoinColumn({ name: 'transaccionId' })
    transaccion: Transaccion
}