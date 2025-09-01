import { Categoria } from "src/categorias/entities/categoria.entity";
import { Cupone } from "src/cupones/entities/cupone.entity";
import { Direccione } from "src/direcciones/entities/direccione.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { Role } from "src/roles/entities/role.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";

export const entities = [
    Producto,
    Categoria,
    Usuario,
    Direccione,
    Role,
    Cupone
]