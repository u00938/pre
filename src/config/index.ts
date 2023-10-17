import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
const conf = `.${process.env.NODE_ENV}.env`;
const env = dotenv.config({ path: conf });
if (env.error) {
  throw new Error('Couldn\'t find .env file');
}

export default {
  port: parseInt(process.env.NODE_PORT, 10),
  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },
  api: {
    prefix: '/api/v1'
  },
  db: [
    {
      name: 'wanted_pre_dev',
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [process.env.TYPEORM_ENTITIES]
    }
  ]
};
