import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { UserResponseDto } from "./dtos/user-response.dto";
import { UserCreateDto } from "./dtos/user-create.dto";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository : Repository<User>
    ){}

    encode(input: string): Promise<string> | string {
        if (input.length === 0) return ''
        const saltOrRounds = 10
        return bcrypt.hash(input, saltOrRounds)
    }

    match(input: string, hash: string): Promise<boolean> {
        return bcrypt.compare(input, hash)
    }

    async register(req: UserCreateDto) : Promise<User> {
        const exist = await this.userRepository.findOne({
            where: {
                email: req.email
            }
        })

        if (exist) throw new HttpException('Email has been used by another account. Log in ?', HttpStatus.CONFLICT)
        
        const hash = await this.encode(req.password)

        const user = this.userRepository.create({
            email: req.email,
            password: hash,
            fname: req.fname,
            lname: req.lname
        })

        return this.userRepository.save(user)

    }

    async getUser(id: number) : Promise<UserResponseDto> {
        const user = await this.userRepository.findOneBy({ id })

        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

        return {
            id: user.id,
            email: user.email,
            fname: user.fname,
            lname: user.lname
        }
    }

    async findByEmail(email: string) : Promise<User | null> {
        return this.userRepository.findOneBy({ email })
    }

    async changePassword(userid: number, password: string): Promise<void> {
        const hash = await this.encode(password)

        const user = await this.userRepository.preload({
            id: userid,
            password: hash
        })

        if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND)

        await this.userRepository.save(user)

    }
}