# P4XMS - Parameters for XAS Measurement in Step Scan

**P4XMS** は、Stepスキャン方式によるXAFS測定において、分光結晶、測定対象元素と吸収端、および複数ブロックからなる測定パラメータを設計・設定するためのWebアプリケーションです。

設定した測定パラメータは、SAGA-LS 形式の Agenda ファイル（`.agenda`）として保存および読み込みが可能です。

インストールの必要がなく、Webブラウザ上で動作します。

---

## 1. 特長

1. **複数ブロック測定シーケンスの柔軟な設計**:
   - XANES領域やEXAFS領域など、測定領域ごとに境界エネルギー、データ点補間（Step幅 [eV] または Division分割数）、露光時間 [sec.] を個別に設定可能（最大12ブロック）。
   - ブロックの追加、削除、結合、分割に対応し、元素・吸収端に応じた標準ブロックも自動展開。
2. **推定測定時間のリアルタイム算出**:
   - 各ブロックの露光時間合計に加え、分光器主軸の移動速度や通信オーバーヘッド時間を加味した総所要時間（~ min.）および総測定点数（Total pts）をリアルタイムに集計。
   - 後続ブロックの露光時間を一括連動して増減し、所要時間を確認しながらのパラメータ調整が可能。
3. **SAGA-LS Agenda ファイルの入出力**:
   - `.agenda` ファイルの保存・読み込み（ドラッグ＆ドロップ対応）。
4. **クライアント完結動作**:
   - すべての処理はブラウザのJavaScript内で完結し、外部サーバーとの通信は行われません。

---

## 2. 画面構成と基本操作

### 1. Monochrometer（分光器設定）
- 分光結晶（Si(111), Si(311), Si(220), Other...）を選択し、主軸移動速度 [°/sec.] やオーバーヘッド時間 [sec.] を設定します。

### 2. Elements（元素・吸収端設定）
- 測定対象元素と吸収端（K, L1〜L3, M）を選択します。

### 3. Parameters（スキャンブロック設定）
- **BOUNDARY ENERGY**: 境界エネルギー（絶対値 [eV]、または相対値 $\Delta E_0$ / 波数 $k$）を設定。メニューから追加・削除・結合・分割を実行。
- **INTERPOLATION**: ブロック内の刻み幅（Step [eV]）または分割数（Division）を設定。
- **EXPOSURE**: 測定点ごとの露光時間 [sec.] を設定。

### 4. File（ファイル保存 ＆ 読み込み）
- ツールバーから `.agenda` ファイルとして保存または読み込みを行います。

---

## 3. ファイル構成

```text
p4xms/
├── index.html              # メイン画面 (Vuetify 3 構成)
├── p4xms.js                # コアロジック (ブロック計算・時間試算・Agenda入出力)
├── help.html               # 操作ガイド ＆ 仕様リファレンス (単体閲覧・カード共用)
├── LICENSE                 # MIT License 許諾条文
└── README.md               # 本ドキュメント
```

---

## 4. 動作環境・ライセンス

- **対応ブラウザ**: Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari（最新版推奨）
- **ソフトウェアライセンス**: MIT License（詳細は [LICENSE](file:///d:/workspace/SAGA-LS/xutils/p4xms/LICENSE) を参照）
- **著作権**: Copyright (c) 2024-present KAWAMOTO masahide
