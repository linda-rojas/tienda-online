import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserInterface } from "../interfaces/user.interface";

@Entity({ name: 'usuarios' })
export class Usuario implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false})
  nombre: string;

  @Column({ type: 'varchar', length: 50, scale: 0, nullable: false })
  apellidos: string;

  @Column({ type: 'numeric', length: 10, nullable: false })
  celular: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  correo: string; 

  @Column({ type: 'text', nullable: false })
  contraseña: string;

  @Column({ type: 'varchar', length: 255 })
  direcciones: string;
}
