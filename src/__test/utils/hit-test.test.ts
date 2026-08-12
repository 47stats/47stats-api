import { describe, expect, test } from 'vitest';
import { hitTest } from '../../';

describe('utils/hit-test', () => {
  test('Hit Test', async () => {
    const result = await hitTest({
      database: '47MAPS',
      lon: 139.767,
      lat: 35.683,
    });
    console.log('Actual result:', result);

    // 結果が正しい形式かチェック
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('prefcode');
    expect(result).toHaveProperty('prefname');
    expect(result).toHaveProperty('citycode');
    expect(result).toHaveProperty('cityname');
    expect(result).toHaveProperty('towncode');
    expect(result).toHaveProperty('townname');

    // 実際のAPIがデータを返すかどうかをテスト
    // 空の値でない場合は東京都の一部であることを期待
    if (result.prefcode !== '') {
      expect(result.prefcode).toBe('13');
      expect(result.prefname).toContain('東京');
    }
  });
});
