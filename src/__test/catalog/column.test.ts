import { describe, expect, test } from 'vitest';
import {
  getColumnClass,
  getColumnCount,
  getColumnInfo,
  getColumnList,
  getColumnKindCount,
  getColumnKindList,
} from '../../';

const baseParam = {
  database: 'KOK',
  store: 'CITY',
};

describe('catalog/column', () => {
  test('Column Class', async () => {
    const result = await getColumnClass(baseParam);
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Column Count', async () => {
    const result = await getColumnCount(Object.assign({}, baseParam));
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Column Info', async () => {
    const result = await getColumnInfo(
      Object.assign({ column: 'N1' }, baseParam)
    );
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Column List', async () => {
    const result = await getColumnList(
      Object.assign({ class: 'KOK@1@', limit: 10 }, baseParam)
    );
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Column Kind Count', async () => {
    const result = await getColumnKindCount(Object.assign({}, baseParam));
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Column Kind List', async () => {
    const result = await getColumnKindList(
      Object.assign({ limit: 10 }, baseParam)
    );
    console.log(result);
    expect(result).not.toBeNull();
  });
});
