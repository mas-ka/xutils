# CALQ - Q-range Calculator for SAXS/WAXS

**CALQ** は、X線小角散乱（SAXS）および広角散乱（WAXS）測定における散乱ベクトルの測定範囲（Q-range）を計算・見積もりするためのWebアプリケーションです。

インストールの必要がなく、Webブラウザ上で動作します。

---

## 1. 特長

1. **測定幾何配置に応じた測定可能範囲マトリクス一覧**:
   - 入射X線条件（波長/エネルギー）、検出器受光半径、試料－検出器間距離（Path length）、ダイレクトビームストップ径（Beam stop diameter）の組み合わせに応じた測定下限・上限をテーブル形式で一覧表示。
   - 距離やストップ径の数値は表上で直接編集可能。
2. **多彩な散乱指標（q, s, 2θ, d）への表示切り替え**:
   - 散乱ベクトル（$q$）、逆空間周波数（$s$）、散乱角（$2\theta$）、実空間格子面間隔（$d$）の中から、目的に応じた指標を選択して表示・単位換算（nm, Å, /nm, /Å）が可能。
3. **クライアント完結動作**:
   - すべての処理はブラウザのJavaScript内で完結し、外部サーバーとの通信は行われません。

---

## 2. 画面構成と基本操作

### 1. X-ray（入射X線設定）
- 入射X線の波長 [Å] またはエネルギー [eV] を設定します。

### 2. Detector（検出器設定）
- 検出器の有効受光領域の半径（Radius [mm]）を入力します（全周積分の場合は短辺半径、半周積分の場合は中心からの最大長）。

### 3. Range（測定可能範囲マトリクス）
- **Path length [mm]（縦軸）**: 試料－検出器間距離。数値を直接編集可能。
- **Beam stop diameter [mm]（横軸）**: ダイレクトビームストップ直径。数値を直接編集可能。
- **Notation（表示切替）**: 表示する指標（$2\theta$, $d$, $q$, $s$）をドロップダウンから切り替えます。

---

## 3. ファイル構成

```text
calq/
├── index.html              # メイン画面 (Vuetify 3 構成)
├── calq.js                 # コアロジック (Q-range計算・UI状態管理)
├── help.html               # 操作ガイド ＆ 仕様リファレンス (単体閲覧・ドロワー共用)
├── LICENSE                 # MIT License 許諾条文
└── README.md               # 本ドキュメント
```

---

## 4. 動作環境・ライセンス

- **対応ブラウザ**: Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari（最新版推奨）
- **ソフトウェアライセンス**: MIT License（詳細は [LICENSE](file:///d:/workspace/SAGA-LS/xutils/calq/LICENSE) を参照）
- **著作権**: Copyright (c) 2024-present KAWAMOTO masahide
