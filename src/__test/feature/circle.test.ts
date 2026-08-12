import { describe, expect, test } from 'vitest';
import { getCircle } from '../../';

describe('feature/circle', () => {
  test('Feature Circle', async () => {
    const result = await getCircle({
      longitude: 130.882741,
      latitude: 33.882006,
      radius: 3000,
    });
    console.log(result);
    expect(result).not.toBeNull();
  });
});
