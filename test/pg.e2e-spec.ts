import { Client } from 'pg';
import { getPostgresConnectionString } from './util';

describe('PgController (e2e)', () => {
  async function getClient(): Promise<AsyncDisposable & { client: Client }> {
    const client = new Client({
      connectionString: getPostgresConnectionString(),
    });

    await client.connect();

    return {
      client,
      [Symbol.asyncDispose]: async function () {
        await client.end();
      },
    };
  }

  it('db should be ready', async () => {
    await using clientResource = await getClient();
    const { client } = clientResource;

    const res = await client.query('SELECT 1 + 1 AS result');

    expect(res.rowCount).toBe(1);
    expect(res.rows[0]).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.rows[0].result).toBe(2);
  });
});
