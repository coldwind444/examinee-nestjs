import { ApiProperty } from "@nestjs/swagger"

export class OtpResponseDto {
    @ApiProperty()
    success: boolean

    @ApiProperty()
    userid: number
}