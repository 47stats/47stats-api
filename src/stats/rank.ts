import { BaseType } from '../base';
import { fetchData } from '../fetchdata';

export type RankType = {
  min: number;
  max: number;
  count: number;
};

export type RankAvgPros = BaseType & {
  column: string;
  area?: string | string[];
  lonlat?: [number, number]; //経度、緯度の順で指定
  point?: string; //GeoJSON形式を文字列で指定
  polygon?: string; //GeoJSON形式を文字列で指定
  format?: string;
  srid?: number;
  filter?: string;
};

/**
 * `frequency`と`range`共用
 */
export type RankPros = RankAvgPros & {
  division: number;
};

/**
 * ランク（平均）を取得します。
 * @param props RankAvgPros
 * @returns RankType[]
 */
export const getRankAvg = async (props: RankAvgPros): Promise<RankType[]> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const data = await fetchData<RankType[]>(
    '/stats/rank/average',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      column: props.column,
      area: props.area,
      point: props.point,
      polygon: props.polygon,
      format: props.format,
      srid: props.srid,
      filter: props.filter,
    }),
    'rank'
  );
  return data;
};

/**
 * ランク（該当件数を均等にする）を取得します。
 * @param props RankPros
 * @returns RankType[]
 */
export const getFrequency = async (props: RankPros): Promise<RankType[]> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const data = await fetchData<RankType[]>(
    '/stats/rank/frequency',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      column: props.column,
      division: props.division,
      area: props.area,
      point: props.point,
      polygon: props.polygon,
      format: props.format,
      srid: props.srid,
      filter: props.filter,
    }),
    'rank'
  );
  return data;
};

/**
 * ランク（数値範囲を均等にする）を取得します。
 * @param props RankPros
 * @returns RankType[]
 */
export const getRange = async (props: RankPros): Promise<RankType[]> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const data = await fetchData<RankType[]>(
    '/stats/rank/range',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      column: props.column,
      division: props.division,
      area: props.area,
      point: props.point,
      polygon: props.polygon,
      format: props.format,
      srid: props.srid,
      filter: props.filter,
    }),
    'rank'
  );
  return data;
};
