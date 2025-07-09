import { Controller } from "@nestjs/common";
import { Body, Request, Response, Query, Post, Get, UseGuards, ParseBoolPipe } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { ApiResponse } from "src/common/api-response";
import { TokenDto } from "./dtos/token.dto";
import { LoginDto } from "./dtos/login.dto";
import { GoogleAuthGuard } from "./guards/google.guard";
import { AppAuthGuard } from "./guards/auth.guard";
import { ConfirmOtpDto } from "./dtos/confirm-otp.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { OtpResponseDto } from "./dtos/otp-response.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    async login(@Body() body: LoginDto): Promise<ApiResponse<TokenDto>> {
        const res = await this.authService.logIn(body)
        return {
            status: 200,
            message: 'Login success.',
            data: res
        }
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    async googleLogin() { }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleRedirect(@Request() req, @Response() res) {
        const user = req.user
        const resp = await this.authService.googleOAuth2(user.email, user.firstName, user.lastName)
        res.redirect(`http://localhost:5173/auth/google/oauth2-success?jwt=${resp.jwt}`)
    }

    @Post('logout')
    @ApiBearerAuth()
    @UseGuards(AppAuthGuard)
    async logout(@Request() req): Promise<ApiResponse<boolean>> {
        const res = await this.authService.logout(req.user.userid, req.user.jti)
        return {
            status: 200,
            message: 'Logout success.',
            data: res
        }
    }

    @Get('refresh-token')
    @ApiBearerAuth('jwt')
    @UseGuards(AppAuthGuard)
    async refreshToken(@Request() req, @Query('refresh', ParseBoolPipe) refresh: boolean): Promise<ApiResponse<TokenDto>> {
        const res = await this.authService.refreshToken(req.user.sub, req.user.userid, req.user.jti)
        return {
            status: 200,
            message: 'Token refreshed.',
            data: res
        }
    }

    @Get('otp-request')
    async requestOtp(@Query('email') email: string): Promise<ApiResponse<OtpResponseDto>> {
        const res = await this.authService.getOtp(email)
        return {
            status: 200,
            message: 'Otp sent.',
            data: res
        }
    }

    @Post('otp-confirm')
    async confirmOtp(@Body() body: ConfirmOtpDto): Promise<ApiResponse<string>> {
        const res = await this.authService.validOtp(body)
        return {
            status: 200,
            message: 'Otp confirmed.',
            data: res
        }
    }

    @Post('reset-password')
    async resetPassword(@Body() body: ResetPasswordDto): Promise<ApiResponse<boolean>> {
        await this.authService.resetPassword(body)
        return {
            status: 200,
            message: 'Password reset.',
            data: true
        }
    }
}