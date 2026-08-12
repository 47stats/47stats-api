import { BaseType, Json } from '../';
import { fetchData } from '../fetchdata';
import { fetchOverlimitList, fetchOverlimitOne } from '../fetch-overlimit';

export type DatalistCountPros = BaseType & {
  area?: string | string[];
  lonlat?: [number, number]; //経度、緯度の順で指定
  point?: string; //GeoJSON形式を文字列で指定
  polygon?: string; //GeoJSON形式を文字列で指定
  format?: string;
  srid?: number;
  filter?: string;
};

export type DatalistListProps = DatalistCountPros & {
  column: string | string[];
  formula?: string;
  sort?: string;
  start?: number;
  limit?: number;
};

export type DatalistRowProps = BaseType & {
  column: string | string[];
  formula?: string;
  code?: string;
};

/**
 * 統計データの件数を取得します。
 * @param props DatalistCountPros
 * @returns number
 */
export const getDatalistCount = async (
  props: DatalistCountPros
): Promise<number> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const data = await fetchData<number>(
    '/stats/datalist/count',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      area: props.area,
      point: props.point,
      polygon: props.polygon,
      format: props.format,
      srid: props.srid,
      filter: props.filter,
    }),
    'dataCount'
  );
  return data;
};

/**
 * 統計データのリストを取得します。
 * @param props ColumnInfoProps
 * @returns Json[]
 */
export const getDatalistList = async (
  props: DatalistListProps
): Promise<Json[]> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const params = {
    database: props.database,
    version: props.version,
    store: props.store,
    column: props.column,
    formula: props.formula,
    area: props.area,
    point: props.point,
    polygon: props.polygon,
    format: props.format,
    srid: props.srid,
    filter: props.filter,
    sort: props.sort,
    start: props.start,
    limit: props.limit,
  };

  // 件数取得
  const count = props.limit || (await getDatalistCount(params));

  // データ取得
  const data = await fetchOverlimitList<Json>(
    '/stats/datalist/list',
    params,
    count,
    'dataList'
  );
  return data;
};

/**
 * 統計データを取得します。
 * @param props ColumnListProps
 * @returns Json
 */
export const getDatalistRow = async (
  props: DatalistRowProps
): Promise<Json> => {
  const data = await fetchOverlimitOne<Json>(
    '/stats/datalist/row',
    {
      database: props.database,
      version: props.version,
      store: props.store,
      column: props.column,
      formula: props.formula,
      code: props.code,
    },
    'data'
  );
  return data;
};
