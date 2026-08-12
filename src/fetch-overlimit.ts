import { Json } from './';
import { fetchData } from './fetchdata';

export type OverlimitType = Json & {
  column?: string | string[];
  start?: number;
  limit?: number;
};

// 一回にアクセス出来る制限値
const max_rows: number = 1000;
const max_cols: number = 300;

export const getMaxRows = (): number => {
  return max_rows;
};

export const getMaxCols = (): number => {
  return max_cols;
};

/**
 * パラメータに設定する列項目（column）の件数に制限があります。
 * 制限を超えないよう分割して返します。
 * @param column - 列項目の文字列または配列
 * @returns 分割された列項目の配列
 */
export const chunkColumn = (column: string | string[]): string[] => {
  let array: string[] = [];
  if (Array.isArray(column)) {
    array = column;
  } else if (column) {
    array = column.split(',');
  }
  const chunkResult: string[] = [];
  for (let i = 0; i < array.length; i += max_cols) {
    const chunk = array.slice(i, i + max_cols);
    chunkResult.push(chunk.join(','));
  }
  return chunkResult;
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
export const fetchOverlimitList = async <T>(
  url: string,
  parameter: OverlimitType,
  count: number,
  name?: string
): Promise<T[]> => {
  const params = structuredClone(parameter);

  /** 非同期関数を定義 */
  const fsync = async (
    start: number,
    limit: number,
    column?: string | string[]
  ): Promise<T[]> => {
    if (column) {
      params.column = column;
    }
    return fetchData<T[]>(
      url,
      JSON.stringify(
        Object.assign({}, params, {
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
  if (params.limit) {
    limit = Math.min(params.limit, max_rows);
    n = Math.ceil(params.limit / max_rows);
  } else {
    n = Math.ceil((count || 0) / max_rows);
  }

  // 列項目を制限範囲内に分割して、プロミスの配列に登録
  const array: Promise<T[]>[] = [];
  if (params.column) {
    const chunk = chunkColumn(params.column);
    chunk.forEach(it => {
      let start: number = params.start || 0;
      for (let i = 0; i < n; i++) {
        array.push(fsync(start, limit, it));
        start += limit;
      }
    });
  } else {
    let start: number = params.start || 0;
    for (let i = 0; i < n; i++) {
      array.push(fsync(start, limit));
      start += limit;
    }
  }

  // データを取得します
  const data = await Promise.all(array);

  // 分割して取得したデータをひとつに纏める
  const result: T[] = [];
  if (count) {
    const block = Math.ceil(count / max_rows);
    data.forEach((it, i) => {
      if (i < block) {
        // パフォーマンス向上のため、concatの代わりにpushを使用
        result.push(...it);
      } else {
        it.forEach((e, j) =>
          Object.assign(result[(i % block) * max_rows + j] as object, e)
        );
      }
    });
  }
  return result;
};

/**
 * パラメータに設定する列項目（column）の件数に制限が有ります。
 * 制限を気にしないよう内部で分割して取得するようにしました。
 * 1レコードを返します。
 * @param url
 * @param params
 * @param name
 * @returns
 */
export const fetchOverlimitOne = async <T>(
  url: string,
  parameter: OverlimitType,
  name?: string
): Promise<T> => {
  const params = structuredClone(parameter);

  /** 非同期関数を定義 */
  const fsync = async (column: string | string[]): Promise<T> => {
    params.column = column;
    return fetchData<T>(url, JSON.stringify(params), name);
  };

  // 列項目を制限範囲内に分割して、プロミスの配列に登録
  const array: Promise<T>[] = [];
  if (params.column) {
    const chunk = chunkColumn(params.column);
    chunk.forEach(it => array.push(fsync(it)));
  }

  // データを取得
  const data = await Promise.all(array);

  // 分割して取得したデータをひとつに纏める
  const result = {} as Record<string, unknown>;
  data.forEach(it => Object.assign(result, it));
  return result as T;
};
