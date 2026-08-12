import { describe, expect, test } from 'vitest';
import { getToken } from '../../';

describe('auth', () => {
  test('Auth Token', async () => {
    const result = await getToken();

    expect(result.authorization).toBeTruthy();
    expect(result.limit).toBeTruthy();
  });
});
