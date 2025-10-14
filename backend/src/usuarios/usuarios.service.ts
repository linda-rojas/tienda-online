import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaccion } from 'src/transaccions/entities/transaccion.entity';
import { Usuario } from './entities/usuario.entity';
import { Role } from '../roles/entities/role.entity';
import { Direccione } from 'src/direcciones/entities/direccione.entity';
import { TransaccionContenidos } from 'src/transaccions/entities/transaccion-contenidos.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { ValidationService } from 'src/services/validation.service';
import { PasswordResetService } from './services/password-reset.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { comparePasswords, hashPassword } from 'src/auth/bycript.util';
import { Producto } from 'src/productos/entities/producto.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Direccione) private readonly direccioneRepository: Repository<Direccione>,
    @InjectRepository(Producto) private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Transaccion) private readonly transaccionRepository: Repository<Transaccion>,
    @Inject(ValidationService) private readonly validationService: ValidationService,
    private readonly jwtService: JwtService,
    private readonly passwordResetService: PasswordResetService
  ) { }



  // Crear usuario con direcciones
  async create(createUsuarioDto: CreateUsuarioDto): Promise<{ user: Usuario, token: string }> {
    return this.createUserWithRole(createUsuarioDto, 'usuario');
  }

  async createAdmin(createUsuarioDto: CreateUsuarioDto): Promise<{ user: Usuario, token: string }> {
    return this.createUserWithRole(createUsuarioDto, 'administrador');
  }


  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: ['role'],
    });
  }


  async findOne(id: number): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['role', 'direcciones'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const user = await this.findOne(id);

    if (updateUsuarioDto.correo && updateUsuarioDto.correo !== user.correo) {
      // console.log(updateProductoDto.nombre)
      await this.validationService.existsOrFail(
        this.usuarioRepository,
        'correo',
        updateUsuarioDto.correo,
        'El correo ingresado ya está en uso'
      );

    }
    if (updateUsuarioDto.contrasena) {
      updateUsuarioDto.contrasena = await hashPassword(updateUsuarioDto.contrasena);
    }


    const usuario = await this.usuarioRepository.preload({
      id: id,
      ...updateUsuarioDto
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con el id: ${id} no fue encontrado`)
    }

    return await this.usuarioRepository.save(usuario);
  }


  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usuarioRepository.remove(user);
  }

  async login(loginUsuarioDto: LoginUsuarioDto) {
    const { correo, contrasena } = loginUsuarioDto
    const user = await this.usuarioRepository.findOne({
      where: { correo },
      select: { correo: true, contrasena: true, id: true },
      relations: { role: true }
    })

    if (!user) {
      throw new UnauthorizedException(`Usuario con correo ${correo} no encontrado`);
    }

    if (!(await comparePasswords(contrasena, user.contrasena))) {
      throw new UnauthorizedException(`Contraseña incorrecta`);
    }

    return {
      ...user,
      token: this.getJwtToken({
        id: user.id,
        role: user.role.nombre
      })
    };
  }

  private getJwtToken(payload: JwtPayload,) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private async createUserWithRole(
    dto: CreateUsuarioDto,
    roleName: string
  ): Promise<{ user: Usuario, token: string }> {
    const { direcciones, ...userData } = dto;

    await this.validationService.existsOrFail(
      this.usuarioRepository,
      'correo',
      dto.correo,
      'El correo ingresado ya está en uso'
    );

    const role = await this.roleRepository.findOneBy({ nombre: roleName });
    if (!role) {
      throw new NotFoundException(`El rol "${roleName}" no existe`);
    }

    const hashedPassword = await hashPassword(dto.contrasena);

    const newUser = this.usuarioRepository.create({
      ...userData,
      contrasena: hashedPassword,
      role,
    });

    const savedUser = await this.usuarioRepository.save(newUser);

    if (direcciones?.length > 0) {
      const direccionesEntities = direcciones.map(dto =>
        this.direccioneRepository.create({ ...dto, usuario: savedUser })
      );
      await this.direccioneRepository.save(direccionesEntities);
    }

    const token = this.getJwtToken({ id: savedUser.id, role: role.nombre });

    return { user: savedUser, token };
  }

  async requestPasswordReset(correo: string) {
    return this.passwordResetService.requestReset(correo);
  }

  async resetPassword(token: string, nuevaContrasena: string) {
    const hashed = await hashPassword(nuevaContrasena);
    return this.passwordResetService.resetPassword(token, hashed);
  }

  // En UsuariosService
  async realizarCompra(usuarioId: number, productos: { productoId: number; cantidad: number }[]): Promise<Transaccion> {
    // Buscar usuario
    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    // Crear la transacción (compra)
    const nuevaTransaccion = new Transaccion();
    nuevaTransaccion.usuario = usuario; // Asociar el usuario a la compra
    nuevaTransaccion.total = 0; // Inicializar el total

    // Crear el contenido de la transacción (productos comprados)
    const contenidos: TransaccionContenidos[] = [];

    for (const { productoId, cantidad } of productos) {
      // Buscar el producto
      const producto = await this.productoRepository.findOne({ where: { id: productoId } });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
      }

      // Crear el contenido de la transacción (por cada producto)
      const contenido = new TransaccionContenidos();
      contenido.producto = producto;
      contenido.cantidad = cantidad;
      contenido.precio = producto.precio * cantidad; // Calcular el precio total de este producto
      contenidos.push(contenido);

      // Sumar el precio al total de la transacción
      nuevaTransaccion.total += contenido.precio;
    }

    // Asignar los contenidos de la transacción
    nuevaTransaccion.contents = contenidos;

    // Guardar la nueva transacción (compra)
    await this.transaccionRepository.save(nuevaTransaccion);

    return nuevaTransaccion; // Devolver la transacción creada
  }

}
