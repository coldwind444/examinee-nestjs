import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AppAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        const refreshMode = request.query.refresh

        if (!token) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)

        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>("SIGNER_KEY") })
            const invalid = await this.authService.isInvalidated(payload.jti)
            if (invalid) throw new HttpException('Invalidated token.', HttpStatus.FORBIDDEN)
            request['user'] = payload
        } catch (err) {
            if (err.name === 'TokenExpiredError' && refreshMode) {
                try {
                    const payload = this.jwtService.decode(token);
                    if (!payload || typeof payload !== 'object') {
                        throw new HttpException('Invalid token payload', HttpStatus.UNAUTHORIZED);
                    }
                    request['user'] = payload;
                    return true; 
                } catch {
                    throw new HttpException('Cannot decode expired token', HttpStatus.UNAUTHORIZED);
                }
            }
            throw new HttpException(`Unauthorized: ${err.message}`, HttpStatus.UNAUTHORIZED)
        }

        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}