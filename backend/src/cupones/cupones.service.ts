import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCuponeDto } from './dto/create-cupone.dto';
import { UpdateCuponeDto } from './dto/update-cupone.dto';
import { Repository } from 'typeorm';
import { Cupone } from './entities/cupone.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CuponesService {
  constructor(
    @InjectRepository(Cupone) private readonly CuponesRepository : Repository<Cupone>
  ) {}

  create(createCuponeDto: CreateCuponeDto) {
    return this.CuponesRepository.save(createCuponeDto);
  }

  findAll() {
    return this.CuponesRepository.find();
  }

  async findOne(id: number) {
    const cupon = await this.CuponesRepository.findOneBy({id})

    if (!cupon) {
      throw new NotFoundException(`El cupón con el id: ${id} no fue encontrado`)
    }
    return cupon;
  }

  async update(id: number, updateCuponeDto: UpdateCuponeDto) {
    const cupon = await this.findOne(id);

    if (!cupon) {
      throw new NotFoundException(`Cupón con ID ${id} no encontrado`);
    }

    Object.assign(cupon, updateCuponeDto);

    return await this.CuponesRepository.save(cupon);
  }

  async remove(id: number) {
    const cupon = await this.findOne(id);
    await this.CuponesRepository.remove(cupon)
    return {message: `cupon con el nombre: ${cupon.nombre} ha sido eliminado`};
  }

  async applyCupon(nombre: string) {

    const coupon = await this.CuponesRepository.findOneBy({ nombre })
    if (!coupon) {
      throw new NotFoundException("El cupon no existe")
    }

    const currentDate = new Date()
    const expirationDate =  endOfDay(coupon.expiracionFecha)
    
    if (isAfter(currentDate, expirationDate)) {
      throw new UnprocessableEntityException("El cupón ya no existe")
    }

    return {
      message: 'Cupón Válido',
      ...coupon
    }
  }
}
