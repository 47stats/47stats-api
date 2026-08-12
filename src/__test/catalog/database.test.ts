import { describe, expect, test } from 'vitest';
import { getDatabaseCount, getDatabaseInfo, getDatabaseList } from '../../';

describe('catalog/database', () => {
  test('Database Count', async () => {
    const result = await getDatabaseCount({});
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Database Info', async () => {
    const result = await getDatabaseInfo({ database: 'KOK' });
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Database List', async () => {
    const result = await getDatabaseList({});
    console.log(result);
    expect(result).not.toBeNull();
  });
});
