import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserInterface } from 'src/usuarios/interfaces/user.interface';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendResetPasswordEmail(user: UserInterface, resetLink: string): Promise<void> {
        await this.mailerService.sendMail({
            to: user.correo,
            subject: 'Restablecer contraseña',
            template: 'reset-password',
            context: {
                resetLink,
                name: user.nombre,
            },
        });
    }
}
