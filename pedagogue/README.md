# Pedagogue (MDR XAFS Metadata Editor)

物質・材料研究機構（NIMS）が運営する「[MDR XAFS DB](https://mdr.nims.go.jp/collections/qz20st57x)」および日本XAFS研究会（JXS）「XAFSメタデータ共通仕様（20230203リリース版）」に準拠したメタデータの生成・閲覧・編集・保存を支援するWebアプリケーションです。

インストールの必要がなく、Webブラウザ上で動作します。

---

## 1. 特長

1. **2ペイン構成のエディタ**:
   - **左ペイン**: 項目（Key）と設定値（Value）を入力・適用する編集フォーム、および必須・推奨項目のToDoリスト。
   - **右ペイン**: JXS標準順序（`data_info` → `sample` → `facility` → `instrument` → `measurement` → `files` → `local`）へ自動整列される構文ハイライト付きリアルタイムYAMLプレビュー。
2. **シェル方式の Tab キー補完 ＆ インクリメンタル検索**:
   - Key入力欄で `@faci` と打って <kbd>Tab</kbd> を押すと共通階層（`@facility@`）まで自動補完。候補が1件に絞られた状態で <kbd>Tab</kbd> を押すとKey名全体が一発で確定します。
   - 「試料」「温度」「結晶」などの日本語や英字Key名によるリアルタイム絞り込み検索に対応。
3. **安全な取り込み・マージ ＆ 衝突解決ダイアログ**:
   - 画面へのドラッグ＆ドロップやファイル選択、クリップボード貼り付けから既存YAML/JSONデータを取り込み可能。
   - 既存データと値が異なる項目が存在する場合は、対比テーブル形式の「衝突解決ダイアログ」が表示され、項目ごとに維持・上書きを選択できます。
4. **仕様外Key（タイポ等）の検出**:
   - JXS仕様外のKeyが含まれている場合、トップバーに `[⚠️ 仕様外: ○件]` 警告バッジを表示。
   - 外部から取り込んだ独自拡張パラメータも破棄せず保持・編集可能。
5. **編集履歴（Undo/Redo）と誤破棄防止**:
   - 最大30件の編集履歴（Undo: `Ctrl+Z` / Redo: `Ctrl+Y`）。
   - 未保存の変更がある状態で新規作成（全クリア）を行う場合の確認ダイアログ。
6. **仕様リファレンス ＆ 操作ガイドの内蔵**:
   - 右サイドドロワーからJXS全73項目のスキーマ定義（型、必須/推奨区分、選択肢候補、説明、入力例）を即座に参照可能。
   - 一覧カードをクリックして入力フォームへ直接セットできます。
7. **クライアント完結動作**:
   - すべての処理はブラウザのJavaScript内で完結し、外部サーバーとの通信は行われません。

---

## 2. 画面構成と基本操作

### メタデータの編集手順
1. **項目の選択**:
   左上の `Key` 入力欄に文字を入力（日本語・英語対応）するか、<kbd>Tab</kbd> キーで補完して対象項目を選択します。右ペインのYAMLプレビュー行をクリックして直接選択することも可能です。
2. **設定値の入力**:
   `設定値（Value）` 欄に値を入力します。選択肢項目（Enum）はドロップダウンからの選択と自由入力の両方に対応し、日付・日時項目は「日時選択」ダイアログから指定できます。
3. **適用**:
   <kbd>Enter</kbd> キーまたは **「適用」** ボタンを押すと、右ペインのYAMLに即時反映されます。
4. **保存**:
   メニューバーの **「ファイル ＞ 💾 保存」** から `metadata.yml` または `metadata.json` としてダウンロード保存します。

---

## 3. 重要度レベル区分と主要仕様ルール

### 重要度区分
- **【必須 (Required)】** (11項目 / `deep-orange` 表示):
  - `@data_info@title`
  - `@data_info@data_depositor@name` / `@organization`
  - `@data_info@contact_name@name` / `@organization`
  - `@data_info@deposite_time@create_time`
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
  - `@measurement@measured_time@start_time`
  - `@instrument@monochromator@detail@crystal_material` / `@crystal_plane`
- **【任意 (Optional)】** (`grey` 表示):
  - 上記以外の全項目（詳細寸法、アンプ時定数、`@local` 独自パラメータ等）

### 表記統一ルール（JXS仕様準拠）
- **吸収端 (edge)**: `["K-edge", "L1-edge", "L2-edge", "L3-edge", "M-edge"]`（`-edge` 表記で統一）
- **分光結晶面 (crystal_plane)**: `["111", "311", "220", "511"]`（括弧なし表記で統一）
- **面間隔単位 (crystal_d_unit)**: `["angstrom", "nm"]`（`angstrom` 標準）
- **状態・相 (phase)**: `["solid", "powder", "film", "liquid", "gas"]`
- **二次利用ライセンス (license)**: MDR推奨値 `CC BY-NC-SA 4.0`

---

## 4. ショートカットキー一覧

| キー操作 | 動作・機能 |
| :--- | :--- |
| <kbd>Tab</kbd> (Key入力欄) | Key名の自動補完（階層・共通プレフィックス補完） |
| <kbd>Enter</kbd> (設定値入力欄) | 入力値をYAMLへ反映 |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | 元に戻す (Undo) |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> | やり直す (Redo) |
| プレビュー行クリック | 該当Keyを左ペインで直接選択 |

---

## 5. ファイル構成

```text
pedagogue/
├── index.html              # メインアプリケーション画面 (Vuetify 3 構成)
├── pedagogue.js            # コアロジック (状態管理・パーサー・マージ・補完・入出力)
├── schema_dictionary.js    # JXSメタデータ共通仕様スキーマ辞書 (全73項目メタ情報)
├── help.html               # 操作ガイド ＆ スキーマリファレンス (単体閲覧・ドロワー共用)
├── LICENSE                 # MIT License 許諾条文
└── README.md               # 本ドキュメント
```

---

## 6. 動作環境・利用方法

- **対応ブラウザ**: Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari（最新版推奨）
- **利用方法**: Webブラウザから直接アクセスしてご利用いただけます（インストール不要）。

---

## 7. バージョンと更新履歴

本ツールは日付ベース（CalVer）のバージョン管理を採用しており、GitHub Pages へのデプロイ時に最新コミット日付が自動設定されます。

- **メタデータ準拠仕様**: 日本XAFS研究会「XAFSメタデータ共通仕様（20230203リリース版）」
- **最新版**: `index.html` 左上メニュー「Pedagogue ＞ ℹ️ Pedagogue について」から確認できます。

---

## 8. ライセンス ＆ 謝辞

- **ソフトウェアライセンス**: MIT License（詳細は [LICENSE](file:///d:/workspace/SAGA-LS/xutils/pedagogue/LICENSE) を参照）
- **著作権**: Copyright (c) 2024-present KAWAMOTO masahide
- **関連リンク**:
  - [NIMS MDR XAFS Database](https://mdr.nims.go.jp/collections/qz20st57x)
  - [日本XAFS研究会 公式サイト (XAFS DB仕様)](https://www.jxafs.org/xafs-database/)