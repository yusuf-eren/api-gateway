import { LoginDto } from "./login.dto";
import { PickType } from "@nestjs/swagger";

export class RegisterDto extends PickType(LoginDto,['phoneNumber'] as const) {}
