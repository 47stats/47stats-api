import { APIEnv } from './';

export class APIError extends Error {
  status?: number;
  statusText?: string;
  responseData?: unknown;
  constructor(
    message: string,
    status?: number,
    statusText?: string,
    responseData?: unknown
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
    this.responseData = responseData;
  }
}

type CacheEntry<T> = {
  value: T;
  expires: number;
};
const fetchDataCache = new Map<string, CacheEntry<unknown>>();

function getCacheKey(url: string, params?: string, name?: string): string {
  return `${url}|${params ?? ''}|${name ?? ''}`;
}

export const fetchData = async <T>(
  url: string,
  params?: string,
  name?: string,
  onError?: (error: APIError) => void,
  retry: number = 3,
  retryDelay: number = 500,
  cacheTTL: number = 300000, // 5分
  logger?: (msg: string, ...args: unknown[]) => void
): Promise<T> => {
  const cacheKey = getCacheKey(url, params, name);
  const now = Date.now();
  if (cacheTTL > 0 && fetchDataCache.has(cacheKey)) {
    const entry = fetchDataCache.get(cacheKey)!;
    if (entry.expires > now) {
      logger?.(`[fetchData] cache hit:`, { url, params, name });
      return entry.value as T;
    } else {
      fetchDataCache.delete(cacheKey);
    }
  }

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');
  requestHeaders.set('Authorization', APIEnv.API_KEY);

  // API_URL設定チェック
  if (!APIEnv.API_URL) {
    throw new APIError(
      'API_URL is not configured. Please set VITE_STATS_API_URL environment variable.'
    );
  }

  const fullUrl = APIEnv.API_URL + url;
  logger?.(`[fetchData] full URL:`, fullUrl);

  let lastError: APIError | null = null;
  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      logger?.(`[fetchData] request:`, { url, params, name, attempt });
      const response = await fetch(fullUrl, {
        headers: requestHeaders,
        method: 'POST',
        body: params,
      });
      if (!response.ok) {
        let errorData: unknown = undefined;
        try {
          errorData = await response.json();
        } catch {}
        const apiError = new APIError(
          `API response error: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
          errorData
        );
        logger?.(`[fetchData] response error:`, apiError);
        if (onError) onError(apiError);
        // 5xx系はリトライ対象
        if (response.status >= 500 && attempt < retry) {
          lastError = apiError;
          logger?.(`[fetchData] retrying after error`, { attempt, retryDelay });
          await new Promise(res => setTimeout(res, retryDelay));
          continue;
        }
        throw apiError;
      }
      const data: T = name
        ? (await response.json())[name]
        : await response.json();
      logger?.(`[fetchData] response success:`, { url, params, name, data });
      if (cacheTTL > 0) {
        fetchDataCache.set(cacheKey, { value: data, expires: now + cacheTTL });
      }
      return data;
    } catch (err) {
      // fetch自体の失敗（ネットワークエラー等）はリトライ対象
      const apiError =
        err instanceof APIError
          ? err
          : new APIError(
              `API request failed: ${err instanceof Error ? err.message : 'unknown error'}`
            );
      logger?.(`[fetchData] request error:`, apiError);
      if (onError) onError(apiError);
      if (attempt < retry) {
        lastError = apiError;
        logger?.(`[fetchData] retrying after error`, { attempt, retryDelay });
        await new Promise(res => setTimeout(res, retryDelay));
        continue;
      }
      throw apiError;
    }
  }
  // ここに到達することは通常ない
  throw lastError ?? new APIError('Unknown error');
};

//https://qiita.com/hayuse/items/8c65613a0ce7b1d838a7
