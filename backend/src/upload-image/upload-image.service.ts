import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryResponse } from './upload-image.response';
import { Imagen } from 'src/productos/entities/imagenes.entity';
import { ProductosService } from 'src/productos/productos.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import streamifier from 'streamifier';
import { UploadImageRequest } from './upload-image-request.interface';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class UploadImageService {
  constructor(
    @InjectRepository(Imagen) private readonly imagenRepository: Repository<Imagen>,
    @Inject(forwardRef(() => ProductosService))
    private readonly productoService: ProductosService,

  ) { }
  uploadFile(file: MemoryStoredFile): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error)
          if (!result) {
            return reject(new Error("No se obtuvo resultado de Cloudinary"));
          }
          resolve(result)
        }
      )

      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })
  }

  async uploadFiles(uploadImages: UploadImageRequest[], productoId: number) {

    const cloudinaryFiles = await Promise.all(
      uploadImages.map(async (uploadImage) => {
        const cloudinaryFile = await this.uploadFile(uploadImage.file);
        return {
          cloudinaryFile,
          type: uploadImage.type,
        }
      })
    );

    const producto = await this.productoService.findOne(productoId)

    const imagenes = cloudinaryFiles.map(({ cloudinaryFile, type }) => {
      const imagen = new Imagen();
      imagen.url = cloudinaryFile.secure_url;
      imagen.producto = producto;
      imagen.type = type;
      return imagen;
    });

    // Guarda las imágenes
    try {
      await this.imagenRepository.save(imagenes);
      console.log('Imágenes guardadas correctamente');
    } catch (error) {
      console.log('Error al guardar las imágenes:', error);
    }
    return imagenes;
  }

  // Método para obtener las imágenes de un producto
  async getImagesByProductId(productoId: number): Promise<Imagen[]> {
    return this.imagenRepository.find({
      where: {
        producto: {
          id: productoId,
        },
      },
      relations: ['producto'],  // Importante: Asegurarse de que 'producto' esté relacionado
    });
  }
}
