import { readFileSync } from 'fs';
import { resolve } from 'path';
import { APIEnv } from './env';

// .env.test.localファイルを優先的に読み込み
try {
  const envTestLocalPath = resolve(process.cwd(), '.env.test.local');
  const envPath = resolve(process.cwd(), '.env');

  let envFile = '';

  // .env.test.localが存在すれば優先
  try {
    envFile = readFileSync(envTestLocalPath, 'utf-8');
  } catch {
    // フォールバックで.envを読み込み
    envFile = readFileSync(envPath, 'utf-8');
  }

  const envLines = envFile.split('\n');

  for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        const value = valueParts.join('=');
        process.env[key] = value;
      }
    }
  }

  // APIEnvを直接設定
  if (process.env.VITE_STATS_API_URL) {
    APIEnv.API_URL = process.env.VITE_STATS_API_URL;
  }
  if (process.env.VITE_STATS_API_KEY) {
    APIEnv.API_KEY = process.env.VITE_STATS_API_KEY;
  }
} catch {
  // .env.test.local / .env が見つからない場合は環境変数のみを使用
  // API キーはリポジトリにハードコードしないこと。.env.test.local に記載してください。
  if (process.env.VITE_STATS_API_URL) {
    APIEnv.API_URL = process.env.VITE_STATS_API_URL;
  }
  if (process.env.VITE_STATS_API_KEY) {
    APIEnv.API_KEY = process.env.VITE_STATS_API_KEY;
  }
}
