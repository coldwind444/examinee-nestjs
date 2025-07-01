import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InvalidatedToken } from "../entities/invalidated-token.entity";

@Injectable()
export class InvalidatedTokenService {
    constructor(
        @InjectRepository(InvalidatedToken)
        private tokenRepository: Repository<InvalidatedToken>
    ){}

    create(userid: number, jti: string) : Promise<InvalidatedToken>{
        const token = this.tokenRepository.create({
            uuid: jti,
            onwer: { id: userid }
        })

        return this.tokenRepository.save(token)
    }

    async invalid(jti: string) : Promise<boolean> {
        const token = await this.tokenRepository.findOne({
            where: { uuid: jti }
        })

        return token ? true : false
    }
}