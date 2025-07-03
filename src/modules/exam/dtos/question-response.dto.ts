import { ChoiceResponseDto } from "./choice-response.dto"

export interface QuestionResponseDto {
    id: number
    order: number
    content: string
    key: string
    choices: ChoiceResponseDto[]
}