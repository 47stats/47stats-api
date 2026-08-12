import { BaseType } from '../base';
import { fetchData } from '../fetchdata';
import { fetchOverlimitList } from '../fetch-overlimit';

export type ColumnClassType = {
  class: string;
  name: string;
  leaf: boolean;
};

export type ColumnKindType = {
  kind: string;
  name: string;
  desc: string;
  unit: string;
  dataType: number;
  length: number;
  scale: number;
};

export type ColumnInfoType = ColumnKindType & {
  column: string;
  date1: number;
  date2: number;
};

export type ColumnClassProps = BaseType & {
  class?: string;
  start?: number;
  limit?: number;
};

export type ColumnCountProps = BaseType & {
  column?: string | string[];
  class?: string | string[];
  kind?: string | string[];
  keyword?: string;
};

export type ColumnInfoProps = BaseType & {
  column?: string;
};

export type ColumnListProps = BaseType &
  ColumnCountProps & {
    start?: number;
    limit?: number;
  };

/**
 * 列分類のカタログをリスト形式で取得します。
 * @param props ColumnClassProps
 * @returns ColumnClassType[]
 */
export const getColumnClass = async (
  props: ColumnClassProps
): Promise<ColumnClassType[]> => {
  const data = await fetchData<ColumnClassType[]>(
    '/catalog/column/class',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      class: props.class,
      start: props.start,
      limit: props.limit,
    }),
    'columnClassList'
  );
  return data;
};

/**
 * 列のカタログ件数を取得します。
 * @param props ColumnCountProps
 * @returns number
 */
export const getColumnCount = async (
  props: ColumnCountProps
): Promise<number> => {
  const data = await fetchData<number>(
    '/catalog/column/count',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      column: props.column,
      class: props.class,
      kind: props.kind,
      keyword: props.keyword,
    }),
    'columnCount'
  );
  return data;
};

/**
 * 列のカタログ情報を取得します。
 * @param props ColumnInfoProps
 * @returns ColumnInfoType
 */
export const getColumnInfo = async (
  props: ColumnInfoProps
): Promise<ColumnInfoType> => {
  const data = await fetchData<ColumnInfoType>(
    '/catalog/column/info',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      column: props.column,
    }),
    'column'
  );
  return data;
};

/**
 * 列種別のカタログ件数を取得します。
 * @param props ColumnCountProps
 * @returns number
 */
export const getColumnKindCount = async (
  props: ColumnCountProps
): Promise<number> => {
  const data = await fetchData<number>(
    '/catalog/column/kind/count',
    JSON.stringify({
      database: props.database,
      version: props.version,
      store: props.store,
      kind: props.kind,
      class: props.class,
      keyword: props.keyword,
    }),
    'kindCount'
  );
  return data;
};
/**
 * 列種別のカタログをリスト形式で取得します。
 * @param props ColumnListProps
 * @returns ColumnKindType[]
 */
export const getColumnKindList = async (
  props: ColumnListProps
): Promise<ColumnKindType[]> => {
  const params = {
    database: props.database,
    version: props.version,
    store: props.store,
    kind: props.kind,
    class: props.class,
    keyword: props.keyword,
    start: props.start,
    limit: props.limit,
  };

  const count = props.limit || (await getColumnKindCount(params));
  const data = await fetchOverlimitList<ColumnKindType>(
    '/catalog/column/kind',
    params,
    count,
    'kindList'
  );
  return data;
};

/**
 * 列のカタログをリスト形式で取得します。
 * @param props ColumnListProps
 * @returns ColumnInfoType[]
 */
export const getColumnList = async (
  props: ColumnListProps
): Promise<ColumnInfoType[]> => {
  const params = {
    database: props.database,
    version: props.version,
    store: props.store,
    column: props.column,
    class: props.class,
    kind: props.kind,
    keyword: props.keyword,
    start: props.start,
    limit: props.limit,
  };

  const count = props.limit || (await getColumnCount(params));
  const data = await fetchOverlimitList<ColumnInfoType>(
    '/catalog/column/list',
    params,
    count,
    'columnList'
  );
  return data;
};
