import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MoreThan, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { randomBytes } from 'crypto';
import { EmailVerification } from 'src/entities/email-verification.entity';
import { HttpService } from '@nestjs/axios';
import { LoginResponse } from './response/login.response';
import { RegisterResponse } from './response/register.response';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { VerifyCodeResponse } from './response/verify-code.response';
import { RegisterCompleteDto } from './dto/register-complete.dto';
import { Role } from 'src/entities/role.entity';
import { Profile } from 'src/entities/profile.entity';
import { Info } from 'src/entities/info.entity';
import { RegisterCompleteResponse } from './response/register-complete.response';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordResponse } from './response/forgot-password.response';
import { ResetPasswordVerifyResponse } from './response/reset-password-verify.response';
import { ResetPasswordVerifyDto } from './dto/reset-password-verify.dto';
import { ResetPasswordResponse } from './response/reset-password.response';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordResponse } from './response/change-password.response';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private emailVerificationRepository: Repository<EmailVerification>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Info)
    private infoRepository: Repository<Info>,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async register({ phoneNumber }: RegisterDto): Promise<RegisterResponse> {
    phoneNumber = phoneNumber.replace(/\s+/g, '');

    const user = await this.userRepository.findOne({ where: { phoneNumber } });

    if (user)
      throw new BadRequestException({
        status: false,
        statusCode: 400,
        message: 'Phone Number already in use!',
      });

    const verificationToken = randomBytes(20).toString('hex');
    const verificationCode = this.generateRandomCode().toString();

    const newUser = new EmailVerification();
    newUser.email = phoneNumber;
    newUser.verificationCode = verificationCode;
    newUser.verificationToken = verificationToken;
    newUser.expiresAt = new Date(Date.now() + 1000 * 180);

    const result = await this.emailVerificationRepository.save(newUser);

    await this.sendSMS(result.verificationCode, result.email);

    return { status: true, statusCode: 201, data: phoneNumber };
  }

  async verifyCode({
    verificationCode,
    phoneNumber,
  }: VerifyCodeDto): Promise<VerifyCodeResponse> {
    phoneNumber = phoneNumber.replace(/\s+/g, '');

    const emailVerification = await this.emailVerificationRepository.findOne({
      where: {
        email: phoneNumber,
        verificationCode,
        expiresAt: MoreThan(new Date(Date.now())),
      },
    });

    if (!emailVerification)
      throw new BadRequestException({
        status: false,
        statusCode: 400,
        message: 'Token is invalid or has expired!',
      });

    emailVerification.verificationCode = null;

    await this.emailVerificationRepository.save(emailVerification);

    return {
      status: true,
      statusCode: 201,
      message: 'Email verification is success',
    };
  }

  async registerComplete({
    password,
    phoneNumber,
    smsPermitted,
    emailPermitted,
  }: RegisterCompleteDto): Promise<RegisterCompleteResponse> {
    const emailVerification = await this.emailVerificationRepository.findOne({
      where: {
        email: phoneNumber,
      },
    });

    if (!emailVerification) {
      throw new UnauthorizedException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await this.roleRepository.findOne({ where: { id: 1 } });

    const user = new User();
    user.phoneNumber = phoneNumber;
    user.firstName = 'Anonim';
    user.emailVerification = true;
    user.password = String(hashedPassword);

    user.userRole = role;
    await this.userRepository.save(user);

    const userId = await this.userRepository.findOne({
      where: { id: user.id },
    });
    const profile = new Profile();
    profile.user = userId;
    await this.profileRepository.save(profile);

    const info = new Info();
    info.smsPermitted = smsPermitted;
    info.emailPermitted = emailPermitted;
    info.user = userId;
    await this.infoRepository.save(info);

    const payload = { id: user.id, roleId: user.userRole };

    return {
      status: true,
      statusCode: 201,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.userRole,
        avatar: user.avatar,
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async login({ phoneNumber, password }: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
      select: [
        'id',
        'firstName',
        'avatar',
        'password',
        'phoneNumber',
        'lastName',
      ],
      relations: ['userRole'],
    });

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, roleId: user.userRole };

    return {
      status: true,
      statusCode: 201,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.userRole,
        avatar: user.avatar,
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async forgotPassword({
    phoneNumber,
  }: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    const user = await this.userRepository.findOne({
      where: {
        phoneNumber: phoneNumber.replace(/\s+/g, ''),
      },
    });

    if (!user)
      throw new BadRequestException({
        status: false,
        statusCode: 400,
        message: 'User not found',
      });

    const verificationCode = String(this.generateRandomCode());

    user.resetPasswordCode = verificationCode;
    user.expiresAt = new Date(Date.now() + 1000 * 60);
    await this.userRepository.save(user);

    // await this.sendSMS(verificationCode, user.phoneNumber)

    return { status: true, statusCode: 201 };
  }

  async resetPasswordVerify({
    resetPasswordCode,
  }: ResetPasswordVerifyDto): Promise<ResetPasswordVerifyResponse> {
    const user = await this.userRepository.findOne({
      where: {
        expiresAt: MoreThan(new Date(Date.now())),
        resetPasswordCode,
      },
    });

    if (!user)
      throw new UnauthorizedException({ status: false, statusCode: 401 });

    user.resetPasswordCode = '7';

    await this.userRepository.save(user);

    return { status: true, statusCode: 201 };
  }

  async resetPassword({
    password,
    phoneNumber,
  }: ResetPasswordDto): Promise<ResetPasswordResponse> {
    const user = await this.userRepository.findOne({
      where: {
        phoneNumber: phoneNumber.replace(/\s+/g, ''),
        resetPasswordCode: '7',
      },
    });

    if (!user)
      throw new UnauthorizedException({ status: false, statusCode: 401 });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordCode = null;
    user.expiresAt = null;
    await this.userRepository.save(user);

    return { status: true, statusCode: 201 };
  }

  async changePassword(
    id: number,
    { password, newPassword, confirmPassword }: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new BadRequestException();

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException();

    if (newPassword !== confirmPassword) {
      throw new UnauthorizedException({
        status: false,
        statusCode: 401,
        message: "password don't match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    const payload = { id: user.id, roleId: user.userRole };

    const token = this.jwtService.sign(payload);

    return {
      status: true,
      statusCode: 201,
      accessToken: token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
  }

  private generateRandomCode(): number {
    const min = 1000;
    const max = 9999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private async sendSMS(
    verificationCode: string,
    phoneNumber: string,
  ): Promise<void> {
    try {
      this.httpService.axiosRef.post(process.env.VERIMOR_URL, {
        username: process.env.VERIMOR_USERNAME,
        password: process.env.VERIMOR_PASSWORD,
        source_addr: '',
        valid_for: '',
        send_at: '',
        custom_id: '',
        datacoding: '0',
        messages: [
          {
            msg: verificationCode + 'dogrulama kodunuzdur.',
            dest: phoneNumber,
            id: '',
          },
        ],
      });
    } catch (error) {
      throw new Error('An error occurred');
    }
  }
}
