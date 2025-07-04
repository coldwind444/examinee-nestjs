import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { Exam } from './modules/exam/entities/exam.entity';
import { Attempt } from './modules/attempt/attempt.entity';
import { Question } from './modules/exam/entities/question.entity';
import { Choice } from './modules/exam/entities/choice.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ExamModule } from './modules/exam/exam.module';
import { ConfigModule } from '@nestjs/config';
import { Subject } from './modules/exam/entities/subject.entity';
import { Otp } from './modules/auth/entities/otp.entity';
import { InvalidatedToken } from './modules/auth/entities/invalidated-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'examineeDB',
      entities: [User, Exam, Attempt, Question, Choice, Subject, Otp, InvalidatedToken],
      synchronize: true
    }),
    AuthModule,
    UserModule,
    ExamModule
  ]
})
export class AppModule {}
