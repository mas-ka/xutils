# xutils - X-ray Analysis & Synchrotron Experiment Utilities

**xutils** は、放射光施設やラボ光源における X線吸収微細構造（XAFS）測定、X線散乱（SAXS）実験、およびメタデータ管理を支援するブラウザ完結型のWebユーティリティ集です。

インストールの必要がなく、モダンなWebブラウザ上で即座に動作します。

---

## 収録ツール一覧

| ツール名 | カテゴリ | 概要 | リンク |
| :--- | :--- | :--- | :--- |
| **[samxam](file:///d:/workspace/SAGA-LS/xutils/samxam/README.md)** | XAFS / 参照 | 全元素の吸収端・蛍光X線・Auger電子エネルギー参照 ＆ 標準XAFSスペクトル閲覧 | [samxam/index.html](file:///d:/workspace/SAGA-LS/xutils/samxam/index.html) |
| **[P4XMS](file:///d:/workspace/SAGA-LS/xutils/p4xms/README.md)** | XAFS / 測定設計 | ステップスキャン（Step Scan）XAFS測定パラメータ設計 ＆ PF新フォーマット出力 | [p4xms/index.html](file:///d:/workspace/SAGA-LS/xutils/p4xms/index.html) |
| **[P4XMQ](file:///d:/workspace/SAGA-LS/xutils/p4xmq/README.md)** | XAFS / 測定設計 | クイックスキャン（QXAFS）測定パラメータ設計 ＆ PF新フォーマット出力 | [p4xmq/index.html](file:///d:/workspace/SAGA-LS/xutils/p4xmq/index.html) |
| **[RetroCog](file:///d:/workspace/SAGA-LS/xutils/retrocog/README.md)** | 結晶・回折 / 計算 | 全7晶系対応の逆格子・実格子定数計算、面間隔・ブラッグ角・エネルギー相互換算 | [retrocog/index.html](file:///d:/workspace/SAGA-LS/xutils/retrocog/index.html) |
| **[Epiphany](file:///d:/workspace/SAGA-LS/xutils/epiphany/README.md)** | XAFS / 解析 | 蛍光XAFS 2次元スペクトログラム（TIFF）のROI事後設定 ＆ 9809形式エクスポート | [epiphany/index.html](file:///d:/workspace/SAGA-LS/xutils/epiphany/index.html) |
| **[calq](file:///d:/workspace/SAGA-LS/xutils/calq/README.md)** | 透過・検出器 / 計算 | 物質のX線吸収係数・透過率計算、イオンチャンバー（IC）ガス最適化・透過力算出 | [calq/index.html](file:///d:/workspace/SAGA-LS/xutils/calq/index.html) |
| **[Pedagogue](file:///d:/workspace/SAGA-LS/xutils/pedagogue/README.md)** | メタデータ / 編集 | NIMS MDR XAFS DB ＆ 日本XAFS研究会（JXS）標準メタデータエディタ | [pedagogue/index.html](file:///d:/workspace/SAGA-LS/xutils/pedagogue/index.html) |

---

## 主な特長

1. **ゼロインストール・ブラウザ完結**:
   - すべてのツールはクライアントサイド（HTML5, JavaScript, Vue 3, Vuetify 3）で動作します。
   - サーバーへのデータ送信は一切行われず、機密データや測定結果も安全に扱えます。
2. **統一されたUI・操作体系**:
   - 各ツールはマテリアルデザイン（Vuetify 3）に準拠。
   - 内蔵ヘルプドロワー・カードから操作マニュアルやデータ構造仕様を即座に参照可能。

---

## ディレクトリ構成

```text
xutils/
├── index.html              # 統合ポータル画面 (iframe または タブ切り替え)
├── welcome.html            # ポータルウェルカム・ツール紹介画面
├── samxam/                 # 元素別エネルギー・スペクトル参照ツール
├── p4xms/                  # ステップスキャンXAFS測定設計ツール
├── p4xmq/                  # QXAFS測定設計ツール
├── retrocog/               # 結晶格子・逆格子・回折角計算ツール
├── epiphany/               # スペクトログラムROI再計算ツール
├── calq/                   # X線透過率・検出器ガス最適化ツール
└── pedagogue/              # JXS/MDR XAFSメタデータエディタ
```

---

## 動作環境

- **対応ブラウザ**: Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari（最新版推奨）
- **依存ライブラリ**: Vue 3, Vuetify 3, Plotly.js, UTIF.js, sprintf-js 等（各ツール配下の `LICENSE` およびオープンソースライセンス表示を参照）

---

## ライセンス

本リポジトリに含まれるソフトウェアは **MIT License** のもとで公開されています。
詳細は各ツール配下の `LICENSE` ファイルをご参照ください。

- **Copyright (c) 2024-present KAWAMOTO masahide (SAGA-LS)**
