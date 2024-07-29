import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { LoginResponse } from './response/login.response';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterResponse } from './response/register.response';
import { VerifyCodeResponse } from './response/verify-code.response';
import { RegisterCompleteDto } from './dto/register-complete.dto';
import { RegisterCompleteResponse } from './response/register-complete.response';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordResponse } from './response/forgot-password.response';
import { ResetPasswordVerifyResponse } from './response/reset-password-verify.response';
import { ResetPasswordVerifyDto } from './dto/reset-password-verify.dto';
import { ResetPasswordResponse } from './response/reset-password.response';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordResponse } from './response/change-password.response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  logger = AuthController.name;

  constructor(private readonly authService: AuthService) {}
  // /auth/register
  @ApiResponse({
    type: RegisterResponse,
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(registerDto);
  }

  // /auth/verify-code
  @ApiResponse({
    type: VerifyCodeResponse,
  })
  @Post('verify-code')
  async verifyCode(
    @Body() verifyCodeDto: VerifyCodeDto,
  ): Promise<VerifyCodeResponse> {
    return this.authService.verifyCode(verifyCodeDto);
  }

  // /auth/register-complete
  @ApiResponse({
    type: RegisterCompleteResponse,
  })
  @Post('register-complete')
  async registerComplete(
    @Body() registerCompleteDto: RegisterCompleteDto,
  ): Promise<RegisterCompleteResponse> {
    return this.authService.registerComplete(registerCompleteDto);
  }

  // /auth/login
  @ApiResponse({
    type: LoginResponse,
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  // /auth/forgot-password
  @ApiResponse({
    type: ForgotPasswordResponse,
  })
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotpasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(forgotpasswordDto);
  }

  @ApiResponse({
    type: ResetPasswordVerifyResponse,
  })
  @Post('reset-password/verify')
  async resetPasswordVerify(
    @Body() resetPasswordVerifyDto: ResetPasswordVerifyDto,
  ): Promise<ResetPasswordVerifyResponse> {
    return this.authService.resetPasswordVerify(resetPasswordVerifyDto);
  }

  @ApiResponse({
    type: ResetPasswordResponse,
  })
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiResponse({
    type: ChangePasswordResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }
}
