import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";
import { LoginDto } from "./login.dto";


export class RegisterCompleteDto extends PickType(LoginDto, ['phoneNumber'] as const) {
    @ApiProperty({
        type: String
    })
    @IsString()
    password: string

    @ApiProperty({
        type: Boolean
    })
    @IsBoolean()
    smsPermitted: boolean

    @ApiProperty({
        type: Boolean
    })
    @IsBoolean()
    emailPermitted: boolean
}