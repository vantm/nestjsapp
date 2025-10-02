import { Type, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { POSTGRES_DATA_SOURCE } from './constants';

export const repositoryProvider = (entityType: Type<any>) => {
  return {
    provide: `${entityType.name}Repository`,
    inject: [POSTGRES_DATA_SOURCE],
    useFactory(dataSource: DataSource) {
      return dataSource.getRepository(entityType);
    },
  } satisfies Provider;
};
