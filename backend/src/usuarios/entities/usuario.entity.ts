import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserInterface } from "../interfaces/user.interface";
import { Direccione } from "src/direcciones/entities/direccione.entity";
import { Role } from "src/roles/entities/role.entity";

@Entity({ name: 'usuarios' })
export class Usuario implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 50, scale: 0, nullable: false })
  apellidos: string;

  @Column({ type: 'numeric', nullable: false })
  celular: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  correo: string; 

  @Column({ type: 'text', nullable: false })
  contraseña: string;

  @OneToMany(() => Direccione, (direccion) => direccion.usuario, { cascade: true })
  direcciones: Direccione[];

  @ManyToOne(() => Role, (role) => role.usuarios, { cascade: true })
  role: Role;

}
