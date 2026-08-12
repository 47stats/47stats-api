import { describe, expect, test } from 'vitest';
import { Point } from 'geojson';
import { getAreaClass, getAreaCount, getAreaInfo, getAreaList } from '../../';

const baseParam = {
  database: 'KOK',
  store: 'CITY',
};

describe('catalog/area', () => {
  test('Area Class', async () => {
    const result = await getAreaClass(baseParam);
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
    expect(typeof result).toBe('object');
  });

  test('Area Count', async () => {
    const result = await getAreaCount(Object.assign({ area: '40' }, baseParam));
    console.log(`result: ${result}`);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
    expect(typeof result).toBe('number');
  });

  test('Area Count - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getAreaCount(
      Object.assign({ point: JSON.stringify(point) }, baseParam)
    );
    console.log(`result: ${result}`);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
    expect(typeof result).toBe('number');
  });

  test('Area Info', async () => {
    const result = await getAreaInfo(
      Object.assign({ area: '40106' }, baseParam)
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('fullname');
  });

  test('Area List', async () => {
    const result = await getAreaList(
      Object.assign({ area: '40', start: 0, limit: 10 }, baseParam)
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Area List - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getAreaList(
      Object.assign(
        { point: JSON.stringify(point), start: 0, limit: 10 },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
    expect(typeof result).toBe('object');
  });
});
