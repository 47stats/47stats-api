import { describe, expect, test } from 'vitest';
import { getGroupCircle, getGroupPolygon } from '../../';

const baseParam = {
  database: 'KOK',
  store: 'CITY',
  column: ['N1', 'N3', 'N5'],
};

describe('stats/group', () => {
  test('Group Circle', async () => {
    const result = await getGroupCircle(
      Object.assign(
        {
          longitude: 130.882741,
          latitude: 33.882006,
          radius: 500,
        },
        baseParam
      )
    );
    console.log(result);
    expect(result).not.toBeNull();
  });

  test('Group Polygon', async () => {
    const result = await getGroupPolygon(
      Object.assign(
        {
          polygon: JSON.stringify({
            type: 'Polygon',
            coordinates: [
              [
                [130.881618, 33.883977],
                [130.881049, 33.881901],
                [130.884321, 33.88118],
                [130.884879, 33.883326],
                [130.881618, 33.883977],
              ],
            ],
          }),
        },
        baseParam
      )
    );
    console.log(result);
    expect(result).not.toBeNull();
  });
});
