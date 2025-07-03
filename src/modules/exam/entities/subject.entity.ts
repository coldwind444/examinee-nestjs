import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'subject' })
export class Subject {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string
}