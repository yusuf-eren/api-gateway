import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Services } from './transport.constant';

@Injectable()
export class TransportService {
  constructor(private readonly httpService: HttpService) { }

  async transport(req: Request) {
    const baseUrl = req.url.split('/');
    const serviceURL = Services[baseUrl[1]];
    if (!serviceURL) throw new ForbiddenException('Service not found');

    const url = serviceURL + '/' + baseUrl.slice(2).join('/');

    return this.httpService.axiosRef.request({
      method: req.method,
      url: url,
      data: req.body,
      headers: req.headers,
    });
  }
}
