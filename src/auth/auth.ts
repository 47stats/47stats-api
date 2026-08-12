import { fetchData } from '../fetchdata';

export type AuthType = {
  authorization: string;
  limit: string;
};

/**
 * APIキーからAPI認証トークンを取得します。
 * @returns APIキーからAPI認証トークン
 */
export const getToken = async (): Promise<AuthType> => {
  const data = await fetchData<AuthType>('/auth');
  return data;
};
