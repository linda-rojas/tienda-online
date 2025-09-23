import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDireccioneDto } from './dto/create-direccione.dto';
import { UpdateDireccioneDto } from './dto/update-direccione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Direccione } from './entities/direccione.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DireccionesService {
  constructor(
    @InjectRepository(Direccione)
    private readonly direccionesRepository: Repository<Direccione>
  ) { }

  async create(createDireccioneDto: CreateDireccioneDto, userId: number) {
    const { ...address } = createDireccioneDto;
    const newDireccion = this.direccionesRepository.create({
      ...createDireccioneDto,
      usuario: { id: userId },
    });

    return this.direccionesRepository.save(newDireccion);
  }

  findAll() {
    return this.direccionesRepository.find();
  }

  async findOne(id: number) {
    const direccion = await this.direccionesRepository.findOneBy({ id })
    // si no existe ese id retorna:
    if (!direccion) {
      throw new NotFoundException('La direccion no existe')
    }
    return direccion;
  }

  async update(id: number, updateDireccioneDto: UpdateDireccioneDto) {
    const direccion = await this.findOne(id)
    direccion.departamento = updateDireccioneDto.departamento
    return await this.direccionesRepository.save(direccion);
  }

  async remove(id: number) {
    const direccion = await this.findOne(id)
    await this.direccionesRepository.remove(direccion)
    return 'direccion eliminada';
  }
}
