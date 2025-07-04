import { ApiProperty } from "@nestjs/swagger"

export class UserResponseDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    email: string

    @ApiProperty()
    fname: string

    @ApiProperty()
    lname: string
}