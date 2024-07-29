import { OmitType } from "@nestjs/swagger";
import { LoginResponse } from "./login.response";


export class ChangePasswordResponse extends OmitType(LoginResponse, ['user'] as const) { }