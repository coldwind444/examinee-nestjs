import { User } from "src/modules/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "./subject.entity";

@Entity({ name: 'exam' })
export class Exam {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    scale: number

    @Column()
    noq: number

    @Column()
    duration: number

    @ManyToOne(t => User)
    @JoinColumn({ name: 'user_id' })
    publisher: User

    @ManyToOne(t => Subject)
    @JoinColumn({ name: 'subject_id' })
    subject: Subject
}