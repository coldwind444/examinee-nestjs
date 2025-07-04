import { ApiProperty } from "@nestjs/swagger"

export class ResetPasswordDto {
    @ApiProperty()
    password: string

    @ApiProperty()
    userid: number

    @ApiProperty()
    token: string
}