import { ApiProperty } from '@nestjs/swagger';

export class UploadFileMultipleResponse {
  @ApiProperty({ type: 'string' })
  image: string;

  @ApiProperty({ type: 'string' })
  cover: string;
}
