import { ApiProperty } from "@nestjs/swagger"

export class ChoiceResponseDto {
    @ApiProperty()
    letter: string

    @ApiProperty()
    content: string
}