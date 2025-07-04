import { ApiProperty } from "@nestjs/swagger"

export class ConfirmOtpDto {
    @ApiProperty()
    otp: number

    @ApiProperty()
    userid: number
}