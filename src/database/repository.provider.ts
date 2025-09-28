import { Type, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { POSTGRES_DATA_SOURCE } from './constants';

export const repositoryProvider = (entityType: Type<any>) => {
  return {
    // provide: `${POSTGRES_DATA_SOURCE}_${entityType.name}Repository`,
    provide: `${entityType.name}Repository`,
    inject: [POSTGRES_DATA_SOURCE],
    useFactory(dataSource: DataSource) {
      return dataSource.getRepository(entityType);
    },
  } satisfies Provider;
};
