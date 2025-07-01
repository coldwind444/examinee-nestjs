import { Body, Controller, Get, Post, UseGuards, Request } from "@nestjs/common";
import { UserCreateDto } from "./dtos/user-create.dto";
import { ApiResponse } from "src/common/api-response";
import { UserResponseDto } from "./dtos/user-response.dto";
import { UserService } from "./user.service";
import { AppAuthGuard } from "../auth/guards/auth.guard";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService : UserService
    ){}

    @Post('register')
    async register(@Body() req : UserCreateDto) : Promise<ApiResponse<UserResponseDto>> {
        const { password, ...remaining } = await this.userService.register(req)
        return {
            status: 200,
            message: 'User registered success.',
            data: remaining
        }
    }

    @Get('profile')
    @UseGuards(AppAuthGuard)
    async getById(@Request() req ) : Promise<ApiResponse<UserResponseDto>> {
        const res = await this.userService.getUser(req.user.userid)

        return {
            status: 200,
            message: 'User profile found.',
            data: res
        }
    }
}