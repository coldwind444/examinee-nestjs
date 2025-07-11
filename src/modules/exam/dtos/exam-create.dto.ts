import { ApiProperty } from "@nestjs/swagger"

export class ExamCreateDto {
    @ApiProperty()
    title: string

    @ApiProperty()
    subject: string

    @ApiProperty()
    noq: number

    @ApiProperty()
    scale: number

    @ApiProperty()
    cpq: number

    @ApiProperty()
    duration: number
}