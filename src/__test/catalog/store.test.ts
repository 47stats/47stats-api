import { describe, expect, test } from 'vitest';
import {
  getStoreClass,
  getStoreCount,
  getStoreInfo,
  getStoreList,
} from '../../';

const baseParam = {
  database: 'KOK',
};

describe('catalog/store', () => {
  test('Store Class', async () => {
    const result = await getStoreClass(baseParam);
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Store Count', async () => {
    const result = await getStoreCount(Object.assign({}, baseParam));
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Store Info', async () => {
    const result = await getStoreInfo(
      Object.assign({ store: 'CITY' }, baseParam)
    );
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Store List', async () => {
    const result = await getStoreList(Object.assign({ limit: 10 }, baseParam));
    console.log(result);
    expect(result).not.toBeNull();
  });
});
