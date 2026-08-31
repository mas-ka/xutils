# CALQ - X-ray Transmission & Ion Chamber Gas Optimizer

**CALQ** は、X線実験・XAFS測定における物質の線吸収係数・質量吸収係数・X線透過率の計算、およびイオンチャンバー（$I_0, I$ 検出器）の充填ガス混合比と吸収率（最適透過力）の設計を支援するWebアプリケーションです。

インストールの必要がなく、Webブラウザ上で動作します。

---

## 1. 特長

1. **X線透過率・吸収係数計算 (Transmission Calculation)**:
   - 元素記号または化学式、密度 [g/cm³]、試料厚さ [μm または mm] を指定し、任意のエックス線エネルギー [eV] における線吸収係数 $\mu$ [cm⁻¹]、質量吸収係数 $\mu/\rho$ [cm²/g]、透過率 $T = I/I_0 = \exp(-\mu t)$、および吸収量 $\Delta\mu t$ を計算。
2. **イオンチャンバー（IC）ガス最適化 (Ion Chamber Gas Optimizer)**:
   - 入射強度モニター（$I_0$ 検出器: 吸収率 10〜15% 推奨）および透過強度モニター（$I$ 検出器: 吸収率 70〜90% 推奨）について、電極長 $L$ [cm] と不活性ガス（He, N₂, Ar, Kr, Xe 等）の混合比を最適化。
3. **高精度な散乱・吸収断面積データベース**:
   - Elam et al. (2002) 等の標準原子断面積データテーブルに基づく正確な計算。
4. **クライアント完結動作**:
   - ブラウザ上で瞬時に結果が出力されます。

---

## 2. 画面構成と基本操作

### 1. 透過率計算 (Transmission)
- 入力欄に化学式（例: `Fe2O3`, `SiO2`, `Pt`）、密度 [g/cm³]、厚さを入力します。
- 対象エネルギー [eV] を指定すると、透過率および吸収係数が表示されます。

### 2. イオンチャンバー設定 (Ion Chamber Optimization)
- 測定エネルギーおよび検出器長（電極長）を入力します。
- ターゲットとする吸収率（例: $I_0$ 用に 15%、$I$ 用に 70%）に対して、最適なガス混合比（例: N₂/Ar 混合など）を自動算出・調整します。

---

## 3. ファイル構成

```text
calq/
├── index.html              # メイン画面 (Vuetify 3 構成)
├── calq.js                 # コアロジック (断面積補間・吸収率計算・UI管理)
├── help.html               # 操作ガイド ＆ リファレンス (単体閲覧・ドロワー共用)
├── LICENSE                 # MIT License 許諾条文
└── README.md               # 本ドキュメント
```

---

## 4. 動作環境・ライセンス

- **対応ブラウザ**: Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari（最新版推奨）
- **ソフトウェアライセンス**: MIT License（詳細は [LICENSE](file:///d:/workspace/SAGA-LS/xutils/calq/LICENSE) を参照）
- **著作権**: Copyright (c) 2024-present KAWAMOTO masahide
- **参考文献**:
  - W.T. Elam, B.D. Ravel, J.R. Sieber, *Radiat. Phys. Chem.* **63**, 121-128 (2002).
