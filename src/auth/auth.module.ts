import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { EmailVerification } from 'src/entities/email-verification.entity';
import { HttpModule } from '@nestjs/axios';
import { Profile } from 'src/entities/profile.entity';
import { Info } from 'src/entities/info.entity';
import { Role } from 'src/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      EmailVerification,
      Role,
      Profile,
      Info]
    ),
    HttpModule
  ],
  providers: [AuthService], controllers: [AuthController],
})
export class AuthModule { }
