import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attempt } from "./attempt.entity";
import { AttemptService } from "./attempt.service";
import { AttemptController } from "./attempt.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Attempt]), AuthModule],
    providers: [AttemptService],
    controllers: [AttemptController]
})

export class AttemptModule {}