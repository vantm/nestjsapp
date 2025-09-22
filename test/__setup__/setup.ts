import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Wait } from 'testcontainers';

let pg: StartedPostgreSqlContainer;

export const getPostgresContainer = (): StartedPostgreSqlContainer | null => {
  return pg || null;
};

export default async () => {
  console.log('Starting PostgreSQL container...');

  pg = await new PostgreSqlContainer('postgres:17-alpine')
    .withUsername('postgres')
    .withPassword('postgres')
    .withDatabase('nestapp')
    .withExposedPorts({
      container: 5432,
      host: 12345,
      protocol: 'tcp',
    })
    .withWaitStrategy(
      Wait.forLogMessage('database system is ready to accept connections'),
    )
    .start();

  console.log('PostgreSQL container started.');
};
