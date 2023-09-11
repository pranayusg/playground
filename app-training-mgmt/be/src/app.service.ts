import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getVersion(): string {
    return 'Training Management Application V1.0.0';
  }
}
