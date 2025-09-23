import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CouponsInterface } from "../interfaces/coupons.interface";

@Entity({ name: 'cupones' })
export class Cupone implements CouponsInterface {
    static expirationDate(expirationDate: any) {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 30, unique: true })
    nombre: string;

    @Column({ type: 'integer' })
    porcentaje: number;

    @Column({ type: 'date' })
    expiracionFecha: Date;
}
