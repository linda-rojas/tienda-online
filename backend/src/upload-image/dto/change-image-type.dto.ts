import { IsIn } from 'class-validator';

export class ChangeImageTypeDto {
    @IsIn(['primary', 'secondary', 'gallery'])
    type: 'primary' | 'secondary' | 'gallery';
}
