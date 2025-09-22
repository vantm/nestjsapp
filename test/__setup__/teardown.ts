import { getPostgresContainer } from './setup';

export default async () => {
  const pg = getPostgresContainer();
  if (pg) {
    console.log('Stopping PostgreSQL container...');
    await pg.stop();
    console.log('PostgreSQL container stopped.');
  } else {
    console.log('No PostgreSQL container to stop.');
  }
};
