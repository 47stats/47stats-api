import { Polygon } from 'geojson';
import { fetchData } from '../fetchdata';

export type DonutProps = {
  longitude: number;
  latitude: number;
  outer: number;
  inner: number;
  points?: number;
  format?: string;
  srid?: number;
};

/**
 * ドーナツ領域を取得します。
 * @param props CircleProps
 * @returns Polygon
 */
export const getDonut = async (props: DonutProps): Promise<Polygon> => {
  const data = await fetchData<Polygon>(
    '/feature/donut',
    JSON.stringify({
      longitude: props.longitude,
      latitude: props.latitude,
      outer: props.outer,
      inner: props.inner,
      points: props.points,
      format: props.format,
      srid: props.srid,
    }),
    'feature'
  );
  return data;
};
