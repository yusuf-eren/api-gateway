import { ApiProperty, OmitType } from "@nestjs/swagger";
import { LoginResponse } from "./login.response";

export class RegisterResponse extends OmitType(LoginResponse, ['user', 'accessToken', 'expiresAt'] as const) {
    @ApiProperty({
        type: String,
        required: false
    })
    data?: string

    @ApiProperty({
        type: String,
        required: false
    })
    message?: string
}