import { ApiProperty } from "@nestjs/swagger"

export class AttemptCreateDto {
    @ApiProperty()
    dateTime: Date

    @ApiProperty()
    answers: string[]

    @ApiProperty()
    duration: number
}