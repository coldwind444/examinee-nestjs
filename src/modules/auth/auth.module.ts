import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Otp } from "./entities/otp.entity";
import { InvalidatedToken } from "./entities/invalidated-token.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./services/auth.service";
import { InvalidatedTokenService } from "./services/invalidated-token.service";
import { MailService } from "./services/mail.service";
import { OtpService } from "./services/otp.service";
import { AuthController } from "./auth.controller";
import { AppAuthGuard } from "./guards/auth.guard";
import { GoogleStrategy } from "./strategies/google.strategy";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Otp, InvalidatedToken]),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                global: true,
                secret: config.get<string>('SIGNER_KEY'),
                signOptions: { expiresIn: '1800s' },
            })
        }),
        forwardRef(() => UserModule)
    ],
    providers: [AuthService, InvalidatedTokenService, MailService, OtpService, GoogleStrategy, AppAuthGuard],
    controllers: [AuthController],
    exports: [AuthService, AppAuthGuard, JwtModule]
})

export class AuthModule {}