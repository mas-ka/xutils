# P4XMQ - Parameters for XAS Measurement in Quick Scan

**P4XMQ** は、Quickスキャン方式によるXAFS測定において、分光結晶、測定対象元素と吸収端、およびスキャンパラメータを設計・設定するためのWebアプリケーションです。

設定した測定パラメータは、SAGA-LS 形式の Agenda ファイル（`.agenda`）として保存および読み込みが可能です。

インストールの必要がなく、Webブラウザ上で動作します。

---

## 1. 特長

1. **Quickスキャン用パラメータの自動連動設計**:
   - スキャン開始エネルギー（Begin [eV] / 相対値 $\Delta E_0$ [eV]）、終了エネルギー（End [eV] / 波数 $K$ [Å⁻¹]）が相互連動。
   - 吸収端近傍のステップ幅（Step [eV]）から推定総測定点数（Total points）を算出。
   - 全体露光時間（Exposure [sec.]）からモノクロメータ主軸の回転速度 [°/sec.] を自動算出。
2. **元素・吸収端選択に伴うブラッグ角計算**:
   - 測定対象元素および吸収端（K, L1, L2, L3, M）に応じた吸収端エネルギー $E_0$ およびブラッグ角 $\theta$ を表示。
   - 選択中の分光結晶で到達不能な吸収端の自動無効化（グレーアウト表示）。
3. **SAGA-LS Agenda ファイルの入出力**:
   - `.agenda` ファイルの保存・読み込み（ドラッグ＆ドロップ対応）。
4. **クライアント完結動作**:
   - すべての処理はブラウザのJavaScript内で完結し、外部サーバーとの通信は行われません。

---

## 2. 画面構成と基本操作

### 1. Monochrometer（分光器設定）
- 分光結晶（Si(111), Si(311), Si(220), Other...）を選択し、面間隔 $d$ [Å] を設定します。

### 2. Elements（元素・吸収端設定）
- 測定対象元素と吸収端（K, L1〜L3, M）を選択します。

### 3. Parameters（スキャンパラメータ設定）
- **Begin [eV] / $\Delta E_0$ [eV]**: 開始エネルギーを設定。
- **End [eV] / $K$ [Å⁻¹]**: 終了エネルギーを設定。
- **Step [eV]**: 吸収端近傍でのステップ幅を設定（総測定点数が連動表示）。
- **Exposure [sec.]**: スキャン全体の露光時間を設定（主軸回転速度が連動表示）。

### 4. File（ファイル保存 ＆ 読み込み）
- ツールバーから `.agenda` ファイルとして保存または読み込みを行います。

---

## 3. ファイル構成

```text
p4xmq/
├── index.html              # メイン画面 (Vuetify 3 構成)
├── p4xmq.js                # コアロジック (Quickスキャンパラメータ計算・Agenda入出力)
├── help.html               # 操作ガイド ＆ 仕様リファレンス (単体閲覧・カード共用)
├── LICENSE                 # MIT License 許諾条文
└── README.md               # 本ドキュメント
```

---

## 4. 動作環境・ライセンス

- **対応ブラウザ**: Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari（最新版推奨）
- **ソフトウェアライセンス**: MIT License（詳細は [LICENSE](file:///d:/workspace/SAGA-LS/xutils/p4xmq/LICENSE) を参照）
- **著作権**: Copyright (c) 2024-present KAWAMOTO masahide
