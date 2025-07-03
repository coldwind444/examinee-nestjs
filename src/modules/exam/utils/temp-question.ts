import { TemporaryChoice } from "./temp-choice"

export interface TemporaryQuestion {
    order: number
    content: string
    key: string
    choices: TemporaryChoice[]
}