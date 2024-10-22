import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { COMMAND_DATABASE_URL } from '../constants';

export const mongodbConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: COMMAND_DATABASE_URL,
  useUnifiedTopology: true,
  synchronize: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  wtimeoutMS: 5000,
  readPreference: 'primary',
  loggerLevel: 'warn',
  writeConcern: {
    w: 'majority',
    j: true,
  },
};
