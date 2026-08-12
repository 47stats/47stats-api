import { fetchData } from '../fetchdata';
import { fetchOverlimitList } from '../fetch-overlimit';

export type DatabaseType = {
  database: string;
  version: string;
  name: string;
  desc: string;
};

export type DatabaseCountProps = DatabaseInfoProps & {
  keyword?: string;
};

export type DatabaseInfoProps = {
  database?: string;
  version?: string;
};

export type DatabaseListProps = DatabaseCountProps & {
  start?: number;
  limit?: number;
};

/**
 * データベースのカタログ件数を取得します。
 * @param props DatabaseProps
 * @returns number
 */
export const getDatabaseCount = async (
  props: DatabaseCountProps
): Promise<number> => {
  const data = await fetchData<number>(
    '/catalog/database/count',
    JSON.stringify({
      database: props.database,
      version: props.version,
      keyword: props.keyword,
    }),
    'databaseCount'
  );
  return data;
};

/**
 * データベースのカタログ情報を取得します。
 * @param props DatabaseInfoProps
 * @returns number
 */
export const getDatabaseInfo = async (
  props: DatabaseInfoProps
): Promise<DatabaseType> => {
  const data = await fetchData<DatabaseType>(
    '/catalog/database/info',
    JSON.stringify({
      database: props.database,
      version: props.version,
    }),
    'database'
  );
  return data;
};

/**
 * データベースのカタログをリスト形式で取得します。
 * @param props DatabaseListProps
 * @returns DatabaseType[]
 */
export const getDatabaseList = async (
  props: DatabaseListProps
): Promise<DatabaseType[]> => {
  const params = {
    database: props.database,
    version: props.version,
    keyword: props.keyword,
    start: props.start,
    limit: props.limit,
  };

  const count = props.limit || (await getDatabaseCount(params));
  const data = await fetchOverlimitList<DatabaseType>(
    '/catalog/database/list',
    params,
    count,
    'databaseList'
  );
  return data;
};
