import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TransactionInterface } from "../interfaces/transaction.interface";
import { TransactionContentsInterface } from "../interfaces/TransactionContentsInterface.interface";
import { Producto } from "src/productos/entities/producto.entity";

@Entity({ name: 'transacciones' })
export class Transaccion implements TransactionInterface{
    @PrimaryGeneratedColumn()
    id: number
        
    @Column({ type: 'decimal' })
    total: number
    
    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    transaccionDate: Date

    @OneToMany(() => TransaccionContenidos, (transaccion) => transaccion.transaccion)
    contents: TransaccionContenidos[]
}

@Entity({ name: 'contenidoTransacciones' })
export class TransaccionContenidos implements TransactionContentsInterface{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'int' })
    cantidad: number

    @Column({ type: 'decimal' })
    precio: number

    @ManyToOne(() => Producto, (producto) => producto.id, { eager: true, cascade: true })
    producto: Producto

    @ManyToOne(() => Transaccion, (transaccion) => transaccion.contents, {cascade: true})
    transaccion: Transaccion
}
