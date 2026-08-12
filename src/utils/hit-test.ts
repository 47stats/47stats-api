import { Point } from 'geojson';
import { getDatalistList } from '../stats/datalist';

/**
 * ヒットテストの結果として返されるエリア情報の型定義
 */
export type HitInfoType = {
  prefcode: string;
  prefname: string;
  citycode: string;
  cityname: string;
  towncode: string;
  townname: string;
  fullname?: string;
};

/**
 * 指定された座標でのヒットテストを行い、該当するエリア情報を取得します。
 * @param props 座標とSRID情報
 * @returns 該当エリアのデータ配列
 */
export const hitTest = async (props: {
  lon: number;
  lat: number;
  database?: string;
  srid?: number;
}): Promise<HitInfoType> => {
  const point: Point = {
    type: 'Point' as const,
    coordinates: [props.lon, props.lat],
  };

  const baseParams = {
    database: props.database || 'KOK',
    store: 'TOWN',
    point: JSON.stringify(point),
    format: 'geojson',
    srid: props.srid || 4326,
    limit: 1,
  };

  // 利用可能なフィールドで取得
  const result = await getDatalistList({
    ...baseParams,
    column: ['PREF', 'CITY', 'TOWN', 'PREFNAME', 'CITYNAME', 'DNAME'],
  });

  // 結果が空の場合のデフォルト値を返す
  if (!result || result.length === 0) {
    return {
      prefcode: '',
      prefname: '',
      citycode: '',
      cityname: '',
      towncode: '',
      townname: '',
      fullname: '',
    };
  }

  const item = result[0] as Record<string, unknown>;

  // 安全な文字列取得のヘルパー関数
  const getStringValue = (
    obj: Record<string, unknown>,
    key: string
  ): string => {
    const value = obj[key];
    return typeof value === 'string' ? value : '';
  };

  return {
    prefcode: getStringValue(item, 'PREF'),
    prefname: getStringValue(item, 'PREFNAME'),
    citycode: getStringValue(item, 'CITY'),
    cityname: getStringValue(item, 'CITYNAME'),
    towncode: getStringValue(item, 'TOWN'),
    townname: getStringValue(item, 'DNAME'),
    fullname:
      `${getStringValue(item, 'PREFNAME')}${getStringValue(item, 'CITYNAME')}${getStringValue(item, 'DNAME')}` ||
      '',
  };
};
