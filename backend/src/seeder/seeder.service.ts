import { Injectable } from '@nestjs/common';
import { ProductSeeder } from './seeders/product.seeder';
import { CategorySeeder } from './seeders/category.seeder';

@Injectable()
export class SeederService {
    constructor(
        private readonly productSeeder: ProductSeeder,
        private readonly categorySeeder: CategorySeeder,
    ){}

    // Método principal que ejecuta todos los seeders
    async seed() {
    console.log('Iniciando el seeding de datos...');
    await this.productSeeder.seed();  // seeder de productos
    await this.categorySeeder.seed(); 

    console.log('Proceso de seeding completado.');
  }
}
