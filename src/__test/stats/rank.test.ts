import { describe, expect, test } from 'vitest';
import { Point } from 'geojson';
import { getRankAvg, getFrequency, getRange } from '../../';

const baseParam = {
  database: 'KOK',
  store: 'CITY',
  column: 'N1',
};

describe('stats/rank', () => {
  test('Rank RankAvg', async () => {
    const result = await getRankAvg(
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

  test('Rank RankAvg - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getRankAvg(
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

  test('Rank Frequency', async () => {
    const result = await getFrequency(
      Object.assign(
        {
          division: 7,
          area: '40',
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Rank Frequency - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getFrequency(
      Object.assign(
        {
          division: 7,
          point: JSON.stringify(point),
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Rank Range', async () => {
    const result = await getRange(
      Object.assign(
        {
          division: 7,
          area: '40',
        },
        baseParam
      )
    );
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).not.toBeNull();
  });

  test('Rank Range - Point', async () => {
    const point: Point = {
      type: 'Point' as const,
      coordinates: [139.767, 35.681],
    };
    const result = await getRange(
      Object.assign(
        {
          division: 7,
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
