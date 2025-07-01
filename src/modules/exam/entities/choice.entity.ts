import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";

@Entity()
export class Choice {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    letter: string

    @Column()
    content: string

    @ManyToOne(t => Question)
    @JoinColumn({ name: 'question_id' })
    question: Question
}