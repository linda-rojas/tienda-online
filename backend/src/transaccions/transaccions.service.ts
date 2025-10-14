import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaccion } from './entities/transaccion.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Producto } from '../productos/entities/producto.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CuponesService } from '../cupones/cupones.service';
import { TransaccionContenidos } from './entities/transaccion-contenidos.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class TransaccionsService {
  constructor(
    @InjectRepository(Transaccion) private readonly transaccionesRepository: Repository<Transaccion>,
    @InjectRepository(TransaccionContenidos) private readonly transaccionesContenidosRepository: Repository<TransaccionContenidos>,
    @InjectRepository(Producto) private readonly productosRepository: Repository<Producto>,
    private readonly couponService: CuponesService
  ) { }


  async create(createTransaccionDto: CreateTransaccionDto) {

    await this.productosRepository.manager.transaction(async (transactionEntityManager) => {
      const errors: string[] = [];
      const usuarioId = createTransaccionDto.usuarioId;
      const usuario = await transactionEntityManager.findOneBy(Usuario, { id: usuarioId })
      if (!usuario) {
        errors.push(`usuario con id: ${usuarioId} no fue encontrado`)
        throw new NotFoundException(errors);
      }
      const transaccion = new Transaccion()
      const total = createTransaccionDto.contents.reduce((total, item) => total + (item.cantidad * item.precio), 0)
      transaccion.total = total
      transaccion.usuario = usuario

      if (createTransaccionDto.cupon) {
        const coupon = await this.couponService.applyCupon(createTransaccionDto.cupon)
        const discount = (coupon.porcentaje / 100) * total
        transaccion.descuento = discount
        transaccion.cupon = coupon.nombre
        transaccion.total -= discount
      }

      for (const contents of createTransaccionDto.contents) {
        const errors: string[] = [];

        const producto = await transactionEntityManager.findOneBy(Producto, { id: contents.productoId })

        if (!producto) {
          errors.push(`Producto con id: ${contents.productoId} no fue encontrado`)
          throw new NotFoundException(errors);
        }

        if (contents.cantidad > producto.stock) {
          errors.push(`El articulo ${producto.nombre} exede la cantidad disponible`)
          throw new BadRequestException(errors)
        }
        producto.stock -= contents.cantidad

        // crear instancia de TransaccionContenidos
        const transactionContents = new TransaccionContenidos()
        transactionContents.precio = contents.precio
        transactionContents.producto = producto
        transactionContents.cantidad = contents.cantidad
        transactionContents.transaccion = transaccion

        await transactionEntityManager.save(transaccion);
        await transactionEntityManager.save(transactionContents);
      }
    })

    return { message: "Venta almacenada correctamente" };
  }

  findAll(transacciondate?: string) {
    const options: FindManyOptions<Transaccion> = {
      relations: {
        contents: true,
        usuario: true
      }
    }

    // revisa en el query si tenemos un transactiondate
    if (transacciondate) {
      const date = parseISO(transacciondate)
      if (!isValid(date)) {
        throw new BadRequestException('Fecha no válida')
      }

      // inicia y donde termina la fecha
      const start = startOfDay(date)
      const end = endOfDay(date)

      options.where = {
        transaccionDate: Between(start, end)
      }
    }

    return this.transaccionesRepository.find(options);
  }


  async findOne(id: number) {
    const transaction = await this.transaccionesRepository.findOne({
      where: {
        id
      },
      relations: ['contents', 'usuario'],
    })

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada')
    }

    return transaction;
  }


  async remove(id: number) {
    const trasaction = await this.findOne(id)

    for (const contents of trasaction.contents) {
      const product = await this.productosRepository.findOneBy({ id: contents.producto.id })
      if (product) {
        product.stock += contents.cantidad
        await this.productosRepository.save(product)
      }

      const transactionContents = await this.transaccionesContenidosRepository.findOneBy({ id: contents.id })
      if (transactionContents) {
        await this.transaccionesContenidosRepository.remove(transactionContents)
      }
    }

    await this.transaccionesRepository.remove(trasaction)
    return { message: 'Venta Eliminada' };
  }
}
