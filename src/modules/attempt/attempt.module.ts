import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attempt } from "./attempt.entity";
import { AttemptService } from "./attempt.service";
import { AttemptController } from "./attempt.controller";
import { AuthModule } from "../auth/auth.module";
import { Exam } from "../exam/entities/exam.entity";
import { Question } from "../exam/entities/question.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Attempt, Exam, Question]), AuthModule],
    providers: [AttemptService],
    controllers: [AttemptController]
})

export class AttemptModule {}