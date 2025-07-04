import { ApiProperty } from "@nestjs/swagger"
import { ChoiceResponseDto } from "./choice-response.dto"

export class QuestionResponseDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    order: number

    @ApiProperty()
    content: string

    @ApiProperty()
    key: string

    @ApiProperty()
    choices: ChoiceResponseDto[]
}