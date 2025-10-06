import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCuponeDto } from './dto/create-cupone.dto';
import { UpdateCuponeDto } from './dto/update-cupone.dto';
import { Repository } from 'typeorm';
import { Cupone } from './entities/cupone.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfDay, isAfter } from 'date-fns';
import { ValidationService } from 'src/services/validation.service';

@Injectable()
export class CuponesService {
  constructor(
    @InjectRepository(Cupone) private readonly CuponesRepository: Repository<Cupone>,
    @Inject(ValidationService) private readonly validationService: ValidationService, // servicio de validación
  ) { }

  async create(createCuponeDto: CreateCuponeDto) {
    try {
      return await this.CuponesRepository.save(createCuponeDto);

    } catch (error) {
      this.validationService.handleExceptions(error)
    }
  }

  findAll() {
    return this.CuponesRepository.find();
  }

  async findOne(id: number) {
    const cupon = await this.CuponesRepository.findOneBy({ id })

    if (!cupon) {
      throw new NotFoundException(`El cupón con el id: ${id} no fue encontrado`)
    }
    return cupon;
  }

  async update(id: number, updateCuponeDto: UpdateCuponeDto) {
    try {
      const coupon = await this.findOne(id);

      Object.assign(coupon, updateCuponeDto)
      return await this.CuponesRepository.save(coupon);

    } catch (error) {
      this.validationService.handleExceptions(error);
    }
  }

  async remove(id: number) {
    const coupon = await this.findOne(id);
    await this.CuponesRepository.remove(coupon)
    return { message: `El cupon ha sido eliminado` };
  }

  async applyCupon(nombre: string) {
    const coupon = await this.CuponesRepository.findOneBy({ nombre })
    if (!coupon) {
      throw new NotFoundException("El cupon no existe")
    }

    const currentDate = new Date()
    const expirationDate = endOfDay(coupon.expiracionFecha)

    if (isAfter(currentDate, expirationDate)) {
      throw new UnprocessableEntityException("El cupón ya no existe")
    }

    return {
      message: 'Cupón Válido',
      ...coupon
    }
  }
}
