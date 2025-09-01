import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Repository } from 'typeorm';
import { products } from '../data/products';

@Injectable()
export class ProductSeeder {
  constructor(
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,

    @InjectRepository(Categoria)
    private readonly categoryRepository: Repository<Categoria>
  ) {}

  // Método para poblar productos
  async seed() {
    console.log('Iniciando el seeder de productos...');

    for (const productData of products) {
      // Buscar si la categoría existe
      const category = await this.categoryRepository.findOne({
        where: { id: Number(productData.categoriaId) },
      });

      if (!category) {
        console.log(`Categoría con ID ${productData.categoriaId} no encontrada. El producto no se insertará.`);
        continue; // Si no encuentras la categoría, no agregues el producto
      }

      // Buscar si el producto ya existe en la base de datos por nombre
      let existingProduct = await this.productRepository.findOneBy({
        nombre: productData.nombre
      });

      if (existingProduct) {
        // Si el producto ya existe, actualizar sus detalles
        existingProduct = Object.assign(existingProduct, productData);
        console.log(`Producto ${productData.nombre} ya existe, actualizando...`);
        await this.productRepository.save(existingProduct); // Actualiza el producto
      } else {
        // Si el producto no existe, lo insertamos
        const { categoriaId, descuento, stock, precio, ...restProductData } = productData;
        const newProduct = this.productRepository.create({
          ...restProductData,
          descuento: Number(descuento),
          stock: Number(stock),
          precio: Number(precio),
          categoria: category,
        });
        console.log(`Producto ${productData.nombre} insertado.`);
        await this.productRepository.save(newProduct); // Inserta el nuevo producto
      }
    }
    console.log('Seeding de productos completado.');
  }
}
