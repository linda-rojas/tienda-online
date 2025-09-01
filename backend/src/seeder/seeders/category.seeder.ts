import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Repository } from 'typeorm';
import { categories } from '../data/categories';

@Injectable()
export class CategorySeeder {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoryRepository: Repository<Categoria>,
  ) {}

  // Método para poblar categorías
  async seed() {
    console.log('Iniciando el seeder de categorías...');

    if (categories.length === 0) {
      console.log('No hay nuevas categorías para insertar.');
      return; // Si no hay datos en el archivo categories.ts, no hace nada
    }

    for (const categoryData of categories) {
      let existingCategory = await this.categoryRepository.findOneBy({
        nombre: categoryData.nombre, // Buscar por nombre
      });

      if (existingCategory) {
        console.log(`Categoría ${categoryData.nombre} ya existe.`);
      } else {
        const newCategory = this.categoryRepository.create(categoryData); // Crear nueva categoría
        console.log(`Categoría ${categoryData.nombre} insertada.`);
        await this.categoryRepository.save(newCategory); // Insertar nueva categoría
      }
    }

    console.log('Seeding de categorías completado.');
  }
}
