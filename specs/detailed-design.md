# Memoleaf（メモリーフ）— 詳細仕様・内部設計書

> バージョン: 0.2（プロトタイプ向け）
> 前提ドキュメント: [機能仕様書](./functional-spec.md)

---

## 1. アーキテクチャ概要

### 1.1 全体方針

クリーンアーキテクチャを意識し、以下の3層に分離する。

```
┌──────────────────────────────────┐
│  Presentation（UI層）            │  React コンポーネント / Hooks
├──────────────────────────────────┤
│  Domain（ドメイン層）             │  エンティティ / ユースケース
├──────────────────────────────────┤
│  Infrastructure（インフラ層）     │  IndexedDB リポジトリ
└──────────────────────────────────┘
```

| 層 | 責務 | 依存方向 |
|---|---|---|
| **Presentation** | UIの描画・ユーザーインタラクション・状態管理 | → Domain |
| **Domain** | ビジネスロジック・エンティティ定義・リポジトリインターフェース | 依存なし |
| **Infrastructure** | データ永続化（IndexedDB）・外部サービスとの接続 | → Domain |

**依存の原則**: 外側の層は内側の層に依存するが、内側は外側を知らない。Infrastructure は Domain が定義したインターフェースに従って実装する（依存性逆転）。

### 1.2 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | React 18+ |
| 言語 | TypeScript（strict mode） |
| ビルドツール | Vite |
| スタイリング | Tailwind CSS |
| ルーティング | React Router v6 |
| データ永続化 | IndexedDB（idb ライブラリ経由） |
| ID生成 | `crypto.randomUUID()` |
| テスト | Vitest + React Testing Library |
| リンター | ESLint + Prettier |

---

## 2. ディレクトリ構成

```
src/
├── main.tsx                    # エントリーポイント
├── App.tsx                     # ルーティング・レイアウト定義
│
├── domain/                     # ドメイン層
│   ├── entities/
│   │   ├── Leaf.ts             # Leaf エンティティ
│   │   └── MemoKind.ts         # メモ種類エンティティ
│   ├── repositories/
│   │   ├── LeafRepository.ts   # Leaf リポジトリ インターフェース
│   │   └── MemoKindRepository.ts
│   └── usecases/
│       ├── createLeaf.ts       # Leaf 作成ユースケース
│       ├── updateLeaf.ts       # Leaf 更新ユースケース
│       ├── deleteLeaf.ts       # Leaf 削除ユースケース
│       ├── getLeaves.ts        # Leaf 取得・フィルタリング
│       ├── createMemoKind.ts   # メモ種類 作成
│       ├── deleteMemoKind.ts   # メモ種類 削除
│       └── reorderMemoKinds.ts # メモ種類 並び替え
│
├── infrastructure/             # インフラ層
│   ├── db/
│   │   └── database.ts         # IndexedDB 初期化・スキーマ定義
│   ├── repositories/
│   │   ├── IndexedDbLeafRepository.ts
│   │   └── IndexedDbMemoKindRepository.ts
│   └── seed.ts                 # 初期データ投入
│
├── presentation/               # UI層
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx   # 全体レイアウト（メインエリア＋ナビ）
│   │   │   └── BottomNav.tsx   # フッターナビゲーションバー
│   │   ├── shared/
│   │   │   ├── TagInput.tsx    # タグ入力コンポーネント
│   │   │   ├── TagChip.tsx     # タグチップ表示
│   │   │   ├── MemoKindButton.tsx  # メモ種類選択ボタン
│   │   │   ├── ConfirmDialog.tsx   # 確認ダイアログ
│   │   │   └── EmptyState.tsx      # 空状態表示
│   │   ├── write/
│   │   │   ├── WritePage.tsx       # Writeページ本体
│   │   │   ├── LeafForm.tsx        # メモ入力フォーム
│   │   │   └── RecentLeaves.tsx    # 最近の投稿履歴
│   │   ├── read/
│   │   │   ├── ReadPage.tsx        # Readページ本体
│   │   │   ├── FilterPanel.tsx     # 絞り込みパネル
│   │   │   ├── LeafTimeline.tsx    # タイムライン表示
│   │   │   ├── LeafCard.tsx        # カード表示
│   │   │   ├── LeafDetailModal.tsx # Leaf詳細モーダル
│   │   │   ├── LeafEditForm.tsx    # Leaf編集フォーム
│   │   │   └── SearchBar.tsx       # キーワード検索バー
│   │   └── settings/
│   │       ├── SettingsPage.tsx    # Settingsページ本体
│   │       ├── MemoKindList.tsx    # メモ種類一覧（並び替え対応）
│   │       ├── MemoKindForm.tsx    # メモ種類追加フォーム
│   │       └── DefaultKindSetting.tsx # デフォルト種類設定
│   ├── hooks/
│   │   ├── useLeaves.ts        # Leaf CRUD 操作 Hook
│   │   ├── useMemoKinds.ts     # メモ種類管理 Hook
│   │   ├── useFilteredLeaves.ts # フィルタリング Hook
│   │   └── useAppSettings.ts   # アプリ設定 Hook
│   └── contexts/
│       └── RepositoryContext.tsx # リポジトリ DI 用 Context
│
├── assets/
│   ├── icons/
│   │   ├── leaf.svg
│   │   ├── tree.svg
│   │   └── seed.svg
│   └── styles/
│       └── index.css           # Tailwind ディレクティブ + カスタムCSS
│
└── constants/
    ├── colors.ts               # カラーパレット定数
    └── presets.ts              # プリセットデータ定義
```

---

## 3. ドメイン層 詳細設計

### 3.1 エンティティ定義

#### Leaf

```typescript
type Leaf = {
  id: string;           // UUID v4
  body: string;         // メモ本文（1文字以上、上限なし）
  kindId: string;       // 紐づくメモ種類のID
  tags: string[];       // タグ配列（0個以上）
  createdAt: Date;      // 作成日時
  updatedAt: Date;      // 最終更新日時
  isArchived: boolean;  // アーカイブフラグ（プロトタイプではfalse固定）
  archivedAt: Date | null; // アーカイブ日時
};
```

#### MemoKind（メモ種類）

```typescript
type MemoKind = {
  id: string;     // UUID v4
  name: string;   // 種類名（1文字以上、重複不可）
  color: string;  // カラーコード（例: "#D97706"）
  order: number;  // 表示順（0始まり、昇順）
};
```

#### AppSettings（アプリ設定）

```typescript
type AppSettings = {
  defaultKindMode: "lastUsed" | "fixed"; // デフォルト種類の決定方法
  fixedDefaultKindId: string | null;     // 固定モード時のメモ種類ID
  lastUsedKindId: string | null;         // 最後に使用した種類ID
};
```

### 3.2 リポジトリインターフェース

#### LeafRepository

```typescript
interface LeafRepository {
  // 作成・更新・削除
  save(leaf: Leaf): Promise<void>;
  delete(id: string): Promise<void>;

  // 単一取得
  findById(id: string): Promise<Leaf | null>;

  // 一覧取得（フィルタリング対応）
  findAll(filter?: LeafFilter): Promise<Leaf[]>;

  // 直近N件取得（Write画面の履歴表示用）
  findRecent(limit: number): Promise<Leaf[]>;

  // 使用中タグ一覧取得（Readページのタグフィルタ用）
  getAllTags(): Promise<string[]>;
}

type LeafFilter = {
  kindIds?: string[];         // メモ種類ID（複数指定=OR）
  tags?: string[];            // タグ（複数指定=AND or OR、モード切替）
  tagFilterMode?: "and" | "or";
  keyword?: string;           // 本文・タグを対象としたキーワード
  dateFrom?: Date;            // 期間開始
  dateTo?: Date;              // 期間終了
  isArchived?: boolean;       // アーカイブフラグ
};
```

#### MemoKindRepository

```typescript
interface MemoKindRepository {
  save(kind: MemoKind): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<MemoKind | null>;
  findAll(): Promise<MemoKind[]>;     // order昇順でソート済み
  reorder(orderedIds: string[]): Promise<void>; // 並び替え
}
```

### 3.3 ユースケース詳細

#### createLeaf

```
入力: { body: string, kindId: string, tags: string[] }
処理:
  1. body が空文字でないことを検証
  2. kindId が存在するメモ種類か検証
  3. tags の各要素をトリム・空文字除去・重複排除
  4. Leaf オブジェクトを生成（id: UUID, createdAt/updatedAt: 現在時刻, isArchived: false）
  5. LeafRepository.save() で保存
  6. AppSettings.lastUsedKindId を更新
出力: 作成された Leaf
```

#### updateLeaf

```
入力: { id: string, body?: string, kindId?: string, tags?: string[] }
処理:
  1. 対象Leafが存在することを検証
  2. body が指定されている場合、空文字でないことを検証
  3. 変更されたフィールドのみ更新、updatedAt を現在時刻に
  4. LeafRepository.save() で保存
出力: 更新された Leaf
```

#### deleteLeaf

```
入力: { id: string }
処理:
  1. 対象Leafが存在することを検証
  2. LeafRepository.delete() で削除
出力: void
```

#### getLeaves（フィルタリング付き取得）

```
入力: LeafFilter（オプション）
処理:
  1. LeafRepository.findAll(filter) でフィルタ済み一覧を取得
  2. 結果は createdAt 降順（新しい順）でソート
出力: Leaf[]
```

#### deleteMemoKind

```
入力: { id: string }
処理:
  1. 対象メモ種類が存在することを検証
  2. 該当種類を持つ全Leafの kindId を「未分類」に変更
     - 「未分類」は削除不可の特別な種類として扱う
  3. MemoKindRepository.delete() で削除
  4. fixedDefaultKindId が削除対象の場合、nullに戻す
出力: void
```

---

## 4. インフラ層 詳細設計

### 4.1 IndexedDB スキーマ

**データベース名**: `memoleaf-db`
**バージョン**: 1

#### オブジェクトストア定義

| ストア名 | キー | インデックス |
|---|---|---|
| `leaves` | `id`（keyPath） | `kindId`, `createdAt`, `isArchived`, `tags`（multiEntry） |
| `memoKinds` | `id`（keyPath） | `order` |
| `appSettings` | `key`（keyPath） | なし |

#### インデックス設計

**leaves ストア**:

| インデックス名 | キーパス | ユニーク | 用途 |
|---|---|---|---|
| `by-kindId` | `kindId` | No | 種類フィルタ |
| `by-createdAt` | `createdAt` | No | 時系列ソート・日付フィルタ |
| `by-isArchived` | `isArchived` | No | アーカイブ除外 |
| `by-tags` | `tags` | No（multiEntry） | タグフィルタ |

**memoKinds ストア**:

| インデックス名 | キーパス | ユニーク | 用途 |
|---|---|---|---|
| `by-order` | `order` | Yes | 表示順ソート |

### 4.2 初期データ投入

アプリ初回起動（= memoKinds ストアが空）の場合、以下のプリセットを自動投入する。

```typescript
const PRESET_MEMO_KINDS: Omit<MemoKind, "id">[] = [
  { name: "日記",     color: "#D97706", order: 0 },  // アンバー
  { name: "アイデア", color: "#0891B2", order: 1 },  // シアン
  { name: "タスク",   color: "#059669", order: 2 },  // エメラルド
  { name: "感想",     color: "#7C3AED", order: 3 },  // バイオレット
];
```

#### 「未分類」種類

- メモ種類削除時のフォールバック先として、「未分類」を特別扱いする
- 未分類はIDを固定値（`"uncategorized"`）とし、ユーザーが削除・名前変更できない
- UI上の表示色はグレー系（`#6B7280`）

### 4.3 AppSettings の永続化

AppSettings は IndexedDB の `appSettings` ストアに Key-Value 形式で保存する。

| key | value型 | 初期値 |
|---|---|---|
| `defaultKindMode` | `"lastUsed" \| "fixed"` | `"lastUsed"` |
| `fixedDefaultKindId` | `string \| null` | `null` |
| `lastUsedKindId` | `string \| null` | `null`（初回投稿後に設定） |

---

## 5. プレゼンテーション層 詳細設計

### 5.1 ルーティング設計

| パス | コンポーネント | 説明 |
|---|---|---|
| `/` | `WritePage` | メイン（デフォルト） |
| `/read` | `ReadPage` | メモ閲覧 |
| `/settings` | `SettingsPage` | 設定 |

- React Router v6 の `BrowserRouter` + `Routes` を使用
- 存在しないパスは `/` にリダイレクト
- ページ遷移時にアニメーションは不要（シンプルさ優先）

### 5.2 レイアウト構造

```
┌─────────────────────────────────┐
│                                 │
│         メインコンテンツ          │  ← 各ページコンポーネント
│         （スクロール可能）         │     高さ: 100vh - ナビ高さ
│                                 │
├─────────────────────────────────┤
│  🍃 Write  🌳 Read  🌱 Settings │  ← BottomNav（固定）
└─────────────────────────────────┘
```

- `AppLayout` が全ページ共通のレイアウトを提供
- メインエリアは `overflow-y: auto` でスクロール対応
- `BottomNav` は `position: fixed; bottom: 0` で画面下部に固定
- メインコンテンツには `padding-bottom` でナビの高さ分の余白を確保

#### BottomNav 仕様

| 項目 | 値 |
|---|---|
| 高さ | 56px（モバイル標準） |
| 背景色 | `bg-amber-50` + 上部ボーダー |
| アイテム数 | 3（均等配置: `justify-around`） |
| アクティブ表示 | アイコン＋テキストの色を `text-green-700` に変更 |
| 非アクティブ | `text-stone-400` |

### 5.3 Writeページ コンポーネント設計

```
WritePage
├── LeafForm
│   ├── textarea（メモ本文入力）
│   ├── MemoKindButton × N（種類選択）
│   ├── TagInput（タグ入力）
│   └── button（投稿ボタン）
└── RecentLeaves
    └── LeafSummaryItem × 5
```

#### WritePage

| 責務 | 説明 |
|---|---|
| 状態管理 | `useLeaves` と `useMemoKinds` を利用 |
| 初期フォーカス | マウント時に textarea へ `autoFocus` |
| 投稿処理 | `createLeaf` ユースケース呼出 → フォームクリア |
| 投稿後の種類保持 | 選択中の kindId を維持（リセットしない） |

#### LeafForm

| Props | 型 | 説明 |
|---|---|---|
| `memoKinds` | `MemoKind[]` | 選択可能なメモ種類 |
| `defaultKindId` | `string` | 初期選択するメモ種類ID |
| `onSubmit` | `(data: CreateLeafInput) => void` | 投稿コールバック |

内部状態:

| 状態 | 型 | 初期値 |
|---|---|---|
| `body` | `string` | `""` |
| `selectedKindId` | `string` | `defaultKindId` |
| `tags` | `string[]` | `[]` |

バリデーションルール:
- `body.trim()` が空 → 投稿ボタン disabled
- `selectedKindId` が未設定 → デフォルト種類を自動選択

キーボードショートカット:
- `Ctrl+Enter` / `Cmd+Enter` → 投稿実行（`body` が空でない場合のみ）

#### TagInput

| 仕様 | 説明 |
|---|---|
| 入力方法 | テキスト入力後、Enter または `,` で確定 |
| 表示 | 確定済みタグは `TagChip` として横並び表示 |
| 削除 | 各 `TagChip` の × ボタンで削除 |
| 重複防止 | 同一タグ名は追加不可（大文字小文字を区別する） |
| トリム | 前後の空白を自動除去 |

#### RecentLeaves

| Props | 型 | 説明 |
|---|---|---|
| `leaves` | `Leaf[]` | 直近のleaf一覧（最大5件） |
| `memoKinds` | `MemoKind[]` | 種類名・色の解決用 |
| `onLeafClick` | `(id: string) => void` | leaf クリック時のコールバック |

表示仕様:
- 各 leaf は1行でコンパクトに表示: `[種類カラードット] 本文（30文字まで） HH:mm`
- 最大高さを制限し、超過分はスクロール表示
- leaf クリックで Read ページの詳細表示へ遷移

### 5.4 Readページ コンポーネント設計

```
ReadPage
├── FilterPanel
│   ├── MemoKindButton × N（種類フィルタ）
│   ├── TagChip × N（タグフィルタ）
│   ├── DateRangePicker（日付フィルタ）
│   └── SearchBar（キーワード検索）
├── LeafTimeline / LeafCardGrid（表示エリア）
│   └── LeafCard × N
└── LeafDetailModal（詳細表示）
    └── LeafEditForm（編集モード）
```

#### FilterPanel

状態管理: `useFilteredLeaves` Hook で一元管理

| フィルタ要素 | UI | 動作 |
|---|---|---|
| 種類フィルタ | `MemoKindButton`（トグル式） | 複数選択可。未選択=全種類表示 |
| タグフィルタ | `TagChip`（トグル式） | 複数選択可。AND/OR切替ボタン付き |
| 日付フィルタ | 開始日・終了日の `input[type="date"]` | 範囲指定 |
| キーワード検索 | `SearchBar`（テキスト入力） | 300ms デバウンスでインクリメンタル検索 |

フィルタの組み合わせロジック:
- 種類フィルタ × タグフィルタ × 日付フィルタ × キーワード → すべて AND 結合
- タグフィルタ内の複数タグ → AND / OR をユーザーが切替可能

#### tree表示エリア

プロトタイプでは**タイムライン形式**を標準表示とする。

**タイムライン表示（LeafTimeline）**:
- 日付ごとにグループ化し、日付ヘッダーを表示: `2026年4月17日（金）`
- 各 leaf はカード形式で縦に並べる
- カード内容: 本文全文、種類ラベル（カラー付き）、タグチップ、投稿時刻
- 無限スクロールまたはページネーション（プロトタイプでは全件表示でも可）

**カード表示（LeafCard）**:

| 要素 | 表示 |
|---|---|
| 本文 | 最大3行（超過時は `...` で切り詰め） |
| 種類 | 小さなカラーラベル |
| タグ | `TagChip` で横並び |
| 日時 | 相対時間（例: 3時間前）または日時 |

#### LeafDetailModal

- leaf クリック時にモーダル（またはスライドパネル）で表示
- 表示モードと編集モードを切り替え
- 表示モード: 本文全文、種類名、タグ、作成日時、更新日時
- 操作ボタン: 「編集」「削除」
- 削除時: `ConfirmDialog` で確認後に実行

#### LeafEditForm

| フィールド | 編集可否 |
|---|---|
| 本文 | ○（textarea） |
| メモ種類 | ○（MemoKindButton） |
| タグ | ○（TagInput） |
| 作成日時 | ×（表示のみ） |

### 5.5 Settingsページ コンポーネント設計

```
SettingsPage
├── MemoKindForm（種類追加フォーム）
├── MemoKindList（種類一覧・並び替え）
│   └── MemoKindListItem × N
└── DefaultKindSetting（デフォルト種類設定）
```

#### MemoKindForm（種類追加）

| フィールド | UI | バリデーション |
|---|---|---|
| 名前 | テキスト入力 | 1文字以上、既存種類名と重複不可 |
| 色 | カラーピッカー（`input[type="color"]`） | 必須 |

#### MemoKindList（種類一覧）

- 各種類を行として表示: カラードット、種類名、操作ボタン
- ドラッグ＆ドロップで並び替え
  - プロトタイプでは HTML Drag and Drop API を使用（ライブラリ不使用で軽量化）
  - ドラッグ中は視覚フィードバック（半透明化・ドロップ位置のインジケータ）
- 「未分類」は一覧に表示するが、削除・並び替え不可
- 削除ボタン押下 → `ConfirmDialog` で確認（「この種類のメモは未分類になります」）

#### DefaultKindSetting

| 設定 | UI |
|---|---|
| モード切替 | ラジオボタン: 「最後に使った種類」/「固定」 |
| 固定種類選択 | ドロップダウン（固定モード選択時のみ表示） |

### 5.6 共通コンポーネント仕様

#### MemoKindButton

| Props | 型 | 説明 |
|---|---|---|
| `kind` | `MemoKind` | メモ種類データ |
| `isSelected` | `boolean` | 選択状態 |
| `onClick` | `() => void` | クリックハンドラ |

スタイル:
- 選択時: `background-color: kind.color`、テキスト白
- 非選択時: `border: 2px solid kind.color`、テキストは `kind.color`
- `border-radius: 9999px`（pill型）
- パディング: `px-3 py-1`

#### TagChip

| Props | 型 | 説明 |
|---|---|---|
| `label` | `string` | タグ名 |
| `onRemove?` | `() => void` | 削除ハンドラ（指定時に×ボタン表示） |
| `isActive?` | `boolean` | アクティブ状態（フィルタ用） |
| `onClick?` | `() => void` | クリックハンドラ（フィルタ用） |

#### ConfirmDialog

| Props | 型 | 説明 |
|---|---|---|
| `isOpen` | `boolean` | 表示フラグ |
| `title` | `string` | ダイアログタイトル |
| `message` | `string` | 確認メッセージ |
| `onConfirm` | `() => void` | 確認ボタン押下時 |
| `onCancel` | `() => void` | キャンセル時 |

- バックドロップ（半透明黒背景）を表示
- バックドロップクリックでキャンセル
- `Escape` キーでキャンセル

#### EmptyState

| Props | 型 | 説明 |
|---|---|---|
| `message` | `string` | 表示メッセージ |
| `icon?` | `ReactNode` | アイコン（省略時はデフォルトの芽アイコン） |

- 中央配置、薄い色で表示
- 例: 「まだ芽が出ていません。最初のメモを書いてみましょう！」

---

## 6. Hooks 設計

### 6.1 useLeaves

```typescript
function useLeaves(): {
  // 状態
  leaves: Leaf[];
  recentLeaves: Leaf[];    // 直近5件
  isLoading: boolean;

  // 操作
  createLeaf: (input: CreateLeafInput) => Promise<Leaf>;
  updateLeaf: (input: UpdateLeafInput) => Promise<Leaf>;
  deleteLeaf: (id: string) => Promise<void>;
  refreshLeaves: () => Promise<void>;
};
```

- マウント時に全 leaves をロード
- CUD 操作後は自動で `refreshLeaves` を呼び出し、UIに反映

### 6.2 useMemoKinds

```typescript
function useMemoKinds(): {
  memoKinds: MemoKind[];    // order順ソート済み
  isLoading: boolean;

  createMemoKind: (input: { name: string; color: string }) => Promise<MemoKind>;
  deleteMemoKind: (id: string) => Promise<void>;
  reorderMemoKinds: (orderedIds: string[]) => Promise<void>;
};
```

### 6.3 useFilteredLeaves

```typescript
function useFilteredLeaves(): {
  // フィルタ状態
  filter: LeafFilter;
  setKindFilter: (kindIds: string[]) => void;
  setTagFilter: (tags: string[]) => void;
  setTagFilterMode: (mode: "and" | "or") => void;
  setDateRange: (from?: Date, to?: Date) => void;
  setKeyword: (keyword: string) => void;
  clearFilters: () => void;

  // フィルタ結果
  filteredLeaves: Leaf[];
  availableTags: string[];   // 現在のフィルタ条件で使用中のタグ
  isLoading: boolean;
};
```

- キーワード検索は 300ms デバウンス処理
- フィルタ変更時にリアルタイムで結果を再計算

### 6.4 useAppSettings

```typescript
function useAppSettings(): {
  settings: AppSettings;
  updateDefaultKindMode: (mode: "lastUsed" | "fixed") => Promise<void>;
  updateFixedDefaultKindId: (kindId: string | null) => Promise<void>;
  getDefaultKindId: () => string;  // 現在の設定に基づくデフォルト種類IDを返す
};
```

---

## 7. 状態管理方針

### 7.1 状態の分類

| 分類 | 管理方法 | 例 |
|---|---|---|
| サーバー状態（永続化データ） | Custom Hooks + IndexedDB | leaves, memoKinds |
| UI状態（一時的） | コンポーネントローカル state | フォーム入力値、モーダル開閉 |
| アプリ設定 | Custom Hook + IndexedDB | defaultKindMode |
| 横断的状態 | React Context | リポジトリインスタンス |

### 7.2 React Context の使用

**RepositoryContext**: リポジトリインスタンスを DI するために使用

```typescript
type RepositoryContextType = {
  leafRepository: LeafRepository;
  memoKindRepository: MemoKindRepository;
};
```

- `App.tsx` でプロバイダを設置し、IndexedDB 実装を注入
- テスト時にはインメモリ実装に差し替え可能

### 7.3 外部状態管理ライブラリ

プロトタイプ段階では **不使用**。React の useState / useContext で十分対応可能な規模のため、過度な複雑化を避ける。将来的にデータ量・画面間連携が増えた場合に Zustand 等の導入を検討する。

---

## 8. デザイントークン

### 8.1 カラーパレット

Tailwind CSS のカスタムカラーとして `tailwind.config.ts` に定義する。

```typescript
// tailwind.config.ts の colors 拡張
const colors = {
  // ベース
  paper:       "#FAF6F0",  // 背景（日焼けた紙色）
  paperDark:   "#F0EAE0",  // 背景（やや濃い）
  ink:         "#3E2723",  // メインテキスト（ダークブラウン）
  inkLight:    "#6D4C41",  // サブテキスト
  inkMuted:    "#A1887F",  // プレースホルダー等

  // アクセント
  moss:        "#4A6741",  // プライマリアクセント（モスグリーン）
  mossLight:   "#6B8F63",  // ホバー等
  mossPale:    "#E8F0E6",  // 薄い背景

  // メモ種類プリセットカラー
  kindDiary:   "#D97706",  // 日記（アンバー）
  kindIdea:    "#0891B2",  // アイデア（シアン）
  kindTask:    "#059669",  // タスク（エメラルド）
  kindNote:    "#7C3AED",  // 感想（バイオレット）

  // 未分類
  kindDefault: "#6B7280",  // 未分類（グレー）

  // 落ち葉（将来用）
  fallen:      "#C4A882",  // 枯れ葉色
};
```

### 8.2 タイポグラフィ

| 用途 | サイズ | ウェイト | 備考 |
|---|---|---|---|
| ページ内テキスト | `text-base`（16px） | `font-normal` | メイン |
| leaf本文（入力） | `text-lg`（18px） | `font-normal` | 書きやすさ重視 |
| 見出し | `text-xl`（20px） | `font-semibold` | |
| メタ情報（時刻等） | `text-sm`（14px） | `font-normal` | `text-inkLight` |
| タグ・ラベル | `text-xs`（12px） | `font-medium` | |

フォント: Tailwind デフォルト（`font-sans`）を使用。和文はシステムフォントにフォールバック。

### 8.3 スペーシング・サイズ

| 要素 | 値 |
|---|---|
| ページパディング | `p-4`（16px） |
| カード間スペース | `gap-3`（12px） |
| ボタンパディング | `px-3 py-1.5`（pill型は `px-4 py-1`） |
| ナビバー高さ | `h-14`（56px） |
| 入力フォーム最小高さ | `min-h-[120px]` |
| モーダル幅 | `max-w-lg`（512px） |

### 8.4 角丸・影

| 要素 | 角丸 | 影 |
|---|---|---|
| カード | `rounded-lg` | `shadow-sm` |
| ボタン | `rounded-full`（pill） | なし |
| 入力フォーム | `rounded-md` | `shadow-inner`（微弱） |
| モーダル | `rounded-xl` | `shadow-xl` |

---

## 9. データフロー

### 9.1 メモ投稿フロー

```
ユーザー操作                  コンポーネント           Hook              ユースケース          リポジトリ
─────────────────────────────────────────────────────────────────────────────────────
本文入力                  → LeafForm(state更新)
種類選択                  → LeafForm(state更新)
タグ追加                  → TagInput → LeafForm(state更新)
投稿ボタン or Ctrl+Enter  → LeafForm.onSubmit()
                             → WritePage           → useLeaves
                                                      .createLeaf()   → createLeaf()     → LeafRepository
                                                                                              .save()
                                                      .refreshLeaves()                    → .findRecent(5)
                          ← フォームクリア
                          ← RecentLeaves 更新
```

### 9.2 フィルタリングフロー

```
ユーザー操作               コンポーネント         Hook                     リポジトリ
───────────────────────────────────────────────────────────────────────
種類ボタン選択          → FilterPanel         → useFilteredLeaves
                                                 .setKindFilter()
キーワード入力          → SearchBar           → .setKeyword()
                                                 (300ms debounce)
                                              └→ LeafRepository
                                                   .findAll(filter)
                        ← LeafTimeline 再描画
```

---

## 10. エラーハンドリング

### 10.1 方針

| カテゴリ | 対応方針 |
|---|---|
| IndexedDB 操作失敗 | コンソールにログ出力 + ユーザーにトースト通知 |
| バリデーションエラー | UI上でインラインメッセージ表示（フォーム要素付近） |
| 存在しないデータ参照 | 静かに無視（種類が見つからない場合は「未分類」にフォールバック） |

### 10.2 トースト通知

- 画面上部に一時的なメッセージを表示（3秒で自動消去）
- 成功時: 緑系、メッセージ例: 「メモを保存しました」
- エラー時: 赤系、メッセージ例: 「保存に失敗しました。もう一度お試しください」
- プロトタイプでは `useState` ベースの簡易実装とする

---

## 11. レスポンシブ対応

### 11.1 ブレークポイント

| 名称 | 幅 | 対応 |
|---|---|---|
| モバイル | 375px〜 | メイン対象。フッターナビ、縦レイアウト |
| タブレット | 768px〜 | カード2列表示、フィルタパネル横配置 |
| デスクトップ | 1024px〜 | カード3列表示、メインコンテンツ幅制限（`max-w-3xl` 中央配置） |

### 11.2 レスポンシブ設計ポイント

- ナビゲーション: 全幅でフッター固定（プロトタイプ段階では全デバイス共通）
- Writeページ: textarea は画面幅いっぱい。メモ種類ボタンは flex-wrap で折り返し
- Readページ: モバイルではフィルタパネルを折りたたみ可能にし、表示面積を確保
- Settingsページ: 単一カラムレイアウト（レスポンシブ対応の負担を最小化）
- デスクトップ時のメインコンテンツは `max-w-3xl mx-auto` で中央配置し、横に広がりすぎない

---

## 12. パフォーマンス考慮事項

### 12.1 起動速度最適化

- Vite のコード分割: Read / Settings ページは `React.lazy` で遅延ロード
- Write ページは初期バンドルに含める（起動直後に表示するため）
- IndexedDB 初期化は非同期で行い、データ準備前は skeleton UI を表示

### 12.2 描画パフォーマンス

- メモ種類ボタン・タグチップは `React.memo` でメモ化
- フィルタリングは Hook 内でメモ化（`useMemo`）し、無関係な再描画を防ぐ
- キーワード検索はデバウンス（300ms）で不要なフィルタリング再実行を抑制
- 大量の leaf 表示時は仮想スクロール導入を検討（protoype では未実装）

---

## 13. テスト方針

### 13.1 テストレベル

| レベル | 対象 | ツール | 優先度 |
|---|---|---|---|
| ユニットテスト | ユースケース・ドメインロジック | Vitest | 高 |
| コンポーネントテスト | 主要UIコンポーネント | Vitest + React Testing Library | 中 |
| 統合テスト | ページ単位のユーザーフロー | Vitest + React Testing Library | 中 |
| E2Eテスト | 主要シナリオ | 未定（Playwright 等） | 低（プロトタイプ後） |

### 13.2 テスト対象の優先順位

1. **createLeaf / updateLeaf / deleteLeaf** ユースケース（バリデーション含む）
2. **deleteMemoKind**（leaf の kindId 置換ロジック）
3. **LeafForm** のバリデーション・投稿動作
4. **FilterPanel** のフィルタ組み合わせ動作
5. **TagInput** の入力・追加・削除動作

### 13.3 テスト用リポジトリ

テスト時は IndexedDB 実装の代わりに、インメモリ実装（`InMemoryLeafRepository` 等）を RepositoryContext 経由で注入する。

---

## 14. 将来拡張への考慮

| 拡張項目 | 現在の設計での備え |
|---|---|
| 落ち葉（アーカイブ）機能 | Leaf に `isArchived` / `archivedAt` フィールドを既に定義 |
| クラウド同期 | リポジトリパターンにより、API実装への差し替えが容易 |
| tree可視化（マインドマップ等） | タグの多対多関係を IndexedDB multiEntry で保持済み |
| ネイティブアプリ化 | React ベースのため React Native への移植パスが明確 |
| 表示形式の種類別切替 | ReadPage の表示コンポーネントを差し替え可能な設計 |

---

## 付録 A. 画面ワイヤーフレーム（テキスト版）

### Writeページ

```
┌───────────────────────────────────────┐
│                                       │
│  ┌─────────────────────────────────┐  │
│  │                                 │  │
│  │   メモを書く...                  │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                       │
│  [日記] [アイデア] [タスク] [感想]     │
│                                       │
│  タグ: [入力] [tag1 ×] [tag2 ×]       │
│                                       │
│  [          投稿する          ]       │
│                                       │
│  ─── 最近の投稿 ──────────────────     │
│  ● 今日の買い物リスト...      14:30   │
│  ● 新しいアプリのアイデア...   14:25   │
│  ● 映画の感想メモ...          13:00   │
│                                       │
├───────────────────────────────────────┤
│  🍃 Write    🌳 Read    🌱 Settings  │
└───────────────────────────────────────┘
```

### Readページ

```
┌───────────────────────────────────────┐
│  [すべて] [日記] [アイデア] [タスク]  │
│                                       │
│  タグ: [仕事] [趣味] [料理]  AND|OR   │
│                                       │
│  🔍 キーワード検索...                  │
│  📅 2026/04/01 〜 2026/04/17          │
│  ─────────────────────────────────    │
│                                       │
│  ── 2026年4月17日（金）──             │
│  ┌─────────────────────────────┐      │
│  │ 今日の買い物リスト           │      │
│  │ [日記] #料理                │      │
│  │                     14:30  │      │
│  └─────────────────────────────┘      │
│  ┌─────────────────────────────┐      │
│  │ 新しいアプリのアイデア       │      │
│  │ [アイデア] #仕事            │      │
│  │                     14:25  │      │
│  └─────────────────────────────┘      │
│                                       │
├───────────────────────────────────────┤
│  🍃 Write    🌳 Read    🌱 Settings  │
└───────────────────────────────────────┘
```

### Settingsページ

```
┌───────────────────────────────────────┐
│  メモ種類管理                          │
│  ─────────────────────────────────    │
│                                       │
│  名前: [        ] 色: [■] [追加]      │
│                                       │
│  ≡ ● 日記         [削除]             │
│  ≡ ● アイデア     [削除]             │
│  ≡ ● タスク       [削除]             │
│  ≡ ● 感想         [削除]             │
│    ● 未分類                           │
│                                       │
│  ─────────────────────────────────    │
│  デフォルト種類                        │
│  ○ 最後に使った種類                   │
│  ● 固定: [日記 ▼]                    │
│                                       │
├───────────────────────────────────────┤
│  🍃 Write    🌳 Read    🌱 Settings  │
└───────────────────────────────────────┘
```
