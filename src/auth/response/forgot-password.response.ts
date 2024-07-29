import { ApiProperty } from "@nestjs/swagger";


export class ForgotPasswordResponse {
    @ApiProperty({
        type: Boolean
    })
    status: boolean

    @ApiProperty({
        type: Number
    })
    statusCode: number
}