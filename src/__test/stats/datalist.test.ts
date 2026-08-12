import { describe, expect, test } from 'vitest';
import { getDatalistCount, getDatalistRow, getDatalistList } from '../../';

const baseParam = {
  database: 'KOK',
  store: 'CITY',
  column: ['CITY', 'DNAME', 'N1', 'N3', 'N5'],
  area: '40',
};

describe('stats/datalist', () => {
  test('Datalist Count', async () => {
    const result = await getDatalistCount(baseParam);
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Datalist Row', async () => {
    const result = await getDatalistRow(
      Object.assign(
        {
          formula: 'N1 - N3',
          code: '40106',
        },
        baseParam
      )
    );
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Datalist List', async () => {
    const result = await getDatalistList(
      Object.assign(
        {
          start: 4,
          limit: 1,
        },
        baseParam
      )
    );
    console.log(result);
    expect(result).not.toBeNull();
  });
});
