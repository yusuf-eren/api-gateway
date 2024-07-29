import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/entities/role.entity";

export class UserResponse {
    @ApiProperty({
        type: Number
    })
    id: number;

    @ApiProperty({
        type: String
    })
    firstName: string;

    @ApiProperty({
        type: String
    })
    lastName: string;

    @ApiProperty({
        type: Number
    })
    roleId: Role;

    @ApiProperty({
        type: String
    })
    avatar: string;
}
export class LoginResponse {
    @ApiProperty({
        type: Boolean
    })
    status: boolean;

    @ApiProperty({
        type: Number
    })
    statusCode: number

    @ApiProperty({
        type: String
    })
    accessToken: string;

    @ApiProperty({
        type: Date
    })
    expiresAt: Date;

    @ApiProperty({
        type: UserResponse
    })
    user: UserResponse;

}