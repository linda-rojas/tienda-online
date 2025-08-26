import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriasService {
  constructor(
          @InjectRepository(Categoria) private readonly CategoriesRepository : Repository<Categoria>
        ) {}

  create(createCategoriaDto: CreateCategoriaDto) {
    return this.CategoriesRepository.save(createCategoriaDto);
  }

  findAll() {
    return this.CategoriesRepository.find();
  }

  async findOne(id: number) {
    const categoria = await this.CategoriesRepository.findOneBy({id})
      // si no existe ese id retorna:
      if (!categoria) {
        throw new NotFoundException('La categoria no existe')
      }
      return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id)
    categoria.nombre = updateCategoriaDto.nombre

    return await this.CategoriesRepository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id)
    await this.CategoriesRepository.remove(categoria)
    return 'categoria eliminada';
  }
}
