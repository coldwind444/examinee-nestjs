import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exam } from "./exam.entity";
import { Choice } from "./choice.entity";

@Entity({ name: 'question' })
export class Question {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    order: number

    @Column()
    content: string

    @Column()
    key: string

    @Column({ name: 'number_of_choices' })
    noc: number

    @ManyToOne(t => Exam)
    @JoinColumn( { name: 'exam_id' } )
    exam: Exam
}