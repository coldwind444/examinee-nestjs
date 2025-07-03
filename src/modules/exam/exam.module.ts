import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Exam } from "./entities/exam.entity";
import { Question } from "./entities/question.entity";
import { Choice } from "./entities/choice.entity";
import { Subject } from "./entities/subject.entity";
import { ExamService } from "./exam.service";
import { ExamController } from "./exam.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Exam, Question, Choice, Subject]), AuthModule],
    providers: [ExamService],
    controllers: [ExamController]
})

export class ExamModule {}