import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Exam } from "./entities/exam.entity";
import { Like, Repository } from "typeorm";
import { Question } from "./entities/question.entity";
import * as ExcelJS from 'exceljs';
import { Choice } from "./entities/choice.entity";
import { TemporaryQuestion } from "./utils/temp-question";
import { TemporaryChoice } from "./utils/temp-choice";
import { ExamCreateDto } from "./dtos/exam-create.dto";
import { Subject } from "./entities/subject.entity";
import { QuestionResponseDto } from "./dtos/question-response.dto";

@Injectable()
export class ExamService {
    constructor(
        @InjectRepository(Exam)
        private readonly examRepository: Repository<Exam>,

        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,

        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,

        @InjectRepository(Choice)
        private readonly choiceRepository: Repository<Choice>
    ) { }

    async getAllExams(): Promise<Exam[]> {
        const exams = await this.examRepository.find({
            relations: ['subject']
        })
        if (!exams) throw new HttpException('Empty exam list.', HttpStatus.NOT_FOUND)
        return exams
    }

    async getAllSubjects(): Promise<Subject[]> {
        return this.subjectRepository.find()
    }

    async getMyExams(userid: number): Promise<Exam[]> {
        const exams = await this.examRepository.find({
            where: {
                publisher: { id: userid }
            },
            relations: ['subject']
        })
        if (!exams) throw new HttpException('Empty exam list.', HttpStatus.NOT_FOUND)
        return exams
    }

    async getAllExamsBySubjectAndTitle(sid?: number, title?: string): Promise<Exam[]> {
        const where: any = {};

        if (sid) {
            where.subject = { id: sid };
        }

        if (title) {
            where.title = Like(`%${title}%`);
        }

        const exams = await this.examRepository.find({
            where,
            relations: ['subject']
        });

        if (!exams || exams.length === 0) {
            throw new HttpException('Empty exam list.', HttpStatus.NOT_FOUND);
        }

        return exams;
    }


    async getMyExamsBySubjectAndTitle(userid: number, sid?: number, title?: string): Promise<Exam[]> {
        const where: any = {
            publisher: { id: userid }
        };

        if (sid) {
            where.subject = { id: sid };
        }

        if (title) {
            where.title = Like(`%${title}%`);
        }

        const exams = await this.examRepository.find({
            where,
            relations: ['subject']
        });

        if (!exams || exams.length === 0) {
            throw new HttpException('Empty exam list.', HttpStatus.NOT_FOUND);
        }

        return exams;
    }


    async getExamQuestions(eid: number): Promise<QuestionResponseDto[]> {
        const questions = await this.questionRepository.find({
            where: { exam: { id: eid } }
        });

        if (!questions || questions.length === 0)
            throw new HttpException('Empty question list.', HttpStatus.NOT_FOUND);

        const res: QuestionResponseDto[] = questions.map(q => ({
            id: q.id,
            order: q.order,
            content: q.content,
            key: q.key,
            choices: []
        }));

        await Promise.all(res.map(async (val) => {
            const choices = await this.choiceRepository.find({
                where: { question: { id: val.id } }
            });
            if (!choices || choices.length === 0)
                throw new HttpException('Empty choice list.', HttpStatus.NOT_FOUND);
            val.choices = choices.map(c => ({ letter: c.letter, content: c.content }));
        }));

        return res;
    }


    async extractQuestionsFromExcel(filePath: string, noc: number, noq: number): Promise<TemporaryQuestion[]> {
        const workbook = new ExcelJS.Workbook()

        try {
            await workbook.xlsx.readFile(filePath)
        } catch (e) {
            console.error('Read excel failed.', e)
            throw new HttpException('Read file failed.', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        const worksheet = workbook.worksheets[0]
        let rs: TemporaryQuestion[] = []

        for (let rowNumber = 2; rowNumber <= noq + 1; rowNumber++) {
            const row = worksheet.getRow(rowNumber)
            const content = row.getCell(2).value?.toString()
            const key = row.getCell(noc + 3).value?.toString()

            if (!content || !key) {
                console.log(rowNumber)
                throw new HttpException('Invalid format.', HttpStatus.INTERNAL_SERVER_ERROR)
            }

            let choices: TemporaryChoice[] = []
            for (let i = 1; i <= noc; i++) {
                const letter = String.fromCharCode(i + 64)
                const choiceContent = row.getCell(i + 2).value?.toString()
                if (!choiceContent) {
                    throw new HttpException('Invalid format.', HttpStatus.INTERNAL_SERVER_ERROR)
                }
                choices.push({ letter, content: choiceContent })
            }

            rs.push({ order: rowNumber, content, key, choices })
        }

        return rs
    }

    async addExam(userid: number, req: ExamCreateDto): Promise<Exam> {
        const questions = await this.extractQuestionsFromExcel(req.filePath, req.cpq, req.noq)

        const subject = await this.subjectRepository.findOne({ where: { name: req.subject } })
            ?? await this.subjectRepository.save({ name: req.subject })

        const exam = this.examRepository.create({
            title: req.title,
            scale: req.scale,
            noq: req.noq,
            duration: req.duration,
            publisher: { id: userid },
            subject: { id: subject.id }
        })
        const addedExam = await this.examRepository.save(exam)

        const finalQuestions = questions.map((q, index) => ({
            content: q.content,
            order: index + 1,
            noc: req.cpq,
            key: q.key,
            exam: { id: addedExam.id }
        }))
        const addedQuestions = await this.questionRepository.save(finalQuestions)

        let finalChoices: Choice[] = []
        questions.forEach((q, idx) => {
            const addedQ = addedQuestions[idx]
            q.choices.forEach(choice => {
                finalChoices.push({
                    content: choice.content,
                    letter: choice.letter,
                    question: { id: addedQ.id } as Question
                } as Choice)
            })
        })
        await this.choiceRepository.save(finalChoices)

        return addedExam
    }

}