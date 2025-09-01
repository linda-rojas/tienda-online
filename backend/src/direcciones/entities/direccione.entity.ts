import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ResidenceInterface } from "../interfaces/residence.interface";
import { Usuario } from "../../usuarios/entities/usuario.entity";

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

    @Column({ type: 'numeric', nullable: false})
    celular: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.direcciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;
}
