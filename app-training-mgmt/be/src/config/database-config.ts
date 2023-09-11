import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'postgres',
  password: 'RB123456#',
  database: 'training-management-app',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  migrationsRun: true,
};

export default databaseConfig;
