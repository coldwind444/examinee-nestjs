import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attempt } from "./attempt.entity";
import { In, Repository } from "typeorm";
import { Exam } from "../exam/entities/exam.entity";
import { AttemptCreateDto } from "./dtos/attempt-create.dto";
import { Question } from "../exam/entities/question.entity";
import { ILike } from "typeorm";

@Injectable()
export class AttemptService {
    constructor(
        @InjectRepository(Attempt)
        private readonly attemptRepository: Repository<Attempt>,

        @InjectRepository(Exam)
        private readonly examRepository: Repository<Exam>,

        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>
    ) { }

    async getRecentlyDone(userid: number): Promise<Exam[]> {
        const attempts = await this.attemptRepository
            .createQueryBuilder('attempt')
            .select('attempt.exam_id', 'examId')
            .addSelect('MAX(attempt.date_time)', 'dateTime')
            .where('attempt.user_id = :userid', { userid })
            .groupBy('attempt.exam_id')
            .orderBy('dateTime', 'DESC')
            .limit(4)
            .getRawMany();

        const eids = attempts.map(i => i.examId);

        if (eids.length === 0) {
            throw new HttpException('Empty exam list.', HttpStatus.NOT_FOUND);
        }

        return this.examRepository.find({
            where: {
                id: In(eids),
            },
            relations: ['subject'],
        });
    }

    async countDoneExams(userid: number): Promise<number> {
        const count = await this.attemptRepository
            .createQueryBuilder('attempt')
            .select('COUNT(DISTINCT attempt.exam_id)', 'count')
            .where('attempt.user_id = :userid', { userid })
            .getRawOne();

        const total = parseInt(count.count, 10);
        return total
    }

    async countAttempts(userid: number): Promise<number> {
        return this.attemptRepository.count({
            where: {
                user: { id: userid }
            }
        })
    }

    async getHistory(userid: number): Promise<Exam[]> {
        const attempts = await this.attemptRepository
            .createQueryBuilder('attempt')
            .select('attempt.exam_id', 'examId')
            .where('attempt.user_id = :userid', { userid })
            .groupBy('attempt.exam_id')
            .getRawMany()

        const eids = attempts.map(a => a.examId)

        if (eids.length === 0) throw new HttpException('Empty exam list.', HttpStatus.NOT_FOUND)

        return this.examRepository.find({
            where: {
                id: In(eids)
            },
            relations: ['subject']
        })
    }

    async getHistoryByFilters(
        userid: number,
        subjectId?: number, 
        title?: string 
    ): Promise<Exam[]> {
        const attempts = await this.attemptRepository
            .createQueryBuilder('attempt')
            .select('attempt.exam_id', 'examId')
            .where('attempt.user_id = :userid', { userid })
            .groupBy('attempt.exam_id')
            .getRawMany();

        const eids = attempts.map(a => a.examId);

        if (eids.length === 0) {
            throw new HttpException('Empty exam list.', HttpStatus.NOT_FOUND);
        }

        const whereConditions: any = {
            id: In(eids)
        };

        // Add title filter
        if (title) {
            whereConditions.title = ILike(`%${title}%`);
        }

        // Add subject filter
        if (subjectId) {
            whereConditions.subject = {
                id: subjectId
            };
        }

        return this.examRepository.find({
            where: whereConditions,
            relations: ['subject']
        });
    }


    getAttemptsOfExam(userid: number, eid: number): Promise<Attempt[]> {
        return this.attemptRepository.find({
            where: {
                exam: { id: eid },
                user: { id: userid }
            }
        })
    }

    async submitAttempt(userid: number, eid: number, req: AttemptCreateDto): Promise<Attempt> {
        const questions = await this.questionRepository.find({
            where: {
                exam: { id: eid }
            },
            order: {
                order: 'ASC'
            }
        })

        const keys = questions.map(q => q.key)
        const correct = req.answers.reduce((acc, curr, idx) => curr === keys[idx] ? acc + 1 : acc, 0)

        const att = this.attemptRepository.create({
            dateTime: req.dateTime,
            duration: req.duration,
            answers: req.answers.join(''),
            correct: correct,
            user: { id: userid },
            exam: { id: eid }
        })

        return this.attemptRepository.save(att)
    }


}