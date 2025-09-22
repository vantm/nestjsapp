import { Type, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { POSTGRES_DATA_SOURCE } from './constants';

type RepositoryProviderOptions = {
  provide: string;
  entityType: Type<any>;
};

export const repositoryProvider = (options: RepositoryProviderOptions) => {
  const { provide, entityType } = options;
  return {
    provide: provide,
    inject: [POSTGRES_DATA_SOURCE],
    useFactory(dataSource: DataSource) {
      return dataSource.getRepository(entityType);
    },
  } satisfies Provider;
};
