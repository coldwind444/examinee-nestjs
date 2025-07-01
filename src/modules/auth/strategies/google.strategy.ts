// google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly configService : ConfigService) {
        const clientId = configService.get<string>('GOOGLE_CLIENT_ID')
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET')
        console.log(clientId + ' ' + clientSecret)
        super({
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile']
        } as StrategyOptions);
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
        };
        done(null, user);
    }

}
