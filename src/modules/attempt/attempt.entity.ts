import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Exam } from "../exam/entities/exam.entity";

@Entity({ name: 'attempt' })
export class Attempt {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'date_time' })
    dateTime: Date

    @Column()
    answers: string

    @Column()
    duration: number

    @Column()
    correct: number

    @ManyToOne(t => User)
    @JoinColumn({ name: 'user_id' })
    user: User

    @ManyToOne(t => Exam)
    @JoinColumn({ name: 'exam_id' })
    exam: Exam
}