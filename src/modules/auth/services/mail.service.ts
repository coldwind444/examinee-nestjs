import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>('APP_GMAIL'),
                pass: this.configService.get<string>('APP_GMAIL_PASSWORD'),
            },
        });
    }

    async sendMail(to: string, subject: string, text: string, html?: string) {
        const info = await this.transporter.sendMail({
            from: `"Examinee" <${this.configService.get<string>('APP_GMAIL')}>`,
            to,
            subject,
            text,
            html,
        });

        return info;
    }
}
