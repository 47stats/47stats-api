import { describe, expect, test } from 'vitest';
import { getDonut } from '../../';

describe('feature/donut', () => {
  test('Feature Donut', async () => {
    const result = await getDonut({
      longitude: 130.882741,
      latitude: 33.882006,
      outer: 1000,
      inner: 500,
    });
    console.log(result);
    expect(result).not.toBeNull();
  });
});
