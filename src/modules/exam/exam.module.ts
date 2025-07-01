import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Exam } from "./entities/exam.entity";
import { Question } from "./entities/question.entity";
import { Choice } from "./entities/choice.entity";
import { Subject } from "./entities/subject.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Exam, Question, Choice, Subject])],
    providers: [],
    controllers: []
})

export class ExamModule {}