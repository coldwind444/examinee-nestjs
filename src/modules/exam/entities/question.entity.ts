import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exam } from "./exam.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    order: number

    @Column()
    content: string

    @Column()
    key: string

    @ManyToOne(t => Exam)
    @JoinColumn( { name: 'exam_id' } )
    exam: Exam
}