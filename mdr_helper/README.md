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

## 3. 実装済み機能

1. **メニューバー ＆ アクション**:
   - **ファイル**: 📂 ファイルを開く (YAML/JSON), 💾 YAML保存 (`metadata.yml`), 📄 JSON保存 (`metadata.json`), 🗑️ 新規作成
   - **編集**: 📋 MDR登録用サマリーコピー, 🧪 テストサンプル投入
   - **ヘルプ**: ℹ️ MDR XAFS DB 仕様案内, 📌 バージョン情報
2. **ドラッグ＆ドロップ（D&D）対応**:
   - 画面全体への `.yml` / `.yaml` / `.json` ファイルのドロップに対応（ドロップオーバーレイ表示）。
3. **衝突（コンフリクト）判定＆一括マージダイアログ**:
   - 読込ファイルのKeyを自動走査し、既存値と異なる項目（空値による上書き削除を含む）を検出。
   - テーブル表示: 日本語項目名、重要度バッジ（`[必須]` / `[推奨]` / `[任意]`）、平坦化Key、既存値、読込値を対比表示。
   - 操作ボタン順序: 直感的な空間対応に合わせ **左:「維持（既存優先）」/ 右:「上書き（ファイル優先）」** で統一。
   - 一括操作（「すべて維持」「すべて上書き」）および行ごとの個別切替が可能。
   - スキーマ定義順の自動整列（Pretty-print）を常時適用。
4. **MDR Web登録フォーム支援**:
   - MDR登録時に必要な基本項目サマリーをクリップボードにワンクリックコピー。

---

## 4. ファイル構成と役割

| ファイル | 役割・内容 |
| :--- | :--- |
| **`index.html`** | メイン画面（Vuetify 3 構成。メニューバー、Key-Value入力、必須/推奨チップス、衝突モーダル、YAMLプレビュー） |
| **`app.js`** | アプリケーションロジック（パスパーサー、サジェスト、ロード＆衝突マージ、ファイルエクスポート、自動整列） |
| **`schema_dictionary.js`** | JXS共通仕様（20230203版）のスキーマ辞書（全Key、型、3段階レベル、Enum、日本語説明、例） |
| **`references/`** | JXS仕様書、MDR登録手順書、実測データサンプル、および動作確認用テストYAML一式 |
| ├─ `test_sample_small.yml` | 最小必須項目（`facility`, `sample`, `measurement`）のテストYAML |
| ├─ `test_facility_template.yml` | 施設・光学系パラメータのみの部分マージ確認用YAML |
| ├─ `test_multi_edges.yml` | 複数吸収端（`edges[0]`, `edges[1]`）の配列追加確認用YAML |
| └─ `test_empty_and_conflicts.yml` | 空値上書き（削除）・値更新・新規追加が混在する複合テストYAML |

---

## 5. 動作環境・起動方法

Node.js や Python などのローカルサーバー環境は不要です。

- **直接起動**: [index.html](file:///d:/workspace/SAGA-LS/xutils/mdr_helper/index.html) をブラウザでダブルクリックして開く（`file:///` プロトコル対応）。
- **IDE環境**: Antigravity IDE の Live Browser 拡張機能等でプレビュー起動。
