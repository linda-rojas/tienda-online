import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto) private readonly productoRepository : Repository<Producto>,
    @InjectRepository(Categoria) private readonly CategoriaRepository : Repository<Categoria>

  ) {}

  create(createProductoDto: CreateProductoDto) {
    return this.productoRepository.save(createProductoDto);
  }


  findAll() {
    return this.productoRepository.find();
  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findOneBy({id})
    // si no existe ese id retorna:
    if (!producto) {
      throw new NotFoundException('El producto no existe')
    }
    return producto;
  }

  // actualiza productos
  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.findOne(id)
    producto.nombre = updateProductoDto.nombre
    return await this.productoRepository.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id)
    await this.productoRepository.remove(producto)
    return 'Producto eliminado';
  }
}
