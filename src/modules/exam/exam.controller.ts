import { Body, Controller, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { ApiResponse } from "src/common/api-response";
import { Get } from "@nestjs/common";
import { Exam } from "./entities/exam.entity";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { ExamCreateDto } from "./dtos/exam-create.dto";
import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { HttpStatus } from "@nestjs/common";
import { HttpException } from "@nestjs/common";
import { diskStorage } from 'multer'
import { ApiConsumes, ApiBody } from "@nestjs/swagger";
import * as path from 'path'
import * as fs from 'fs'
import { UploadedFile } from "@nestjs/common";
import { QuestionResponseDto } from "./dtos/question-response.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Subject } from "./entities/subject.entity";

@Controller('exams')
export class ExamController {
    constructor(
        private readonly examService: ExamService
    ) { }

    @Get()
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async getAll(): Promise<ApiResponse<Exam[]>> {
        const res = await this.examService.getAllExams()
        return {
            status: 200,
            message: 'All exams fetched.',
            data: res
        }
    }

    @Get('subjects')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async getAllSub(): Promise<ApiResponse<Subject[]>> {
        const res = await this.examService.getAllSubjects()
        return {
            status: 200,
            message: 'All exams fetched.',
            data: res
        }
    }

    @Get('my-exams')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async getMyExams(@Req() req): Promise<ApiResponse<Exam[]>> {
        const userid = req.user.userid
        const res = await this.examService.getMyExams(userid)
        return {
            status: 200,
            message: 'My exams fetched.',
            data: res
        }
    }

    @Get('filter')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async getExamsByFilters(
        @Query('sid') sid: number,
        @Query('title') title: string
    ): Promise<ApiResponse<Exam[]>> {
        const res = await this.examService.getAllExamsBySubjectAndTitle(sid, title)
        return {
            status: 200,
            message: 'Exams fetched.',
            data: res
        }
    }

    @Get('my-exams/filter')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async getMyExamsByFilters(
        @Req() req,
        @Query('sid') sid: number,
        @Query('title') title: string
    ): Promise<ApiResponse<Exam[]>> {
        const res = await this.examService.getMyExamsBySubjectAndTitle(req.user.userid, sid, title)
        return {
            status: 200,
            message: 'Exams fetched.',
            data: res
        }
    }

    @Get('questions')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async getExamQuestions(@Query('eid') eid: number): Promise<ApiResponse<QuestionResponseDto[]>> {
        const res = await this.examService.getExamQuestions(eid)
        return {
            status: 200,
            message: 'Questions fetched.',
            data: res
        }
    }

    @Post('upload-excel')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './upload',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
                const ext = path.extname(file.originalname)
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
            }
        }),
        fileFilter: (req, file, cb) => {
            if (
                file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.mimetype === 'application/vnd.ms-excel'
            ) {
                cb(null, true)
            } else {
                cb(new HttpException('Only Excel files are allowed.', HttpStatus.BAD_REQUEST), false)
            }
        }
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
                title: { type: 'string' },
                subject: { type: 'string' },
                noq: { type: 'number' },
                scale: { type: 'number' },
                cpq: { type: 'number' },
                duration: { type: 'number' },
            },
        },
    })
    async uploadExcel(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: ExamCreateDto,
        @Req() req
    ): Promise<ApiResponse<Exam>> {
        if (!file) {
            throw new HttpException('No file uploaded.', HttpStatus.BAD_REQUEST)
        }

        const uploadDir = './upload'
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

        const filePath = path.resolve(file.path)
        const exam = await this.examService.addExam(req.user.userid, body, filePath)

        return {
            status: 200,
            message: 'Upload succeeded.',
            data: exam
        }
    }
}