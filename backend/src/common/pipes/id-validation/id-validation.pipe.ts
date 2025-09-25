import { BadRequestException, Injectable, ParseIntPipe } from '@nestjs/common';

@Injectable()
// pipe personalizados para separar resonsabilidades y no duplicar codigo
export class IdValidationPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: () => new BadRequestException('Id no es valido')
    })
  }
}
