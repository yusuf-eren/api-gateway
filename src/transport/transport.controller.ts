import { All, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportGuard } from './transport.guard';
import { Request, Response } from 'express';
import { ServicePaths, Services } from './transport.constant';

@UseGuards(TransportGuard)
@Controller()
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @All(ServicePaths)
  async transporter(@Req() req: Request, @Res() res: Response) {
    const response = await this.transportService.transport(req);
    Object.keys(response.headers).forEach((key) => {
      res.setHeader(key, response.headers[key]);
    });

    return res.status(response.status).json(response.data);
  }

  @Get('active-services')
  async activeServices() {
    return Services;
  }
}
