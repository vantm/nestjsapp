import { Type, Provider } from '@nestjs/common';
import { createQueryBuilder, DataSource } from 'typeorm';
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

export const readonlyRepositoryProvider = (entityType: Type<any>) => {
  return {
    // provide: `Readonly${POSTGRES_DATA_SOURCE}_${entityType.name}Repository`,
    provide: `${entityType.name}Repository`,
    inject: [POSTGRES_DATA_SOURCE],
    useFactory(dataSource: DataSource) {
      return dataSource.getRepository(entityType).extend({
        // Override all write methods to throw an error
        save: () => {
          throw new Error('This is a read-only repository');
        },
        remove: () => {
          throw new Error('This is a read-only repository');
        },
        delete: () => {
          throw new Error('This is a read-only repository');
        },
        update: () => {
          throw new Error('This is a read-only repository');
        },
        softDelete: () => {
          throw new Error('This is a read-only repository');
        },
        restore: () => {
          throw new Error('This is a read-only repository');
        },
        createQueryBuilder: () => {
          throw new Error('This is a read-only repository');
        },
      });
    },
  } satisfies Provider;
};
