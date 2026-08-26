# MDR XAFS Metadata Helper (`mdr_helper`)

物質・材料研究機構（NIMS）が運営する「[MDR XAFS DB](https://mdr.nims.go.jp/collections/qz20st57x)」および日本XAFS研究会（JXS）「XAFSメタデータ共通仕様（20230203リリース版）」に準拠したメタデータの生成・閲覧・編集・保存を支援する軽量Webツールです。

---

## 1. 設計思想と基本アーキテクチャ

1. **責務の分離（Separation of Concerns）**:
   - `.dat` ファイルからの自動抽出やスペクトルプロット生成などの重たい処理は本体から分離（別ツールで実施）。
   - 本ツールは **「YAMLメタデータのロード・マージ・編集・保存に特化した軽量エディタ」** としてシンプルに設計。
2. **極限までシンプルな2ペインUI**:
   - 複雑な多段フォームや巨大なツリーは排除し、**「平坦化Key指定入力コンソール（左） ＋ 構文ハイライト付きリアルタイムYAMLプレビュー（右）」** を採用。
   - スキーマの追加や `@local` 独自パラメータにもUIの改修なしで完全追従可能。

---

## 2. 確定仕様・設計ルール

### ① 平坦化Keyの記法
- **記法ルール**: `@category@sub[index].key` または `@category@sub[index]@key`
- **例**:
  - `@facility@name`
  - `@measurement@edges[0].element`
  - `@measurement@detectors[0].hardware@applied_voltage`

### ② 重要度レベルの3段階区分
- **【必須 (Required)】** (11項目 / `deep-orange` 表示):
  - `@data_info@title`
  - `@data_info@data_depositor@name` / `@organization`
  - `@data_info@contact_name@name` / `@organization`
  - `@data_info@deposite_time@create_time`（選択時に現在日付を自動補完）
  - `@facility@name` / `@beamline`
  - `@sample@name`
  - `@measurement@edges[0].element` / `@edge`
- **【推奨 (Recommended)】** (12項目 / `teal` 表示):
  - `@data_info@license` (MDR推奨: `CC BY-NC-SA 4.0`)
  - `@data_info@title_ja`
  - `@data_info@data_depositor@affiliation`
  - `@sample@chemical_formula`
  - `@sample@phase`
  - `@sample@condition@temperature@value` / `@unit`
  - `@files[0].file[0].name`
  - `@files[0].format`
  - `@measurement@measured_time@start_time`（選択時に現在日時を自動補完）
  - `@instrument@monochromator@detail@crystal_material` / `@crystal_plane`
- **【任意 (Optional)】** (`grey` 表示):
  - 上記以外の全項目（詳細寸法、アンプ時定数、`@local` 等）

### ③ 表記統一ルール
- `edge`: `["K-edge", "L1-edge", "L2-edge", "L3-edge", "M-edge"]`（`-edge` 付きに統一）
- `crystal_plane`: `["111", "311", "220", "511"]`（括弧なしに統一）
- `crystal_d_unit`: `["angstrom", "nm"]`（`angstrom` 標準）
- `phase`: `["solid", "powder", "film", "liquid", "gas"]`
- `license`: `CC BY-NC-SA 4.0` を先頭に配置

---

## 3. ファイル構成と役割

| ファイル | 役割・内容 |
| :--- | :--- |
| **`index.html`** | メイン画面（Vuetify 3 構成。Key-Value入力、必須/推奨チップス、設定済みリスト、YAMLプレビュー） |
| **`app.js`** | Vue 3 アプリケーションロジック（パスパーサー、サジェスト、リアルタイムYAML生成、日付自動補完） |
| **`schema_dictionary.js`** | JXS共通仕様（20230203版）のスキーマ辞書（全Key、型、3段階レベル、Enum、日本語説明、例） |
| **`references/`** | JXS仕様書、MDR登録手順書、実測データサンプル一式 |

---

## 4. 動作環境・起動方法

Node.js や Python などのローカルサーバー環境は不要です。

- **直接起動**: [index.html](file:///d:/workspace/SAGA-LS/xutils/mdr_helper/index.html) をブラウザでダブルクリックして開く（`file:///` プロトコル対応）。
- **IDE環境**: Antigravity IDE の Live Browser 拡張機能等でプレビュー起動。

---

## 5. 次フェーズの開発タスク（ロードマップ）

1. **YAMLファイルのロード ＆ マージ機能**:
   - 外部YAMLの取り込みと、既存データとの重複判定（上書き / スキップ）ダイアログ。
   - スナックバーによる取り込み結果通知。
2. **YAML / JSON ファイルのエクスポート（ダウンロード）機能**:
   - メモリ上のデータを `metadata.yml` または `metadata.json` としてローカル保存。
3. **MDR Web登録フォーム用テキストのコピー支援機能**:
   - MDR登録画面に必要な基本項目（タイトル、著者、元素、BL、ライセンス等）の一括/個別コピー。
