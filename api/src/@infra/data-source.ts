import { DataSource, DataSourceOptions } from 'typeorm';
import { Todo } from '../@domain';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Todo],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
