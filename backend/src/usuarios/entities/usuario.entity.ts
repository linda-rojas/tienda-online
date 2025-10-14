import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserInterface } from "../interfaces/user.interface";
import { Direccione } from "../../direcciones/entities/direccione.entity";
import { Role } from "../../roles/entities/role.entity";
import { Transaccion } from "src/transaccions/entities/transaccion.entity";
import { Producto } from "src/productos/entities/producto.entity";

@Entity({ name: 'usuarios' })
export class Usuario implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 50, scale: 0, nullable: false })
  apellidos: string;

  @Column({ type: 'numeric', nullable: false })
  celular: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  correo: string;

  @Column({ type: 'text', nullable: false, select: false })
  contrasena: string;

  @OneToMany(() => Direccione, (direccion) => direccion.usuario, { cascade: true })
  direcciones: Direccione[];

  @ManyToOne(() => Role, (role) => role.usuarios, { cascade: true })
  role: Role;

  @OneToMany(() => Transaccion, (transaccion) => transaccion.usuario)
  transacciones: Transaccion[]; // Relación con las transacciones del usuario

  @OneToMany(() => Producto, (producto) => producto.usuario)
  productos: Producto[]; // Relación inversa con Producto
}
