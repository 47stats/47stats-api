import { BaseType, Json } from '../';
import { fetchOverlimitOne } from '../fetch-overlimit';

export type GroupCircleProps = BaseType & {
  column: string | string[];
  formula?: string;
  longitude: number;
  latitude: number;
  radius: number;
  srid?: number;
};

export type GroupPolygonProps = BaseType & {
  column: string | string[];
  formula?: string;
  polygon: string;
  format?: string;
  srid?: number;
};

/**
 * `円形領域`内の集約データを取得します。
 * @param props GroupCircleProps
 * @returns Json
 */
export const getGroupCircle = async (
  props: GroupCircleProps
): Promise<Json> => {
  const data = await fetchOverlimitOne<Json>(
    '/stats/group/circle',
    {
      database: props.database,
      version: props.version,
      store: props.store,
      column: props.column,
      formula: props.formula,
      longitude: props.longitude,
      latitude: props.latitude,
      radius: props.radius,
      srid: props.srid,
    },
    'data'
  );
  return data;
};

/**
 * `任意領域`内の集約データを取得します。
 * @param props GroupCircleProps
 * @returns Json
 */
export const getGroupPolygon = async (
  props: GroupPolygonProps
): Promise<Json> => {
  const data = await fetchOverlimitOne<Json>(
    '/stats/group/polygon',
    {
      database: props.database,
      version: props.version,
      store: props.store,
      column: props.column,
      formula: props.formula,
      polygon: props.polygon,
      format: props.format,
      srid: props.srid,
    },
    'data'
  );
  return data;
};
