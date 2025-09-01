import { Usuario } from "../../usuarios/entities/usuario.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleInterface } from "../interfaces/role.interface";

@Entity({ name: 'roles' })
export class Role implements RoleInterface {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 30 })
    nombre: string;

    @OneToMany(() => Usuario, (usuario) => usuario.role)
    usuarios: Usuario[];
}
