// src/mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendResetPasswordEmail(to: string, resetLink: string): Promise<void> {
        await this.mailerService.sendMail({
            to,
            subject: 'Restablecer contraseña',
            template: 'reset-password',
            context: {
                resetLink,
            },
        });
    }
}
