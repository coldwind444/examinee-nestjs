import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { Exam } from './modules/exam/entities/exam.entity';
import { Attempt } from './modules/attempt/attempt.entity';
import { Question } from './modules/exam/entities/question.entity';
import { Choice } from './modules/exam/entities/choice.entity';
import { Subject } from 'typeorm/persistence/Subject';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'examineeDB',
      entities: [User, Exam, Attempt, Question, Choice, Subject],
      synchronize: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
