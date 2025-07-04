import { ApiProperty } from "@nestjs/swagger"

export class TokenDto {
    @ApiProperty()
    success: boolean

    @ApiProperty()
    jwt: string
}