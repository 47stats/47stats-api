import { BaseType } from '../';
import { fetchData } from '../fetchdata';
import { fetchOverlimitList } from '../fetch-overlimit';

export type AreaClassType = {
  class: string;
  leaf: boolean;
  name: string;
};

export type AreaInfoType = {
  code: string;
  name: string;
  fullname?: string;
};

export type AreaClassProps = BaseType & {
  class?: string;
  start?: number;
  limit?: number;
};

export type AreaCountProps = BaseType & {
  area?: string | string[];
  lonlat?: [number, number]; //経度、緯度の順で指定
  point?: string; //GeoJSON形式を文字列で指定
  polygon?: string; //GeoJSON形式を文字列で指定
  format?: string;
  srid?: number;
  class?: string;
  keyword?: string;
};

export type AreaInfoProps = BaseType & {
  area?: string | string[];
};

export type AreaListProps = BaseType &
  AreaCountProps & {
    start?: number;
    limit?: number;
  };

/**
 * エリア分類のカタログをリスト形式で取得します。
 * @param props AreaClassProps
 * @returns AreaClassType[]
 */
export const getAreaClass = async (
  props: AreaClassProps
): Promise<AreaClassType[]> => {
  const data = await fetchData<AreaClassType[]>(
    '/catalog/area/class',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      class: props.class,
      start: props.start,
      limit: props.limit,
    }),
    'areaClassList'
  );
  return data;
};

/**
 * エリアのカタログ件数を取得します。
 * @param props AreaCountProps
 * @returns number
 */
export const getAreaCount = async (props: AreaCountProps): Promise<number> => {
  if (props.lonlat) {
    const point = {
      type: 'Point' as const,
      coordinates: props.lonlat,
    };
    props.point = JSON.stringify(point);
  }
  const data = await fetchData<number>(
    '/catalog/area/count',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      area: props.area,
      point: props.point,
      polygon: props.polygon,
      format: props.format,
      srid: props.srid,
      class: props.class,
      keyword: props.keyword,
    }),
    'areaCount'
  );
  return data;
};

/**
 * エリアのカタログ情報を取得します。
 * @param props AreaInfoProps
 * @returns AreaInfoType
 */
export const getAreaInfo = async (
  props: AreaInfoProps
): Promise<AreaInfoType> => {
  const data = await fetchData<AreaInfoType>(
    '/catalog/area/info',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      area: props.area,
    }),
    'area'
  );
  return data;
};

/**
 * エリアのカタログをリスト形式で取得します。
 * @param props AreaListProps
 * @returns AreaInfoType[]
 */
export const getAreaList = async (
  props: AreaListProps
): Promise<AreaInfoType[]> => {
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
    area: props.area,
    point: props.point,
    polygon: props.polygon,
    format: props.format,
    srid: props.srid,
    class: props.class,
    keyword: props.keyword,
    start: props.start,
    limit: props.limit,
  };

  const count = props.limit || (await getAreaCount(params));

  const data = await fetchOverlimitList<AreaInfoType>(
    '/catalog/area/list',
    params,
    count,
    'areaList'
  );
  return data;
};
