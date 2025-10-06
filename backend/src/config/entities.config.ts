import { Transaccion } from "src/transaccions/entities/transaccion.entity";
import { Categoria } from "../categorias/entities/categoria.entity";
import { Cupone } from "../cupones/entities/cupone.entity";
import { Direccione } from "../direcciones/entities/direccione.entity";
import { Producto } from "../productos/entities/producto.entity";
import { Role } from "../roles/entities/role.entity";
import { Usuario } from "../usuarios/entities/usuario.entity";
import { TransaccionContenidos } from "src/transaccions/entities/transaccion-contenidos.entity";

export const entities = [
    Producto,
    Categoria,
    Usuario,
    Direccione,
    Role,
    Cupone,
    Transaccion,
    TransaccionContenidos
]