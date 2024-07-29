import { PickType } from "@nestjs/swagger";
import { LoginDto } from "./login.dto";

export class ForgotPasswordDto extends PickType(LoginDto, ['phoneNumber'] as const) { }