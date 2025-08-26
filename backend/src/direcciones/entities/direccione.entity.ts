import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ResidenceInterface } from "../interfaces/residence.interface";

@Entity({ name: 'direcciones' })
export class Direccione implements ResidenceInterface{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false})
    departamento: string;

    @Column({ type: 'varchar', length: 100, nullable: false})
    ciudad: string;

    @Column({ type: 'varchar', length: 255, nullable: false})
    direccion: string;

    @Column({ type: 'numeric', length: 10, nullable: false})
    celular: number;
}
