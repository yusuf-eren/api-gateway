import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  password: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  newPassword: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  confirmPassword: string;
}
