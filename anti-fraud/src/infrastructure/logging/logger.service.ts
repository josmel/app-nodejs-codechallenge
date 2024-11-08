import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  log(message: string) {
    super.log(`[Anti-Fraud Service] ${message}`);
  }

  error(message: string, trace: string = '') {
    // Usamos un valor por defecto vacío
    super.error(`[Anti-Fraud Service] ${message}`, trace);
  }

  warn(message: string) {
    super.warn(`[Anti-Fraud Service] ${message}`);
  }
}
