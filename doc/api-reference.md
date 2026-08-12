# 47stats-api API Reference

`@47stats/api` の TypeScript クライアント向け API リファレンスです。

## 基本設定

```ts
import { APIEnv } from '@47stats/api';

APIEnv.API_URL = 'https://api-stats.47stats.com/api/stats/v1';
APIEnv.API_KEY = 'your-api-key-or-token';
```

すべての API 呼び出しは内部的に `POST` で送信されます。`APIEnv.API_URL` は `/auth` や `/catalog/...` の前までのベース URL を指定します。

共通の基本 props:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `database` | `string` | Yes | データベース ID。例: `KOK` |
| `version` | `string` | No | データベースバージョン。未指定時は API 側の既定値 |
| `store` | `string` | Yes | データストア ID。例: `PREF`, `CITY`, `TOWN` |

空間条件で使う共通 props:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `area` | `string \| string[]` | No | 地域コードまたは地域コード配列 |
| `lonlat` | `[number, number]` | No | 経度、緯度。指定すると内部で GeoJSON Point に変換 |
| `point` | `string` | No | GeoJSON Point 文字列 |
| `polygon` | `string` | No | GeoJSON Polygon 文字列 |
| `format` | `string` | No | 座標データ形式。例: `geojson`, `wkt` |
| `srid` | `number` | No | 空間参照系 ID。例: `4326` |
| `filter` | `string` | No | 任意抽出条件。例: `N1<1000` |

ページング共通 props:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `start` | `number` | No | 取得開始位置 |
| `limit` | `number` | No | 取得件数。未指定時は件数取得後に内部で分割取得 |

## Auth

### `getToken()`

API キーから認証トークンを取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/auth` |
| Return | `Promise<AuthType>` |

```ts
type AuthType = {
  authorization: string;
  limit: string;
};
```

```ts
import { getToken } from '@47stats/api';

const token = await getToken();
```

## Catalog

### Database

#### `getDatabaseCount(props)`

データベースのカタログ件数を取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/database/count` |
| Props | `DatabaseCountProps` |
| Return | `Promise<number>` |

| Name | Type | Required |
| --- | --- | --- |
| `database` | `string` | No |
| `version` | `string` | No |
| `keyword` | `string` | No |

```ts
const count = await getDatabaseCount({ keyword: '国調' });
```

#### `getDatabaseInfo(props)`

データベースのカタログ情報を取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/database/info` |
| Props | `DatabaseInfoProps` |
| Return | `Promise<DatabaseType>` |

```ts
type DatabaseType = {
  database: string;
  version: string;
  name: string;
  desc: string;
};
```

```ts
const database = await getDatabaseInfo({
  database: 'KOK',
  version: '202400',
});
```

#### `getDatabaseList(props)`

データベースのカタログをリスト形式で取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/database/list` |
| Props | `DatabaseListProps` |
| Return | `Promise<DatabaseType[]>` |

| Name | Type | Required |
| --- | --- | --- |
| `database` | `string` | No |
| `version` | `string` | No |
| `keyword` | `string` | No |
| `start` | `number` | No |
| `limit` | `number` | No |

```ts
const databases = await getDatabaseList({ limit: 10 });
```

### Store

#### `getStoreClass(props)`

データストア分類のカタログを取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/store/class` |
| Props | `StoreClassProps` |
| Return | `Promise<StoreClassType[]>` |

| Name | Type | Required |
| --- | --- | --- |
| `database` | `string` | Yes |
| `version` | `string` | No |
| `class` | `string` | No |
| `start` | `number` | No |
| `limit` | `number` | No |

```ts
const classes = await getStoreClass({ database: 'KOK' });
```

#### `getStoreCount(props)`

データストアのカタログ件数を取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/store/count` |
| Props | `StoreCountProps` |
| Return | `Promise<number>` |

| Name | Type | Required |
| --- | --- | --- |
| `database` | `string` | Yes |
| `version` | `string` | No |
| `store` | `string` | No |
| `class` | `string` | No |
| `keyword` | `string` | No |

```ts
const count = await getStoreCount({ database: 'KOK' });
```

#### `getStoreInfo(props)`

データストアのカタログ情報を取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/store/info` |
| Props | `StoreInfoProps` |
| Return | `Promise<StoreType>` |

```ts
type StoreType = {
  store: string;
  name: string;
  date: number;
  pkey: string;
};
```

```ts
const store = await getStoreInfo({
  database: 'KOK',
  store: 'CITY',
});
```

#### `getStoreList(props)`

データストアのカタログをリスト形式で取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/store/list` |
| Props | `StoreListProps` |
| Return | `Promise<StoreType[]>` |

```ts
const stores = await getStoreList({ database: 'KOK' });
```

### Area

#### `getAreaClass(props)`

エリア分類のカタログを取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/area/class` |
| Props | `AreaClassProps` |
| Return | `Promise<AreaClassType[]>` |

```ts
type AreaClassType = {
  class: string;
  leaf: boolean;
  name: string;
};
```

```ts
const classes = await getAreaClass({
  database: 'KOK',
  store: 'CITY',
});
```

#### `getAreaCount(props)`

エリアのカタログ件数を取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/area/count` |
| Props | `AreaCountProps` |
| Return | `Promise<number>` |

主な props: 共通基本 props、空間条件 props、`class?: string`, `keyword?: string`。

```ts
const count = await getAreaCount({
  database: 'KOK',
  store: 'CITY',
  keyword: '福岡',
});
```

#### `getAreaInfo(props)`

エリアのカタログ情報を取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/area/info` |
| Props | `AreaInfoProps` |
| Return | `Promise<AreaInfoType>` |

```ts
type AreaInfoType = {
  code: string;
  name: string;
  fullname?: string;
};
```

```ts
const area = await getAreaInfo({
  database: 'KOK',
  store: 'CITY',
  area: '40106',
});
```

#### `getAreaList(props)`

エリアのカタログをリスト形式で取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/area/list` |
| Props | `AreaListProps` |
| Return | `Promise<AreaInfoType[]>` |

```ts
const areas = await getAreaList({
  database: 'KOK',
  store: 'CITY',
  keyword: '北九州',
  limit: 10,
});
```

### Column

#### `getColumnClass(props)`

列分類のカタログを取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/column/class` |
| Props | `ColumnClassProps` |
| Return | `Promise<ColumnClassType[]>` |

```ts
type ColumnClassType = {
  class: string;
  name: string;
  leaf: boolean;
};
```

```ts
const classes = await getColumnClass({
  database: 'KOK',
  store: 'CITY',
});
```

#### `getColumnCount(props)`

列のカタログ件数を取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/column/count` |
| Props | `ColumnCountProps` |
| Return | `Promise<number>` |

主な props: 共通基本 props、`column?: string | string[]`, `class?: string | string[]`, `kind?: string | string[]`, `keyword?: string`。

```ts
const count = await getColumnCount({
  database: 'KOK',
  store: 'CITY',
  keyword: '人口',
});
```

#### `getColumnInfo(props)`

列のカタログ情報を取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/column/info` |
| Props | `ColumnInfoProps` |
| Return | `Promise<ColumnInfoType>` |

```ts
type ColumnInfoType = {
  column: string;
  kind: string;
  name: string;
  desc: string;
  unit: string;
  dataType: number;
  length: number;
  scale: number;
  date1: number;
  date2: number;
};
```

```ts
const column = await getColumnInfo({
  database: 'KOK',
  store: 'CITY',
  column: 'N1',
});
```

#### `getColumnKindCount(props)`

列種別のカタログ件数を取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/column/kind/count` |
| Props | `ColumnCountProps` |
| Return | `Promise<number>` |

```ts
const count = await getColumnKindCount({
  database: 'KOK',
  store: 'CITY',
  keyword: '人口',
});
```

#### `getColumnKindList(props)`

列種別のカタログをリスト形式で取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/column/kind` |
| Props | `ColumnListProps` |
| Return | `Promise<ColumnKindType[]>` |

```ts
const kinds = await getColumnKindList({
  database: 'KOK',
  store: 'CITY',
  keyword: '人口',
  limit: 10,
});
```

#### `getColumnList(props)`

列のカタログをリスト形式で取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/catalog/column/list` |
| Props | `ColumnListProps` |
| Return | `Promise<ColumnInfoType[]>` |

```ts
const columns = await getColumnList({
  database: 'KOK',
  store: 'CITY',
  kind: 'N1',
  limit: 10,
});
```

## Stats

### Datalist

#### `getDatalistCount(props)`

統計データの件数を取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/stats/datalist/count` |
| Props | `DatalistCountPros` |
| Return | `Promise<number>` |

主な props: 共通基本 props、空間条件 props。

```ts
const count = await getDatalistCount({
  database: 'KOK',
  store: 'CITY',
  area: '40106',
});
```

#### `getDatalistList(props)`

統計データのリストを取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/stats/datalist/list` |
| Props | `DatalistListProps` |
| Return | `Promise<Json[]>` |

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `column` | `string \| string[]` | Yes | 列 ID |
| `formula` | `string` | No | 加工列 |
| `sort` | `string` | No | 並び順 |

```ts
const rows = await getDatalistList({
  database: 'KOK',
  store: 'CITY',
  area: ['40106', '40107'],
  column: ['N1', 'N3', 'N5'],
});
```

#### `getDatalistRow(props)`

指定コードの統計データを 1 レコード取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/stats/datalist/row` |
| Props | `DatalistRowProps` |
| Return | `Promise<Json>` |

| Name | Type | Required |
| --- | --- | --- |
| `column` | `string \| string[]` | Yes |
| `formula` | `string` | No |
| `code` | `string` | No |

```ts
const row = await getDatalistRow({
  database: 'KOK',
  store: 'CITY',
  code: '40106',
  column: ['N1', 'N3', 'N5'],
});
```

### Summary

Summary API は指定した列の集計値をオブジェクトで返します。`column` と `formula` は用途に応じて指定します。

```ts
type SummaryType = {
  [key: string]: number;
};
```

共通 props:

| Name | Type | Required |
| --- | --- | --- |
| `column` | `string \| string[]` | Yes |
| `formula` | `string` | No |
| `area` | `string \| string[]` | No |
| `lonlat` / `point` / `polygon` | various | No |
| `format` | `string` | No |
| `srid` | `number` | No |
| `filter` | `string` | No |

| Function | Endpoint | Description |
| --- | --- | --- |
| `getAverage(props)` | `/stats/summary/average` | 平均値を取得 |
| `getCount(props)` | `/stats/summary/count` | 件数を取得 |
| `getMax(props)` | `/stats/summary/max` | 最大値を取得 |
| `getMin(props)` | `/stats/summary/min` | 最小値を取得 |
| `getStdev(props)` | `/stats/summary/stdev` | 標準偏差を取得 |
| `getTotal(props)` | `/stats/summary/total` | 合計値を取得 |

```ts
const average = await getAverage({
  database: 'KOK',
  store: 'CITY',
  area: '40106',
  column: ['N1', 'N3', 'N5'],
});
```

### Rank

```ts
type RankType = {
  min: number;
  max: number;
  count: number;
};
```

#### `getRankAvg(props)`

ランク平均を取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/stats/rank/average` |
| Props | `RankAvgPros` |
| Return | `Promise<RankType[]>` |

```ts
const rank = await getRankAvg({
  database: 'KOK',
  store: 'CITY',
  column: 'N1',
});
```

#### `getFrequency(props)`

該当件数が均等になるランクを取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/stats/rank/frequency` |
| Props | `RankPros` |
| Return | `Promise<RankType[]>` |

| Name | Type | Required |
| --- | --- | --- |
| `column` | `string` | Yes |
| `division` | `number` | Yes |

```ts
const frequency = await getFrequency({
  database: 'KOK',
  store: 'CITY',
  column: 'N1',
  division: 5,
});
```

#### `getRange(props)`

数値範囲が均等になるランクを取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/stats/rank/range` |
| Props | `RankPros` |
| Return | `Promise<RankType[]>` |

```ts
const range = await getRange({
  database: 'KOK',
  store: 'CITY',
  column: 'N1',
  division: 5,
});
```

### Group

#### `getGroupCircle(props)`

円形領域内の集約データを取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/stats/group/circle` |
| Props | `GroupCircleProps` |
| Return | `Promise<Json>` |

| Name | Type | Required |
| --- | --- | --- |
| `column` | `string \| string[]` | Yes |
| `formula` | `string` | No |
| `longitude` | `number` | Yes |
| `latitude` | `number` | Yes |
| `radius` | `number` | Yes |
| `srid` | `number` | No |

```ts
const data = await getGroupCircle({
  database: 'KOK',
  store: 'CITY',
  column: ['N1', 'N3', 'N5'],
  longitude: 130.88,
  latitude: 33.88,
  radius: 1000,
});
```

#### `getGroupPolygon(props)`

任意領域内の集約データを取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/stats/group/polygon` |
| Props | `GroupPolygonProps` |
| Return | `Promise<Json>` |

| Name | Type | Required |
| --- | --- | --- |
| `column` | `string \| string[]` | Yes |
| `formula` | `string` | No |
| `polygon` | `string` | Yes |
| `format` | `string` | No |
| `srid` | `number` | No |

```ts
const data = await getGroupPolygon({
  database: 'KOK',
  store: 'CITY',
  column: 'N1',
  polygon: '{"type":"Polygon","coordinates":[[[130.88,33.88],[130.89,33.88],[130.89,33.89],[130.88,33.88]]]}',
  format: 'geojson',
});
```

## Map

### `getDatamapPoint(props)`

ポイントデータを GeoJSON FeatureCollection で取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/map/datamap/point/geojson` |
| Props | `DatamapPros` |
| Return | `Promise<FeatureCollection>` |

### `getDatamapPolygon(props)`

ポリゴンデータを GeoJSON FeatureCollection で取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/map/datamap/polygon/geojson` |
| Props | `DatamapPros` |
| Return | `Promise<FeatureCollection>` |

`DatamapPros`:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `column` | `string \| string[]` | No | Feature properties に付与する統計列 |
| `formula` | `string` | No | 加工列 |
| `area` | `string \| string[]` | No | 地域コード |
| `lonlat` / `point` / `polygon` | various | No | 空間条件 |
| `format` | `string` | No | 入力 geometry の形式 |
| `srid` | `number` | No | 空間参照系 ID |
| `filter` | `string` | No | 任意抽出条件 |
| `start` | `number` | No | 取得開始位置 |
| `limit` | `number` | No | 取得件数 |
| `simplify` | `boolean` | No | ポリゴン簡略化 |

```ts
const geojson = await getDatamapPolygon({
  database: 'KOK',
  store: 'CITY',
  area: '40106',
  column: ['N1', 'N3', 'N5'],
  simplify: true,
});
```

## Feature

### `getCircle(props)`

円形領域を GeoJSON Polygon で取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/feature/circle` |
| Props | `CircleProps` |
| Return | `Promise<Polygon>` |

| Name | Type | Required |
| --- | --- | --- |
| `longitude` | `number` | Yes |
| `latitude` | `number` | Yes |
| `radius` | `number` | Yes |
| `points` | `number` | No |
| `format` | `string` | No |
| `srid` | `number` | No |

```ts
const circle = await getCircle({
  longitude: 130.88,
  latitude: 33.88,
  radius: 1000,
});
```

### `getDonut(props)`

ドーナツ領域を GeoJSON Polygon で取得します。

| Item | Value |
| --- | --- |
| Endpoint | `/feature/donut` |
| Props | `DonutProps` |
| Return | `Promise<Polygon>` |

| Name | Type | Required |
| --- | --- | --- |
| `longitude` | `number` | Yes |
| `latitude` | `number` | Yes |
| `outer` | `number` | Yes |
| `inner` | `number` | Yes |
| `points` | `number` | No |
| `format` | `string` | No |
| `srid` | `number` | No |

```ts
const donut = await getDonut({
  longitude: 130.88,
  latitude: 33.88,
  outer: 1000,
  inner: 500,
});
```

## Utils

### `hitTest(props)`

指定座標に該当する都道府県、市区町村、町丁情報を取得します。内部では `getDatalistList` を使い、`database` 未指定時は `KOK`、`store` は `TOWN`、`srid` 未指定時は `4326` を使用します。

| Item | Value |
| --- | --- |
| Endpoint | `/stats/datalist/list` |
| Props | `{ lon: number; lat: number; database?: string; srid?: number }` |
| Return | `Promise<HitInfoType>` |

```ts
type HitInfoType = {
  prefcode: string;
  prefname: string;
  citycode: string;
  cityname: string;
  towncode: string;
  townname: string;
  fullname?: string;
};
```

```ts
const info = await hitTest({
  lon: 139.767,
  lat: 35.683,
});
```

## Low-level APIs

通常は上記のドメイン別関数を使用してください。必要に応じて低レベル関数も利用できます。

### `fetchData<T>(url, params?, name?, onError?, retry?, retryDelay?, cacheTTL?, logger?)`

任意の API パスにリクエストします。

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `string` | - | `APIEnv.API_URL` に連結する API パス |
| `params` | `string` | - | JSON 文字列化済みリクエスト body |
| `name` | `string` | - | レスポンス JSON から取り出すプロパティ名 |
| `onError` | `(error: APIError) => void` | - | エラーハンドラ |
| `retry` | `number` | `3` | リトライ回数 |
| `retryDelay` | `number` | `500` | リトライ間隔 ms |
| `cacheTTL` | `number` | `300000` | メモリキャッシュ TTL ms。`0` で無効化 |
| `logger` | `(msg: string, ...args: unknown[]) => void` | - | ログ出力関数 |

### `APIError`

```ts
class APIError extends Error {
  status?: number;
  statusText?: string;
  responseData?: unknown;
}
```

### Over-limit helpers

API の取得制限をまたぐための内部補助関数です。

| Function | Description |
| --- | --- |
| `getMaxRows()` | 1 回に取得する最大行数。現在は `1000` |
| `getMaxCols()` | 1 回に指定する最大列数。現在は `300` |
| `chunkColumn(column)` | 列 ID を最大列数ごとに分割 |
| `fetchOverlimitList<T>(url, parameter, count, name?)` | 複数レコードを分割取得して結合 |
| `fetchOverlimitOne<T>(url, parameter, name?)` | 1 レコードを列分割しながら取得して結合 |

## Endpoint Index

| Module | Function | Endpoint |
| --- | --- | --- |
| Auth | `getToken` | `/auth` |
| Catalog / Database | `getDatabaseCount` | `/catalog/database/count` |
| Catalog / Database | `getDatabaseInfo` | `/catalog/database/info` |
| Catalog / Database | `getDatabaseList` | `/catalog/database/list` |
| Catalog / Store | `getStoreClass` | `/catalog/store/class` |
| Catalog / Store | `getStoreCount` | `/catalog/store/count` |
| Catalog / Store | `getStoreInfo` | `/catalog/store/info` |
| Catalog / Store | `getStoreList` | `/catalog/store/list` |
| Catalog / Area | `getAreaClass` | `/catalog/area/class` |
| Catalog / Area | `getAreaCount` | `/catalog/area/count` |
| Catalog / Area | `getAreaInfo` | `/catalog/area/info` |
| Catalog / Area | `getAreaList` | `/catalog/area/list` |
| Catalog / Column | `getColumnClass` | `/catalog/column/class` |
| Catalog / Column | `getColumnCount` | `/catalog/column/count` |
| Catalog / Column | `getColumnInfo` | `/catalog/column/info` |
| Catalog / Column | `getColumnKindCount` | `/catalog/column/kind/count` |
| Catalog / Column | `getColumnKindList` | `/catalog/column/kind` |
| Catalog / Column | `getColumnList` | `/catalog/column/list` |
| Stats / Datalist | `getDatalistCount` | `/stats/datalist/count` |
| Stats / Datalist | `getDatalistList` | `/stats/datalist/list` |
| Stats / Datalist | `getDatalistRow` | `/stats/datalist/row` |
| Stats / Summary | `getAverage` | `/stats/summary/average` |
| Stats / Summary | `getCount` | `/stats/summary/count` |
| Stats / Summary | `getMax` | `/stats/summary/max` |
| Stats / Summary | `getMin` | `/stats/summary/min` |
| Stats / Summary | `getStdev` | `/stats/summary/stdev` |
| Stats / Summary | `getTotal` | `/stats/summary/total` |
| Stats / Rank | `getRankAvg` | `/stats/rank/average` |
| Stats / Rank | `getFrequency` | `/stats/rank/frequency` |
| Stats / Rank | `getRange` | `/stats/rank/range` |
| Stats / Group | `getGroupCircle` | `/stats/group/circle` |
| Stats / Group | `getGroupPolygon` | `/stats/group/polygon` |
| Map | `getDatamapPoint` | `/map/datamap/point/geojson` |
| Map | `getDatamapPolygon` | `/map/datamap/polygon/geojson` |
| Feature | `getCircle` | `/feature/circle` |
| Feature | `getDonut` | `/feature/donut` |
| Utils | `hitTest` | `/stats/datalist/list` |
