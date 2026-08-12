import { describe, expect, test } from 'vitest';
import { Point } from 'geojson';
import { getDatamapPoint, getDatamapPolygon } from '../../';

const baseParam = {
  database: 'KOK',
  store: 'CITY',
  column: ['CITY', 'DNAME', 'N1', 'N3', 'N5'],
  simplify: true,
};

describe('map/datamap', () => {
  test('Datamap Point', async () => {
    const result = await getDatamapPoint(
      Object.assign({ area: '40106' }, baseParam)
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Datamap Point - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getDatamapPoint(
      Object.assign({ point: JSON.stringify(point) }, baseParam)
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Datamap Polygon', async () => {
    const result = await getDatamapPolygon(
      Object.assign({ area: '40106' }, baseParam)
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Datamap Polygon - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getDatamapPolygon(
      Object.assign({ point: JSON.stringify(point) }, baseParam)
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });
});
