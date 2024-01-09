import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { CustomLogger } from '../logger/logger.service';
import { IGetUser } from 'src/auth/get-user.interface';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger(RequestLoggerMiddleware.name);
  constructor(private readonly loggerService: CustomLogger) {}

  use(req: any, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body } = req;

    res.on('finish', () => {
      try {
        const { statusCode } = res;
        const user: IGetUser = req.user;
        let formattedBody;
        if (Object.keys(body).length !== 0) {
          if (originalUrl == '/auth/login') {
            formattedBody = JSON.stringify({ username: body.username });
          } else {
            formattedBody = JSON.stringify(body);
          }
        } else {
          formattedBody = '';
        }
        // Log request information
        this.loggerService.log(
          `[${new Date().toISOString()}] ${ip} ${method} ${originalUrl} ${formattedBody} ${statusCode} ${
            user !== undefined ? user.username?.id : ''
          } ${user !== undefined ? user.role : ''}`,
        );
      } catch (error) {
        this.logger.error(
          error.message,
          error.stack,
          `${RequestLoggerMiddleware.name}`,
        );
        throw new InternalServerErrorException(error);
      }
    });

    // Continue with the request-response cycle
    next();
  }
}
