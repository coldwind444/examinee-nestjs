import { User } from "src/modules/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'invalidated_token'})
export class InvalidatedToken {
    @PrimaryColumn()
    uuid: string

    @ManyToOne(type => User)
    @JoinColumn({ name: 'owner_id' })
    onwer: User
}