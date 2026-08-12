import { Polygon } from 'geojson';
import { fetchData } from '../fetchdata';

export type CircleProps = {
  longitude: number;
  latitude: number;
  radius: number;
  points?: number;
  format?: string;
  srid?: number;
};

/**
 * 円形領域を取得します。
 * @param props CircleProps
 * @returns Polygon
 */
export const getCircle = async (props: CircleProps): Promise<Polygon> => {
  const data = await fetchData<Polygon>(
    '/feature/circle',
    JSON.stringify({
      longitude: props.longitude,
      latitude: props.latitude,
      radius: props.radius,
      points: props.points,
      format: props.format,
      srid: props.srid,
    }),
    'feature'
  );
  return data;
};
