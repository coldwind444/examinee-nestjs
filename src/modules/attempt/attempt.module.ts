import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attempt } from "./attempt.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Attempt])],
    providers: [],
    controllers: []
})

export class AttemptModule {}