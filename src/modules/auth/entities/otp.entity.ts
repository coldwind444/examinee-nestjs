import { User } from "src/modules/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Otp {
    @PrimaryGeneratedColumn()
    oid: number

    @Column()
    code: number

    @Column({ name: 'reset_token', default: null })
    resetToken: string

    @Column()
    expire: Date

    @OneToOne(t => User)
    @JoinColumn({ name: 'user_id' })
    owner: User
}