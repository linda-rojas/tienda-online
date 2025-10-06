import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TransactionInterface } from "../interfaces/transaction.interface";
import { TransaccionContenidos } from "./transaccion-contenidos.entity";

@Entity({ name: 'transacciones' })
export class Transaccion implements TransactionInterface {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'decimal' })
    total: number

    @Column({ type: 'varchar', length: 30, nullable: true })
    cupon: string

    @Column({ type: 'decimal', nullable: true, default: 0 })
    descuento: number

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    transaccionDate: Date

    @OneToMany(() => TransaccionContenidos, (transaccion) => transaccion.transaccion)
    contents: TransaccionContenidos[]
}
