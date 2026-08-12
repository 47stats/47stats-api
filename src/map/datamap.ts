import { Json } from '../';
import {
  Geometry,
  GeoJsonProperties,
  Feature,
  FeatureCollection,
} from 'geojson';
import { BaseType } from '../base';
import {
  DatalistListProps,
  fetchData,
  getDatalistCount,
  getDatalistList,
} from '../';
import { getMaxRows } from '../fetch-overlimit';

/**
 * `column`と`formula`はいずれか必須パラメータです。
 * `area`はカンマ区切りです。配列指定も可です。
 */
export type DatamapPros = BaseType & {
  column?: string | string[];
  formula?: string;
  area?: string | string[];
  lonlat?: [number, number]; //経度、緯度の順で指定
  point?: string; //GeoJSON形式を文字列で指定
  polygon?: string; //GeoJSON形式を文字列で指定
  format?: string;
  srid?: number;
  filter?: string;
  start?: number;
  limit?: number;
  simplify?: boolean;
};

/**
 * ポイントデータをGeoJSON形式で取得します。
 * @param props DatamapPros
 * @returns geojson
 */
export const getDatamapPoint = async (
  props: DatamapPros
): Promise<FeatureCollection> => {
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
    filter: props.filter,
  };

  // 件数取得
  const count = props.limit || (await getDatalistCount(params));
  const data = await fetchOverlimitFeatures(
    '/map/datamap/point/geojson',
    Object.assign(params, {
      column: props.column,
      formula: props.formula,
      point: props.point,
      polygon: props.polygon,
      start: props.start,
      limit: props.limit,
    }),
    count
  );
  return data;
};

/**
 * ポリゴンデータをGeoJSON形式で取得します。
 * @param props DatamapPros
 * @returns geojson
 */
export const getDatamapPolygon = async (
  props: DatamapPros
): Promise<FeatureCollection> => {
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
    filter: props.filter,
  };

  // 件数取得
  const count = props.limit || (await getDatalistCount(params));
  const data = await fetchOverlimitFeatures(
    '/map/datamap/polygon/geojson',
    Object.assign(params, {
      column: props.column,
      formula: props.formula,
      simplify: props.simplify,
      point: props.point,
      polygon: props.polygon,
      start: props.start,
      limit: props.limit,
    }),
    count
  );
  return data;
};

/**
 * 一度に取得できるレコード数に制限が有ります。
 * 制限を気にしないよう内部で分割して取得するようにしました。
 * 複数レコードを返します。
 * @param url
 * @param parameter
 * @param count
 * @param name
 * @returns
 */
const fetchOverlimitFeatures = async (
  url: string,
  parameter: DatamapPros,
  count: number,
  name?: string
): Promise<FeatureCollection> => {
  const max_rows = getMaxRows();

  /** 非同期関数を定義 */
  const params = structuredClone(parameter);
  const fsync = async (
    start: number,
    limit: number
  ): Promise<FeatureCollection> => {
    return fetchData<FeatureCollection>(
      url,
      JSON.stringify(
        Object.assign({}, params, {
          column: '', //プロパティはDataListの方を参照します
          start: start,
          limit: limit,
        })
      ),
      name
    );
  };

  // プロミス実行回数を取得します
  let limit = max_rows;
  let n = 0;
  if (parameter.limit) {
    limit = Math.min(parameter.limit, max_rows);
    n = Math.ceil(parameter.limit / max_rows);
  } else {
    n = Math.ceil((count || 0) / max_rows);
  }

  // 列項目を制限範囲内に分割して、プロミスの配列に登録
  const array: Promise<FeatureCollection>[] = [];
  let dataList: Json[] = [];
  if (parameter.column) {
    dataList = await getDatalistList(parameter as DatalistListProps);
  }
  let start: number = params.start || 0;
  for (let i = 0; i < n; i++) {
    array.push(fsync(start, limit));
    start += limit;
  }

  // データを取得します
  const data = await Promise.all(array);

  // 分割して取得したデータをひとつに纏める
  let featureList: Feature<Geometry, GeoJsonProperties>[] = [];
  if (count) {
    let idx = 0;
    data.forEach(it => {
      const features = it.features;
      features.forEach(e => {
        e.properties = Object.assign({}, dataList[idx++]) as GeoJsonProperties;
        featureList = featureList.concat(e);
      });
    });
  }

  const result: FeatureCollection = {
    type: 'FeatureCollection',
    features: featureList,
  };
  return result;
};
