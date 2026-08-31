# RetroCog - Reciprocal Lattice & Crystal Diffraction Calculator

**RetroCog** は、結晶学における全7晶系（立方晶、正方晶、斜方晶、六方晶、三方晶、単斜晶、三斜晶）に対応し、実格子定数と逆格子定数の相互変換、結晶面指数 $(hkl)$ に対する面間隔 $d$ [Å]、ブラッグ回折角 $\theta_B$ [degree]、およびX線光子エネルギー $E$ [eV] の相互換算を支援するWebアプリケーションです。

インストールの必要がなく、Webブラウザ上で動作します。

---

## 1. 特長

1. **全7晶系（7 Crystal Systems）の格子計算に対応**:
   - 立方晶（Cubic）、正方晶（Tetragonal）、斜方晶（Orthorhombic）、六方晶（Hexagonal）、三方晶（Trigonal/Rhombohedral）、単斜晶（Monoclinic）、三斜晶（Triclinic）の格子定数（$a, b, c, \alpha, \beta, \gamma$）および単位胞体積 $V$ を計算。
2. **実空間（Direct）と逆空間（Reciprocal）の双方向完全連動**:
   - 実格子パラメータ（$a, b, c, \alpha, \beta, \gamma$）の変更に伴い、逆格子パラメータ（$a^*, b^*, c^*, \alpha^*, \beta^*, \gamma^*$）および逆格子体積 $V^*$ をリアルタイムに算出。逆空間からの入力にも対応。
3. **$(hkl)$ 面間隔・ブラッグ角・エネルギーの相互換算**:
   - 任意のミラー指数 $(hkl)$ に対して面間隔 $d_{hkl}$ を算出。
   - ブラッグの法則（$\lambda = 2d \sin\theta_B$、および $E = hc/\lambda \approx 12398.4 / \lambda$）に基づき、回折角 $\theta_B$ とX線エネルギー $E$ を相互換算。
4. **主要分光結晶・標準結晶のプリセット内蔵**:
   - Si, Ge, ダイアモンド等の主要半導体結晶パラメータをワンクリックで読み込み可能。

---

## 2. 画面構成と基本操作

### 1. 晶系・格子定数の設定 (Crystal System & Lattice)
- 晶系を選択し、実格子定数 $a, b, c$ [Å] および格子角 $\alpha, \beta, \gamma$ [°] を入力します。
- 逆格子パラメータおよび単位胞体積が自動更新されます。

### 2. 回折パラメータの計算 (Diffraction / Bragg Conversion)
- ミラー指数 $h, k, l$ を指定すると、面間隔 $d$ [Å] が算出されます。
- ブラッグ角 $\theta_B$ [°] または X線エネルギー $E$ [eV] のいずれか一方を入力すると、他方が即座に換算されます。

---

## 3. ファイル構成

```text
retrocog/
├── index.html              # メイン画面 (Vuetify 3 構成)
├── retrocog.js             # コアロジック (結晶幾何計算・逆格子変換・ブラッグ計算)
├── help.html               # 操作ガイド ＆ リファレンス (単体閲覧・カード共用)
├── LICENSE                 # MIT License 許諾条文
└── README.md               # 本ドキュメント
```

---

## 4. 動作環境・ライセンス

- **対応ブラウザ**: Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari（最新版推奨）
- **ソフトウェアライセンス**: MIT License（詳細は [LICENSE](file:///d:/workspace/SAGA-LS/xutils/retrocog/LICENSE) を参照）
- **著作権**: Copyright (c) 2024-present KAWAMOTO masahide
