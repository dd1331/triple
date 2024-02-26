import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormModuleOption: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'gombeul_css',
  dropSchema: true,
  autoLoadEntities: true,
  synchronize: true,
};
