import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class ResetPasswordVerifyDto {

    @ApiProperty({
        type: String
    })
    @IsString()
    resetPasswordCode: string
}