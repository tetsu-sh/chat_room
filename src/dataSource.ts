import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });
const config = {
  type: 'mysql',
  host: 'localhost',
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['migrations/**/*.ts'],
  synchronize: true,
};
const dataSource = new DataSource(config as DataSourceOptions);
dataSource.initialize();
export default dataSource;
