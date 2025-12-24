# API 仕様書

## 概要

このドキュメントでは、プロジェクトで提供する REST API の仕様について説明します。

## 目次

- [基本情報](#基本情報)
- [共通レスポンス形式](#共通レスポンス形式)
  - [成功レスポンス](#成功レスポンス)
  - [エラーレスポンス](#エラーレスポンス)
  - [エラータイプ](#エラータイプ)
  - [HTTP ステータスコード](#http-ステータスコード)
- [エンドポイント一覧](#エンドポイント一覧)
- [エンドポイント詳細](#エンドポイント詳細)
  - [GET /api/events](#get-apievents)
  - [POST /api/events](#post-apievents)
- [注意事項](#注意事項)

## 基本情報

- **ベース URL**: `/api`
- **リクエスト形式**: JSON
- **レスポンス形式**: JSON
- **文字エンコーディング**: UTF-8

## 共通レスポンス形式

### 成功レスポンス

すべての API は以下の形式でレスポンスを返します。

```json
{
  "data": {
    // エンドポイントごとのデータ
  }
}
```

### エラーレスポンス

エラーが発生した場合、以下の形式でレスポンスを返します。
※ fields はエラータイプが`INVALID_PARAMETER`の場合のみ

```json
{
  "error": {
    "message": "エラーメッセージ",
    "type": "エラータイプ",
    "fields": {
      "fieldName": "フィールドごとのエラーメッセージ"
    }
  }
}
```

#### エラータイプ

| エラータイプ            | 説明                       |
| ----------------------- | -------------------------- |
| `INVALID_PARAMETER`     | リクエストパラメータが不正 |
| `UNAUTHORIZED`          | 認証が必要                 |
| `FORBIDDEN`             | アクセス権限がない         |
| `NOT_FOUND`             | リソースが見つからない     |
| `INTERNAL_SERVER_ERROR` | サーバー内部エラー         |

#### HTTP ステータスコード

| ステータスコード | 説明                   |
| ---------------- | ---------------------- |
| 200              | 成功                   |
| 201              | 作成成功               |
| 400              | リクエストが不正       |
| 401              | 認証が必要             |
| 403              | アクセス権限がない     |
| 404              | リソースが見つからない |
| 500              | サーバー内部エラー     |

## エンドポイント一覧

| メソッド | エンドポイント                   | 説明         |
| -------- | -------------------------------- | ------------ |
| GET      | [`/api/events`](#get-apievents)  | イベント検索 |
| POST     | [`/api/events`](#post-apievents) | イベント作成 |

## エンドポイント詳細

### GET /api/events

イベントを検索します。

#### リクエスト

**クエリパラメータ**

| パラメータ名       | 型     | 必須 | 説明                   |
| ------------------ | ------ | ---- | ---------------------- |
| keyword            | string | ×    | 言語のジャンル         |
| eventStartDatetime | string | ×    | イベント開始日時       |
| eventEndDatetime   | string | ×    | イベント終了日時       |
| evantPlace         | int    | ×    | 都道府県               |
| reward             | string | ×    | 報酬                   |
| reward_type        | int    | ×    | 報酬内容               |
| minutes_from       | int    | ×    | 所要時間の最低値（分） |
| minutes_to         | int    | ×    | 所要時間の最高値（分） |
| sort               | string | ×    | 整列・並び替え         |
| order              | string | ×    | 結果の並び替え         |

**バリデーション**

| フィールド名       | エラー条件                                          | エラーメッセージ                                                         |
| ------------------ | --------------------------------------------------- | ------------------------------------------------------------------------ |
| keyword            | 50 文字を超える場合                                 | "keyword must be 50 characters or less."                                 |
| eventStartDatetime | YYYY-MM-DDTHH:MM.SS.mmmZ 形式以外の文字列だった場合 | ”eventStartDatetime must be in YYYY-MM-DDTHH:MM:SS.mmmZ format.”         |
| eventStartDatetime | 翌日以降の日付                                      | ”eventStartDatetime must be a date starting from tomorrow or later.”     |
| eventEndDatetime   | YYYY-MM-DDTHH:MM.SS.mmmZ 形式以外の文字列だった場合 | "eventStartDatetime must be in YYYY-MM-DDTHH:MM:SS.mmmZ format."         |
| eventEndDatetime   | eventStartDatetime 以降の日付                       | "eventEndDatetime must be the same as or later than eventStartDatetime." |
| evantPlace         | 1~47 以外の文字列が入力された場合                   | "eventPlace must be a value between 1 and 47."                           |
| eventPlace         | 数値型ではない場合                                  | "eventPlace must be a numeric value."                                    |
| reward             | ・true/false 以外の文字列だった場合                 | "reward must be either "true" or "false"."                               |
| reward_type        | 指定してある数値を超える場合                        | "reword_type must be between 1 and 3."                                   |
| reward_type        | 数値型ではない                                      | "reward_type must be a numeric value."                                   |
| reward_type        | １未満の場合                                        | "reward_type must be 1 or greater."                                      |
| minutes_from       | 0 未満の場合                                        | "minutes_from must be 0 or greater."                                     |
| minutes_to         | 1440 を超える場合                                   | "minutes_to must be 1440 or less."                                       |
| sort               | 「createdAt」or 「eventStartDatetime」以外の場合    | "sort must be either "createdAt" or "eventStartDatetime"."               |
| order              | 「asc」or「desc」以外の場合                         | "order must be either "asc" or "desc"."                                  |

**リクエスト例**

```bash
curl -X GET "http://localhost:3000/api/events" \
  -H "Content-Type: application/json"
```

#### レスポンス

**成功時（200 OK）**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Next.js勉強会",
      "description": "Next.jsの基礎を学ぶ勉強会です",
      "eventStartDatetime": "2024-06-01T10:00:00.000Z",
      "eventEndDatetime": "2024-06-01T12:00:00.000Z",
      "capacity": 50,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**エラー時（400 Bad Request）**

```json
{
  "error": {
    "message": "Invalid query parameters",
    "type": "INVALID_PARAMETER",
    "fields": {
      "from": "invalid date format"
    }
  }
}
```

#### レスポンスデータ型

| フィールド名         | 型     | 説明                              |
| -------------------- | ------ | --------------------------------- |
| `id`                 | number | イベント ID                       |
| `name`               | string | イベント名                        |
| `description`        | string | イベント説明（null 可）           |
| `eventStartDatetime` | string | イベント開始日時（ISO 8601 形式） |
| `eventEndDatetime`   | string | イベント終了日時（ISO 8601 形式） |
| `capacity`           | number | 定員数                            |
| `createdAt`          | string | 作成日時（ISO 8601 形式）         |
| `updatedAt`          | string | 更新日時（ISO 8601 形式）         |

---

### POST /api/events

新しいイベントを作成します。

#### リクエスト

**リクエストボディ**

| パラメータ名         | 型     | 必須 | 説明             |
| -------------------- | ------ | ---- | ---------------- |
| `name`               | string | ⚪︎  | イベント名       |
| `description`        | string | -    | イベント説明     |
| `eventStartDatetime` | string | ⚪︎  | イベント開始日時 |
| `eventEndDatetime`   | string | ⚪︎  | イベント終了日時 |
| `capacity`           | number | ⚪︎  | 定員数           |

**バリデーション**

| フィールド名         | エラー条件                                  | エラーメッセージ                                                |
| -------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| `name`               | 未指定の場合                                | `"name is required"`                                            |
| `name`               | 文字列型でない場合                          | `"type of name must be string"`                                 |
| `name`               | 空文字列の場合                              | `"name must be at least 1 character"`                           |
| `name`               | 200 文字を超える場合                        | `"name must be at most 200 characters"`                         |
| `description`        | 文字列型でない場合                          | `"type of description must be string"`                          |
| `description`        | 空文字列の場合                              | `"description must be at least 1 character"`                    |
| `description`        | 500 文字を超える場合                        | `"description must be at most 500 characters"`                  |
| `eventStartDatetime` | 未指定の場合                                | `"eventStartDatetime is required"`                              |
| `eventStartDatetime` | 文字列型でない場合                          | `"type of eventStartDatetime must be string"`                   |
| `eventStartDatetime` | ISO 8601 形式でない場合                     | `"eventStartDatetime must be a valid ISO 8601 datetime format"` |
| `eventEndDatetime`   | 未指定の場合                                | `"eventEndDatetime is required"`                                |
| `eventEndDatetime`   | 文字列型でない場合                          | `"type of eventEndDatetime must be string"`                     |
| `eventEndDatetime`   | ISO 8601 形式でない場合                     | `"eventEndDatetime must be a valid ISO 8601 datetime format"`   |
| `eventEndDatetime`   | `eventStartDatetime` より前または等しい場合 | `"eventEndDatetime must be after than eventStartDatetime"`      |
| `capacity`           | 未指定の場合                                | `"capacity is required"`                                        |
| `capacity`           | 数値型でない場合                            | `"type of capacity must be number"`                             |
| `capacity`           | 1 未満の場合                                | `"capacity must be greater than 0"`                             |

**リクエスト例**

```bash
curl -X POST "http://localhost:3000/api/events" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Next.js勉強会",
    "description": "Next.jsの基礎を学ぶ勉強会です",
    "eventStartDatetime": "2024-06-01T10:00:00.000Z",
    "eventEndDatetime": "2024-06-01T12:00:00.000Z",
    "capacity": 50
  }'
```

#### レスポンス

**成功時（201 Created）**

```json
{
  "data": {
    "id": 1,
    "name": "Next.js勉強会",
    "description": "Next.jsの基礎を学ぶ勉強会です",
    "eventStartDatetime": "2024-06-01T10:00:00.000Z",
    "eventEndDatetime": "2024-06-01T12:00:00.000Z",
    "capacity": 50,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**エラー時（400 Bad Request）**

```json
{
  "error": {
    "message": "Invalid request body",
    "type": "INVALID_PARAMETER",
    "fields": {
      "eventEndDatetime": "eventEndDatetime must be after eventStartDatetime",
      "capacity": "capacity must be greater than 0"
    }
  }
}
```

#### レスポンスデータ型

| フィールド名         | 型     | 説明                              |
| -------------------- | ------ | --------------------------------- |
| `id`                 | number | イベント ID                       |
| `name`               | string | イベント名                        |
| `description`        | string | イベント説明（null 可）           |
| `eventStartDatetime` | string | イベント開始日時（ISO 8601 形式） |
| `eventEndDatetime`   | string | イベント終了日時（ISO 8601 形式） |
| `capacity`           | number | 定員数                            |
| `createdAt`          | string | 作成日時（ISO 8601 形式）         |
| `updatedAt`          | string | 更新日時（ISO 8601 形式）         |

---

## 注意事項

1. **日時形式**: すべての日時は ISO 8601 形式（UTC）で返されます
2. **エラーハンドリング**: エラーが発生した場合、適切な HTTP ステータスコードとエラー情報が返されます
3. **バリデーション**: リクエストパラメータはすべてバリデーションされます。不正な値が含まれている場合、エラーレスポンスが返されます
