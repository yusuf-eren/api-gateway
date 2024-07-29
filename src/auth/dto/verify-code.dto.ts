import { ApiProperty, PickType } from "@nestjs/swagger";
import { LoginDto } from "./login.dto";
import { IsString } from "class-validator";

export class VerifyCodeDto extends PickType(LoginDto, ['phoneNumber'] as const) {
    @ApiProperty({
        type: String
    })
    @IsString()
    verificationCode: string
}