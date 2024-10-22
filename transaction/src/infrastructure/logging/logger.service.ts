import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  log(message: string) {
    super.log(`[Transaction Service] ${message}`);
  }

  error(message: string, trace: string = '') {
    super.error(`[TransactionService] ${message}`, trace);
  }

  warn(message: string) {
    super.warn(`[Transaction Service] ${message}`);
  }
}
