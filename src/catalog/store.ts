import { fetchData } from '../fetchdata';
import { fetchOverlimitList } from '../fetch-overlimit';

export type StoreClassType = {
  class: string;
  name: string;
  leaf: boolean;
};

export type StoreType = {
  store: string;
  name: string;
  date: number;
  pkey: string;
};

export type StoreClassProps = {
  database: string;
  version?: string;
  class?: string;
  start?: number;
  limit?: number;
};

export type StoreCountProps = StoreInfoProps & {
  class?: string;
  keyword?: string;
};

export type StoreInfoProps = {
  database: string;
  version?: string;
  store?: string;
};

export type StoreListProps = StoreCountProps & {
  start?: number;
  limit?: number;
};

/**
 * データストア分類のカタログをリスト形式で取得します。
 * @param props StoreClassProps
 * @returns number
 */
export const getStoreClass = async (
  props: StoreClassProps
): Promise<StoreClassType[]> => {
  const data = await fetchData<StoreClassType[]>(
    '/catalog/store/class',
    JSON.stringify({
      database: props.database,
      version: props.version,
      class: props.class,
      start: props.start,
      limit: props.limit,
    }),
    'storeClassList'
  );
  return data;
};

/**
 * データストアのカタログ件数を取得します。
 * @param props StoreClassProps
 * @returns number
 */
export const getStoreCount = async (
  props: StoreCountProps
): Promise<number> => {
  const data = await fetchData<number>(
    '/catalog/store/count',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      class: props.class,
      keyword: props.keyword,
    }),
    'storeCount'
  );
  return data;
};

/**
 * データストアのカタログ情報を取得します。
 * @param props StoreInfoProps
 * @returns StoreType
 */
export const getStoreInfo = async (
  props: StoreInfoProps
): Promise<StoreType> => {
  const data = await fetchData<StoreType>(
    '/catalog/store/info',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
    }),
    'store'
  );
  return data;
};

/**
 * データストアのカタログをリスト形式で取得します。
 * @param props StoreListProps
 * @returns StoreType[]
 */
export const getStoreList = async (
  props: StoreListProps
): Promise<StoreType[]> => {
  const params = {
    database: props.database,
    version: props.version,
    keyword: props.keyword,
    start: props.start,
    limit: props.limit,
  };

  const count = props.limit || (await getStoreCount(params));
  const data = await fetchOverlimitList<StoreType>(
    '/catalog/store/list',
    params,
    count,
    'storeList'
  );
  return data;
};
