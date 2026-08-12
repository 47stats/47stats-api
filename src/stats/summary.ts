import { BaseType } from '../base';
import { fetchOverlimitOne } from '../fetch-overlimit';

export type SummaryType = {
  [K: string]: number;
};

/**
 * `column`と`formula`はぁE��れか忁E��パラメータです、E
 */
export type SummaryProps = BaseType & {
  column: string | string[];
  formula?: string;
  area?: string | string[];
  lonlat?: [number, number]; //経度、緯度の順で指定
  point?: string; //GeoJSON形式を文字列で指定
  polygon?: string; //GeoJSON形式を文字列で指定
  format?: string;
  srid?: number;
  filter?: string;
};

/**
 * 統計データの`ランク（平均）`を取得します
 * @param props SummaryProps
 * @returns SummaryType
 */
export const getAverage = async (props: SummaryProps): Promise<SummaryType> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const data = await fetchOverlimitOne<SummaryType>(
    '/stats/summary/average',
    {
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
    },
    'average'
  );
  return data;
};

/**
 * 統計データの`件数`を取得します、E
 * @param props SummaryProps
 * @returns SummaryType
 */
export const getCount = async (props: SummaryProps): Promise<SummaryType> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const data = await fetchOverlimitOne<SummaryType>(
    '/stats/summary/count',
    {
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
    },
    'count'
  );
  return data;
};

/**
 * 統計データの`最大値`を取得します、E
 * @param props SummaryProps
 * @returns SummaryType
 */
export const getMax = async (props: SummaryProps): Promise<SummaryType> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const data = await fetchOverlimitOne<SummaryType>(
    '/stats/summary/max',
    {
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
    },
    'max'
  );
  return data;
};

/**
 * 統計データの`最小値`を取得します、E
 * @param props SummaryProps
 * @returns SummaryType
 */
export const getMin = async (props: SummaryProps): Promise<SummaryType> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const data = await fetchOverlimitOne<SummaryType>(
    '/stats/summary/min',
    {
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
    },
    'min'
  );
  return data;
};

/**
 * 統計データの`標準偏差`を取得します、E
 * @param props SummaryProps
 * @returns SummaryType
 */
export const getStdev = async (props: SummaryProps): Promise<SummaryType> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const data = await fetchOverlimitOne<SummaryType>(
    '/stats/summary/stdev',
    {
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
    },
    'stdev'
  );
  return data;
};

/**
 * 統計データの`合計値`を取得します、E
 * @param props SummaryProps
 * @returns SummaryType
 */
export const getTotal = async (props: SummaryProps): Promise<SummaryType> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const data = await fetchOverlimitOne<SummaryType>(
    '/stats/summary/total',
    {
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
    },
    'total'
  );
  return data;
};
