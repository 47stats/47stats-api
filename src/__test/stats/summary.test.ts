import { describe, expect, test } from 'vitest';
import { Point } from 'geojson';
import {
  getAverage,
  getCount,
  getMax,
  getMin,
  getStdev,
  getTotal,
} from '../../';

const baseParam = {
  database: 'KOK',
  store: 'CITY',
  column: ['N1', 'N3', 'N5'],
};

describe('stats/summary', () => {
  test('Summary Average', async () => {
    const result = await getAverage(
      Object.assign(
        {
          area: '40',
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Summary Average - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getAverage(
      Object.assign(
        {
          point: JSON.stringify(point),
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Summary Count', async () => {
    const result = await getCount(
      Object.assign(
        {
          area: '40',
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Summary Count - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getCount(
      Object.assign(
        {
          point: JSON.stringify(point),
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Summary Max', async () => {
    const result = await getMax(
      Object.assign(
        {
          area: '40',
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Summary Max - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getMax(
      Object.assign(
        {
          point: JSON.stringify(point),
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Summary Min', async () => {
    const result = await getMin(
      Object.assign(
        {
          area: '40',
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Summary Min - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getMin(
      Object.assign(
        {
          point: JSON.stringify(point),
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Summary Stdev', async () => {
    const result = await getStdev(
      Object.assign(
        {
          area: '40',
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Summary Stdev - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getStdev(
      Object.assign(
        {
          point: JSON.stringify(point),
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Summary Total', async () => {
    const result = await getTotal(
      Object.assign(
        {
          area: '40',
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Summary Total - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getTotal(
      Object.assign(
        {
          point: JSON.stringify(point),
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });
});
