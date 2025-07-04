import { Body, Controller, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { ApiResponse } from "src/common/api-response";
import { Get } from "@nestjs/common";
import { Exam } from "./entities/exam.entity";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { Question } from "./entities/question.entity";
import { ExamCreateDto } from "./dtos/exam-create.dto";
import { QuestionResponseDto } from "./dtos/question-response.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller('exams')
export class ExamController {
    constructor(
        private readonly examService: ExamService
    ) {}

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
            @Query('sid', ParseIntPipe) sid: number,
            @Query('title') title: string
    ): Promise<ApiResponse<Exam[]>> 
    {
        const res = await this.examService.getAllExamsBySubjectAndTitle(sid, title)
        return {
            status: 200,
            message: 'Exams fetched.',
            data: res
        }
    }

    @Get('questions')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async getExamQuestions(@Query('eid') eid: number) : Promise<ApiResponse<QuestionResponseDto[]>> {
        const res = await this.examService.getExamQuestions(eid)
        return {
            status: 200,
            message: 'Questions fetched.',
            data: res
        }
    }

    @Post('add')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async addExam(@Req() req, @Body() body : ExamCreateDto) : Promise<ApiResponse<Exam>> {
        const res = await this.examService.addExam(req.user.userid, body)
        return {
            status: 200,
            message: 'Add success.',
            data: res
        }
    }
}