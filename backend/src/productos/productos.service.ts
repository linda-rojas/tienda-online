import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Categoria } from '../categorias/entities/categoria.entity';
import { ValidationService } from 'src/services/validation.service';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto) private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria) private readonly categoriaRepository: Repository<Categoria>,
    @Inject(ValidationService) private readonly validationService: ValidationService

  ) { }

  async create(createProductoDto: CreateProductoDto) {
    try {
      const categoria = await this.categoriaRepository.findOneBy({ id: createProductoDto.categoriaId as unknown as number });
      // si no existe ese id retorna:
      if (!categoria) {
        throw new NotFoundException('la categoria no existe');
      }

      // Verificar si ya existe un producto con el mismo nombre
      await this.validationService.existsOrFail(
        this.productoRepository,
        'nombre',
        createProductoDto.nombre,
        'El nombre del producto ya está en uso'
      );

      return this.productoRepository.save({
        ...createProductoDto,
        categoria,
      })
    } catch (error) {
      this.validationService.handleExceptions(error)
    }
  }

  async findAll(categoriaId: number | null, take: number, skip: number) {
    try {
      const options: FindManyOptions<Producto> = {
        // para que me traiga la categoria
        relations: {
          categoria: true
        },
        order: {
          id: 'DESC'
        },
        take,
        skip
      }

      if (categoriaId) {
        options.where = {
          categoria: {
            id: categoriaId
          }
        }
      }

      const [productos, total] = await this.productoRepository.findAndCount(options)

      return {
        productos, // muestra todos los datos de la consulta
        total // registros en total
      }
    } catch (error) {
      this.validationService.handleExceptions(error)

    }
  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({
      where: {
        id
      },
      relations: {
        categoria: true
      }
    })

    if (!producto) {
      throw new NotFoundException(`El producto con el id: ${id} no fue encontrado`)
    }
    return producto;
  }

  // actualiza productos
  async update(id: number, updateProductoDto: UpdateProductoDto) {
    try {
      const productoExistente = await this.findOne(id);

      if (updateProductoDto.categoriaId) {
        const categoria = await this.categoriaRepository.findOneBy({ id: updateProductoDto.categoriaId as unknown as number });
        // si no existe categoria con ese id retorna:
        if (!categoria) {
          throw new NotFoundException('la categoria no existe');
        }
        productoExistente.categoria = categoria
      }

      if (updateProductoDto.nombre && updateProductoDto.nombre !== productoExistente.nombre) {
        // console.log(updateProductoDto.nombre)
        await this.validationService.existsOrFail(
          this.productoRepository,
          'nombre',
          updateProductoDto.nombre,
          'El nombre del producto ya está en uso'
        );
      }

      const producto = await this.productoRepository.preload({
        id: id,
        ...updateProductoDto
      });

      if (!producto) {
        throw new NotFoundException(`El producto con el id: ${id} no fue encontrado`)
      }

      return await this.productoRepository.save(producto);

    } catch (error) {
      this.validationService.handleExceptions(error)
    }
  }

  async remove(id: number) {
    const producto = await this.findOne(id)
    await this.productoRepository.remove(producto)
    return { message: 'Producto eliminado con éxito' };
  }
}
