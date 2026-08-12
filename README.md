# @47stats/api

[![npm version](https://badge.fury.io/js/@47stats%2Fapi.svg)](https://badge.fury.io/js/@47stats%2Fapi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)

47都道府県統計データAPIの公式TypeScriptクライアントライブラリです。日本の統計データを簡単にアクセス・活用できるよう設計されています。

## 特徴

- **型安全**: TypeScriptによる完全な型定義とIntelliSenseサポート
- **高性能**: 自動リトライ・メモリキャッシュ・大容量データ分割取得
- **堅牢性**: 包括的エラーハンドリングとデバッグ機能
- **包括的API**: 認証、カタログ、統計、地図、領域生成の全機能
- **開発者フレンドリー**: モダンなビルドツール（Vite、ESLint、Prettier、Vitest）
- **軽量**: 19.12 kB (gzipped: 3.66 kB)

## インストール

```bash
# npm
npm install @47stats/api

# yarn
yarn add @47stats/api

# pnpm
pnpm add @47stats/api
```

## クイックスタート

### 環境設定

```typescript
import { APIEnv } from '@47stats/api';

// API認証情報を設定（一度だけ実行）
APIEnv.API_URL = 'https://your-api-endpoint.com/api/stats/v1';
APIEnv.API_KEY = 'your-api-key';
```

### 基本的な使用例
先ずは **カタログ (Catalog)** から利用できるデータベース、ストア、カラム等を探してください。
以下の例は database: "KOK", store: "CITY" とありますが、ご利用の際はカタログに定義されている database および store を設定してください。

```typescript
import { getDatalistList, hitTest, getDatamapPolygon } from '@47stats/api';

// 例：福岡県の市区町村別人口データを取得
const populationData = await getDatalistList({
  database: "KOK",// データベース指定
  store: "CITY",         // 市区町村指定
  column: [
    "CITY",              // 市区町村コード
    "PREFNAME",          // 都道府県名
    "CITYNAME",          // 市区町村名
    "N1",                // 総人口
    "N3",                // 男性人口
    "N5"                 // 女性人口
  ],
  area: "40"             // 福岡県
});

// 例：座標から地域情報を取得（逆ジオコーディング）
const locationInfo = await hitTest({ 
  lon: 139.767, 
  lat: 35.683,
  database: 'KOK' 
});
console.log(locationInfo.prefname); // "東京都"
console.log(locationInfo.cityname); // "千代田区"

// 地図データをGeoJSON形式で取得
const mapData = await getDatamapPolygon({
  database: "KOK",
  store: "CITY",
  column: ["N1"],        // 人口データ
  area: "13",            // 東京都
  simplify: true         // 形状簡略化
});
```

## 主要機能

### 認証
```typescript
import { getToken } from '@47stats/api';

// API認証トークンを取得
const authInfo = await getToken();
console.log(`認証期限: ${authInfo.limit}`);
```

### 統計データ取得

#### データリスト取得
```typescript
import { getDatalistList, getDatalistCount } from '@47stats/api';

// データ件数を確認
const count = await getDatalistCount({
  database: "KOK",
  store: "CITY",
  area: "40"
});

// ページング付きでデータを取得
const dataList = await getDatalistList({
  database: "KOK",
  store: "CITY", 
  column: ["CITY", "DNAME", "N1", "N3", "N5"],
  area: "40",
  start: 0,
  limit: 10
});
```

#### 統計サマリー
```typescript
import { getAverage, getMax, getMin, getTotal, getStdev } from '@47stats/api';

const params = {
  database: "KOK",
  store: "CITY",
  column: ["N1", "N3", "N5"],
  area: "40"
};

// 各種統計値を取得
const average = await getAverage(params);    // 平均値
const maximum = await getMax(params);        // 最大値
const minimum = await getMin(params);        // 最小値
const total = await getTotal(params);        // 合計値
const stdev = await getStdev(params);        // 標準偏差
```

#### ランキング分析
```typescript
import { getRankAvg, getFrequency, getRange } from '@47stats/api';

const rankParams = {
  database: "KOK",
  store: "CITY",
  column: "N1",
  area: "40"
};

// 平均値によるランク分析
const rankAvg = await getRankAvg(rankParams);

// 件数均等分割（7段階）
const frequency = await getFrequency({ 
  ...rankParams, 
  division: 7 
});

// 数値範囲均等分割（5段階）
const range = await getRange({ 
  ...rankParams, 
  division: 5 
});
```

### 地図データ（GeoJSON）

```typescript
import { getDatamapPoint, getDatamapPolygon } from '@47stats/api';

const mapParams = {
  database: "KOK",
  store: "CITY",
  column: ["N1", "N3", "N5"],
  area: "13101",  // 千代田区
  simplify: true
};

// ポイントデータ取得
const pointData = await getDatamapPoint(mapParams);

// ポリゴンデータ取得 
const polygonData = await getDatamapPolygon(mapParams);

// Leaflet.jsやMapbox GLなどの地図ライブラリで直接利用可能
```

### カタログ情報

```typescript
import { 
  getDatabaseList, 
  getAreaList, 
  getColumnList,
  getStoreList 
} from '@47stats/api';

// 利用可能なデータベース一覧
const databases = await getDatabaseList({});

// エリア情報（都道府県、市区町村、町丁）
const areas = await getAreaList({
  database: "KOK",
  store: "PREF"  // または "CITY", "TOWN"
});

// データ列情報
const columns = await getColumnList({
  database: "KOK", 
  store: "CITY",
  limit: 50
});

// データストア情報
const stores = await getStoreList({
  database: "KOK"
});
```

### 領域生成

```typescript
import { getCircle, getDonut } from '@47stats/api';

// 円形領域（半径3km）
const circle = await getCircle({
  longitude: 130.882741,
  latitude: 33.882006,
  radius: 3000
});

// ドーナツ領域（外径1km、内径500m）
const donut = await getDonut({
  longitude: 130.882741,
  latitude: 33.882006,
  outer: 1000,
  inner: 500
});
```

### 座標・領域による検索

#### 座標指定
```typescript
// 座標による検索
const result = await getDatalistList({
  database: "KOK",
  store: "CITY", 
  column: ["CITY", "DNAME", "N1"],
  lonlat: [139.767, 35.683]  // 経度、緯度
});

// Point GeoJSONによる検索
const point = {
  type: 'Point',
  coordinates: [139.767, 35.683]
};
const result2 = await getDatalistList({
  database: "KOK",
  store: "CITY",
  column: ["CITY", "DNAME", "N1"],
  point: JSON.stringify(point)
});
```

#### ポリゴン領域指定
```typescript
const polygon = {
  type: 'Polygon',
  coordinates: [[[
    [130.881618, 33.883977],
    [130.881049, 33.881901], 
    [130.884321, 33.88118],
    [130.884879, 33.883326],
    [130.881618, 33.883977]
  ]]]
};

const result = await getDatalistList({
  database: "KOK",
  store: "CITY",
  column: ["CITY", "DNAME", "N1"],
  polygon: JSON.stringify(polygon)
});
```

## API関数リファレンス

すべての実装済みAPI関数の完全なリスト：

### 認証 (Auth)

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `getToken()` | APIキーから認証トークンを取得 | `Promise<AuthType>` |

### カタログ (Catalog)

#### Database

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `getDatabaseList(props)` | データベース一覧を取得 | `Promise<DatabaseType[]>` |
| `getDatabaseInfo(props)` | データベース情報を取得 | `Promise<DatabaseType>` |
| `getDatabaseCount(props)` | データベース件数を取得 | `Promise<number>` |

#### Store

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `getStoreList(props)` | データストア一覧を取得 | `Promise<StoreType[]>` |
| `getStoreInfo(props)` | データストア情報を取得 | `Promise<StoreType>` |
| `getStoreCount(props)` | データストア件数を取得 | `Promise<number>` |
| `getStoreClass(props)` | ストア分類一覧を取得 | `Promise<StoreClassType[]>` |

#### Area

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `getAreaList(props)` | エリア一覧を取得 | `Promise<AreaInfoType[]>` |
| `getAreaInfo(props)` | エリア情報を取得 | `Promise<AreaInfoType>` |
| `getAreaCount(props)` | エリア件数を取得 | `Promise<number>` |
| `getAreaClass(props)` | エリア分類一覧を取得 | `Promise<AreaClassType[]>` |

#### Column

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `getColumnList(props)` | 列一覧を取得 | `Promise<ColumnInfoType[]>` |
| `getColumnInfo(props)` | 列情報を取得 | `Promise<ColumnInfoType>` |
| `getColumnCount(props)` | 列件数を取得 | `Promise<number>` |
| `getColumnClass(props)` | 列分類一覧を取得 | `Promise<ColumnClassType[]>` |
| `getColumnKindList(props)` | 列種別一覧を取得 | `Promise<ColumnKindType[]>` |
| `getColumnKindCount(props)` | 列種別件数を取得 | `Promise<number>` |

### 統計データ (Stats)

#### Datalist

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `getDatalistList(props)` | 統計データリストを取得 | `Promise<Json[]>` |
| `getDatalistRow(props)` | 統計データ1行を取得 | `Promise<Json>` |
| `getDatalistCount(props)` | 統計データ件数を取得 | `Promise<number>` |

#### Group（領域内集計）

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `getGroupCircle(props)` | 円形領域内の集約データを取得 | `Promise<Json>` |
| `getGroupPolygon(props)` | 任意領域内の集約データを取得 | `Promise<Json>` |

#### Rank（ランク分析）

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `getRankAvg(props)` | 平均値によるランク分析 | `Promise<RankType[]>` |
| `getFrequency(props)` | 該当件数均等分割ランク | `Promise<RankType[]>` |
| `getRange(props)` | 数値範囲均等分割ランク | `Promise<RankType[]>` |

#### Summary（統計サマリー）

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `getCount(props)` | 件数を取得 | `Promise<SummaryType>` |
| `getMin(props)` | 最小値を取得 | `Promise<SummaryType>` |
| `getMax(props)` | 最大値を取得 | `Promise<SummaryType>` |
| `getAverage(props)` | 平均値を取得 | `Promise<SummaryType>` |
| `getTotal(props)` | 合計値を取得 | `Promise<SummaryType>` |
| `getStdev(props)` | 標準偏差を取得 | `Promise<SummaryType>` |

### 地図データ (Map)

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `getDatamapPoint(props)` | ポイントデータをGeoJSON形式で取得 | `Promise<FeatureCollection>` |
| `getDatamapPolygon(props)` | ポリゴンデータをGeoJSON形式で取得 | `Promise<FeatureCollection>` |

### 領域生成 (Feature)

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `getCircle(props)` | 円形領域を生成 | `Promise<Polygon>` |
| `getDonut(props)` | ドーナツ領域を生成 | `Promise<Polygon>` |

### ユーティリティ (Utils)

| 関数名 | 説明 | 戻り値 |
|--------|------|--------|
| `hitTest(props)` | 座標から地域情報を取得（逆ジオコーディング） | `Promise<HitInfoType>` |

### 低レベルAPI

| 関数名 | 説明 | パラメータ |
|--------|------|-----------|
| `fetchData<T>(url, params?, name?, onError?, retry?, retryDelay?, cacheTTL?, logger?)` | 汎用APIリクエスト関数 | 詳細なエラーハンドリングとキャッシュ制御 |
| `fetchOverlimitList<T>(url, params, count, name?)` | 大容量データの自動分割取得 | 件数制限を超えるデータを自動分割 |
| `fetchOverlimitOne<T>(url, params, name?)` | 大容量単一レコード取得 | 列数制限対応 |

---

## 高度な機能

### エラーハンドリング

```typescript
import { fetchData, APIError } from '@47stats/api';

try {
  const data = await fetchData(
    '/stats/summary/average',
    JSON.stringify(params),
    'average',
    (error: APIError) => {
      // カスタムエラーハンドラー
      console.error('API Error:', error.message);
      console.error('Status Code:', error.status);
      console.error('Response Data:', error.responseData);
      
      // エラー通知システムと連携
      notificationSystem.error(error.message);
    }
  );
} catch (error) {
  if (error instanceof APIError) {
    // APIエラーの詳細処理
    switch (error.status) {
      case 400:
        console.error('リクエストパラメータが不正です');
        break;
      case 401: 
        console.error('認証が必要です');
        break;
      case 429:
        console.error('APIレート制限に達しました');
        break;
      default:
        console.error('予期しないAPIエラーが発生しました');
    }
  }
}
```

### キャッシュとパフォーマンス

```typescript
const data = await fetchData(
  url,
  params,
  name,
  onError,
  3,        // リトライ回数（デフォルト: 3）
  1000,     // リトライ間隔（ミリ秒、デフォルト: 500）
  600000,   // キャッシュTTL（ミリ秒、デフォルト: 300000=5分）
  console.log // カスタムロガー
);

// 大容量データの自動分割取得
const largeDataset = await getDatalistList({
  database: "KOK",
  store: "TOWN",
  column: ["TOWN", "DNAME", "N1", "N3", "N5"],
  area: "13"      // 東京都全域
  // limitを指定しない場合、全データを自動分割して取得
});
```

## 開発環境

### 必要要件
- **Node.js**: 18.0.0以上
- **TypeScript**: 5.6.2以上
- **Modern Browser**: ES2020対応

### ローカル開発

```bash
# リポジトリクローン
git clone https://github.com/47stats/47stats-api.git
cd 47stats-api

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env
# .envファイルを編集してAPI認証情報を設定
```

### 環境変数設定

`.env`ファイルを作成し、以下を設定：

```env
# API設定
VITE_STATS_API_URL=https://your-api-endpoint.com/api/stats/v1
VITE_STATS_API_KEY=your-api-key
```

### 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# 型定義生成
npm run types:build

# パッケージング確認
npm run npm:pack

# リアルタイム開発
npm run build:watch

# 開発用プレビュー
npm run preview
```

### コード品質

```bash
# テスト実行
npm run test           # 全テスト
npm run test:watch     # ウォッチモード  
npm run coverage       # カバレッジ測定

# コード品質チェック
npm run lint           # ESLint実行
npm run lint:fix       # 自動修正
npm run format         # Prettier整形
npm run format:check   # フォーマット確認
npm run type-check     # TypeScript型チェック
```

## テスト

包括的なテストスイートによる品質保証：

```bash
# 全テスト実行
npm run test

# ウォッチモードでテスト
npm run test:watch

# カバレッジレポート生成
npm run coverage
```

### テスト例

```typescript
// src/__test__/stats/datalist.test.ts
import { describe, expect, test } from 'vitest';
import { getDatalistList, getDatalistCount } from '../../';

describe('stats/datalist', () => {
  test('データリスト取得テスト', async () => {
    const result = await getDatalistList({
      database: 'KOK',
      store: 'CITY',
      column: ['CITY', 'DNAME', 'N1'],
      area: '40',
      start: 0,
      limit: 5
    });
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
```

## プロジェクト構成

```
src/
├── auth/              # 認証機能
│   └── auth.ts        
├── catalog/           # カタログ操作  
│   ├── area.ts        # エリア情報
│   ├── column.ts      # 列情報
│   ├── database.ts    # データベース情報
│   └── store.ts       # ストア情報
├── feature/           # 領域生成
│   ├── circle.ts      # 円形領域
│   └── donut.ts       # ドーナツ領域  
├── map/               # 地図データ
│   └── datamap.ts     # GeoJSON取得
├── stats/             # 統計データ
│   ├── datalist.ts    # データリスト
│   ├── group.ts       # グループ集計
│   ├── rank.ts        # ランキング
│   └── summary.ts     # 統計サマリー
├── utils/             # ユーティリティ
│   └── hit-test.ts    # 座標→地域情報変換
├── __test/            # テストファイル
├── base.ts            # 基本型定義
├── env.ts             # 環境設定
├── fetchdata.ts       # API通信コア
├── fetch-overlimit.ts # 大容量データ処理
├── json.ts            # JSON型定義
└── test-setup.ts      # テスト環境設定
```

## 使用例・応用

### Webアプリケーション統合

```typescript
// React/Vue.js での使用例
import { useEffect, useState } from 'react';
import { getDatalistList, getDatamapPolygon } from '@47stats/api';

function PopulationMap({ prefecture = "40" }) {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const data = await getDatamapPolygon({
          database: "KOK",
          store: "CITY", 
          column: ["N1"], // 人口データ
          area: prefecture,
          simplify: true
        });
        setMapData(data);
      } catch (error) {
        console.error('地図データの取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [prefecture]);

  if (loading) return <div>読み込み中...</div>;
  
  // Leaflet/Mapbox GL JS等でmapDataを描画
  return <MapComponent data={mapData} />;
}
```

### データ分析・可視化

```typescript
// D3.js/Chart.js との連携例
import { getRankAvg, getFrequency } from '@47stats/api';

async function createRankingChart(prefecture: string) {
  // ランキングデータ取得
  const rankData = await getFrequency({
    database: "KOK",
    store: "CITY",
    column: "N1",
    area: prefecture,
    division: 7
  });

  // Chart.jsでヒストグラム描画
  const chartData = {
    labels: rankData.map((item, i) => `ランク${i + 1}`),
    datasets: [{
      label: '市区町村数',
      data: rankData.map(item => item.count),
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  };

  return new Chart(ctx, {
    type: 'bar',
    data: chartData
  });
}
```

### Node.js サーバーサイド

```typescript
// Express.js APIサーバー例
import express from 'express';
import { getDatalistList, hitTest } from '@47stats/api';

const app = express();

// 座標から地域情報取得API
app.get('/api/location/:lon/:lat', async (req, res) => {
  try {
    const { lon, lat } = req.params;
    const locationInfo = await hitTest({ 
      lon: parseFloat(lon), 
      lat: parseFloat(lat),
      database: 'KOK'
    });
    res.json(locationInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 統計データ検索API  
app.post('/api/stats', async (req, res) => {
  try {
    const data = await getDatalistList(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## TypeScript設定

プロジェクトは厳密なTypeScript設定を採用：

```json
// tsconfig.json（抜粋）
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "target": "ES2020",
    "module": "ESNext", 
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

### 型定義例

```typescript
// 完全な型サポート
import type { 
  DatalistListProps,
  AreaInfoType,
  HitInfoType,
  SummaryType,
  RankType 
} from '@47stats/api';

// 型安全なパラメータ構築
const params: DatalistListProps = {
  database: "KOK",     // 文字列リテラル型
  store: "CITY",       // "CITY" | "PREF" | "TOWN"
  column: ["N1", "N3"], // string | string[]
  area: "40"           // string | string[]
};
```

## パフォーマンス最適化

### 自動分割取得
大容量データを自動的に分割して取得：

```typescript
// 10,000件を超えるデータも自動分割で高速取得
const allJapanData = await getDatalistList({
  database: "KOK",
  store: "TOWN",  // 全国の町丁目データ
  column: ["TOWN", "DNAME", "N1"]
  // limitを指定しない = 全データを自動分割取得
});
```

### メモリキャッシュ
同一リクエストの結果を自動キャッシュ：

```typescript
// 初回は API 呼び出し
const data1 = await getDatalistList(params);

// 2回目以降は キャッシュから高速返却（5分間）
const data2 = await getDatalistList(params); 
```

### 地図データ最適化
```typescript
// 形状簡略化で軽量化
const lightMapData = await getDatamapPolygon({
  database: "KOK",
  store: "CITY",
  area: "40",
  simplify: true  // ポリゴン形状を簡略化
});
```

## 貢献

コントリビューション歓迎！以下の手順でご参加ください：

1. **Fork** このリポジトリを Fork
2. **Branch** フィーチャーブランチを作成  
   `git checkout -b feature/amazing-feature`
3. **Commit** 変更をコミット  
   `git commit -m 'Add amazing feature'`
4. **Push** ブランチをプッシュ  
   `git push origin feature/amazing-feature`
5. **Pull Request** を作成

### 開発ガイドライン

- **型安全性**: すべてのコードはTypeScriptで型安全である必要があります
- **テストカバレッジ**: 新機能には対応するテストを追加
- **コード品質**: ESLint・Prettierルールに準拠
- **ドキュメント**: 新機能にはドキュメントを追加
- **後方互換性**: 既存APIとの互換性を維持

## 既知の課題・制限

### APIレート制限
- 1秒あたり最大10リクエスト
- 1日あたり最大10,000リクエスト
- 同時接続数最大5接続

### データサイズ制限
- 1回の取得可能データ: 最大1,000件
- 列数制限: 最大300列
- ※ 本ライブラリが自動分割処理でこれらの制限を透過的に解決

### 対応ブラウザ
- Chrome 80+
- Firefox 75+  
- Safari 13.1+
- Edge 80+

## 変更履歴

### v0.9.0 (2026-06-07)
- 初回リリース
- 全API機能の型安全な実装
- 自動リトライ・キャッシュ機能
- GeoJSON対応
- 座標→地域変換機能
- ESM/CJS デュアル出力
- 包括的テストスイート

## ライセンス

このプロジェクトは [MIT License](./LICENSE) の下で公開されています。

## 関連リンク

- [47stats 公式サイト](https://www.47stats.com/)
- [47stats APIリファレンス](https://api-stats.47stats.com/reference/v1/index.html)
- [開発者チュートリアル ~ 47stats-apiの使い方](https://developers.47stats.com/)
- [47maps ~ 統計データ地理情報システム](https://47maps.com)
- [npm Package](https://www.npmjs.com/package/@47stats/api)
- [GitHub Repository](https://github.com/47stats/47stats-api)
- [Issue Tracker](https://github.com/47stats/47stats-api/issues)

---

> このライブラリは日本の47都道府県統計データを活用した  
> 分析・可視化アプリケーションの開発を強力にサポートします。
