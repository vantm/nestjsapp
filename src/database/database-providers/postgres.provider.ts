import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { POSTGRES_DATA_SOURCE } from '@app/database/constants';

export const postgresProvider = {
  provide: POSTGRES_DATA_SOURCE,
  useFactory: async (configService: ConfigService) => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: configService.get<string>('PG_HOST', 'localhost'),
      port: configService.get<number>('PG_PORT', 5432),
      username: configService.get<string>('PG_USERNAME', 'postgres'),
      password: configService.get<string>('PG_PASSWORD', ''),
      database: configService.get<string>('PG_DATABASE', ''),
      synchronize: configService.get<boolean>('DB_DEV_DANGEROUSLY_SYNC', false),
      entities: [__dirname + '/../../**/*.model.{ts,js}'],
    });
    return dataSource.initialize();
  },
  imports: [ConfigModule],
  inject: [ConfigService],
};
