import { Injectable } from "@nestjs/common";
import { Otp } from "../entities/otp.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp)
        private otpRepository: Repository<Otp>
    ) { }

    async generateOtp(userid: number): Promise<number> {
        const code = Math.floor(100000 + Math.random() * 900000);
        const expire = new Date(Date.now() + 15 * 60 * 1000); 

        let otp = await this.otpRepository.findOneBy({
            owner: { id: userid }
        });

        if (otp) {
            otp.code = code;
            otp.expire = expire;
        } else {
            otp = this.otpRepository.create({
                code,
                expire,
                owner: { id: userid }
            });
        }

        await this.otpRepository.save(otp);
        return code;
    }


    async generateToken(code: number, userid: number): Promise<string | null> {
        const otp = await this.otpRepository.findOneBy({
            code: code,
            owner: { id: userid }
        })

        if (!otp) return null
        if (new Date(otp.expire) < new Date()) return null

        otp.resetToken = uuidv4()
        const res = await this.otpRepository.save(otp)

        return res.resetToken
    }

    async validResetToken(token: string, userid: number) : Promise<boolean> {
        const otp = await this.otpRepository.findOneBy({
            owner: { id: userid },
            resetToken: token
        })

        if (!otp) return false

        return true
    }
}