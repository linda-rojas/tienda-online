import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto) private readonly productoRepository : Repository<Producto>,
    @InjectRepository(Categoria) private readonly categoriaRepository : Repository<Categoria>

  ) {}

  async create(createProductoDto: CreateProductoDto) {
    const categoria = await this.categoriaRepository.findOneBy({ id: createProductoDto.categoriaId as unknown as number });
    // si no existe ese id retorna:
    if (!categoria) {
      let errors: string[] = [];
      errors.push('la categoria no existe');
      throw new NotFoundException(errors);
    }

    return this.productoRepository.save({
      ...CreateProductoDto,
      categoria
    })
  }


  async findAll(categoriaId: number | null, take: number, skip: number) {

    const options : FindManyOptions<Producto> = {
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

    const [ productos, total ] = await this.productoRepository.findAndCount(options)

      return {
      productos, // muestra todos los datos de la consulta
      total // registros en total
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
    const producto = await this.findOne(id)
    Object.assign(producto, updateProductoDto)

    if (updateProductoDto.categoriaId) {
        const categoria = await this.categoriaRepository.findOneBy({ id: updateProductoDto.categoriaId as unknown as number });
        // si no existe ese id retorna:
        if (!categoria) {
          let errors: string[] = [];
          errors.push('la categoria no existe');
          throw new NotFoundException(errors);
        }
        producto.categoria = categoria
    }
    return await this.productoRepository.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id)
    await this.productoRepository.remove(producto)
    return 'Producto eliminado';
  }
}
