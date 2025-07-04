import { Body, Controller, Get, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AttemptService } from "./attempt.service";
import { ApiResponse } from "src/common/api-response";
import { Exam } from "../exam/entities/exam.entity";
import { Attempt } from "./attempt.entity";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { AttemptCreateDto } from "./dtos/attempt-create.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller('attempts')
export class AttemptController {
    constructor(
        private readonly attemptService: AttemptService
    ){}

    @Get('recently')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async getRecently(@Req() req) : Promise<ApiResponse<Exam[]>> {
        const res = await this.attemptService.getRecentlyDone(req.user.userid)
        return {
            status: 200,
            message: 'Recent exams fetched.',
            data: res
        }
    }

    @Get('history')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async getHistory(@Req() req) : Promise<ApiResponse<Exam[]>> {
        const res = await this.attemptService.getHistory(req.user.userid)
        return {
            status: 200,
            message: 'History fetched.',
            data: res
        }
    }

    @Get()
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async getAttempts(@Req() req, @Query('eid', ParseIntPipe) eid: number) : Promise<ApiResponse<Attempt[]>> {
        const res = await this.attemptService.getAttemptsOfExam(req.user.userid, eid)
        return {
            status: 200,
            message: 'Attempts fetched.',
            data: res
        }
    }

    @Post('submit')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async submit(@Req() req, @Query('eid', ParseIntPipe) eid: number , @Body() body: AttemptCreateDto) : Promise<ApiResponse<boolean>> {
        const res = await this.attemptService.submitAttempt(req.user.userid, eid, body)
        return {
            status: 200,
            message: 'Sumit success.',
            data: true
        }
    }
}