import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PhoneValidationPipe implements PipeTransform {
  transform(value: any): string {
    const phoneRegex = /^\d{10}$/;

    if (typeof value !== 'string' || !phoneRegex.test(value)) {
      throw new BadRequestException('El número de celular debe tener exactamente 10 dígitos numéricos');
    }

    return value;
  }
}
