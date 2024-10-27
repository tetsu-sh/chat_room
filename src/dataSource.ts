import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { TypeOrmNamingStrategy } from './config/TypeOrmNamingStrategy';

dotenv.config({ path: '.env.development.host' });

const config = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['migrations/**/*.ts'],
  synchronize: true,
  namingStrategy: new TypeOrmNamingStrategy(),
};
const dataSource = new DataSource(config as DataSourceOptions);
dataSource.initialize();
export default dataSource;
