import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { ValidationService } from 'src/services/validation.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria) private readonly CategoriesRepository: Repository<Categoria>,
    @Inject(ValidationService) private readonly validationService: ValidationService,
  ) { }

  async create(createCategoriaDto: CreateCategoriaDto) {
    const existingProducto = await this.CategoriesRepository.findOne({
      where: { nombre: createCategoriaDto.nombre },
    });

    if (existingProducto) {
      throw new ConflictException('El nombre de la categoria ya está en uso');
    }
    return this.CategoriesRepository.save(createCategoriaDto);
  }

  findAll() {
    return this.CategoriesRepository.find();
  }

  async findOne(id: number) {
    const categoria = await this.CategoriesRepository.findOneBy({ id })
    // si no existe ese id retorna:
    if (!categoria) {
      throw new NotFoundException(`La categoria con el id: ${id} no existe`)
    }

    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    Logger.log(updateCategoriaDto)
    const productoExistente = await this.findOne(id);

    if (updateCategoriaDto.nombre && updateCategoriaDto.nombre !== productoExistente.nombre) {
      await this.validationService.existsOrFail(
        this.CategoriesRepository,
        'nombre',
        updateCategoriaDto.nombre,
        'El nombre de la categoria ya está en uso'
      );
    }

    const categoria = await this.CategoriesRepository.preload({
      id: id,
      ...updateCategoriaDto
    });

    if (!categoria) {
      throw new NotFoundException(`La categoria con el id: ${id} no existe`);
    }

    // if (categoria.nombre === updateCategoriaDto.nombre) {
    //   throw new ConflictException('El nombre de la categoria ya está en uso');
    // }

    return await this.CategoriesRepository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id)
    await this.CategoriesRepository.remove(categoria)
    return 'categoria eliminada';
  }
}
