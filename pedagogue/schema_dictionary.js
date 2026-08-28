/**
 * JXS XAFS Metadata Schema Dictionary (20230203 Release)
 * 日本XAFS研究会 XAFSメタデータ共通仕様 スキーマ辞書定義
 * 重要度レベル:
 *   - 'required'    : 必須 (MDRシステム / JXS仕様上必須)
 *   - 'recommended' : 推奨 (検索性・データ再利用・手順書推奨)
 *   - 'optional'    : 任意 (詳細ハードウェア・環境・独自設定等)
 */
window.SCHEMA_DICTIONARY = [
  // -------------------------------------------------------------
  // 1. data_info (データ・登録基本情報)
  // -------------------------------------------------------------
  {
    path: "@data_info@title",
    name_ja: "データセット題名 (英語)",
    name_en: "title of work (english)",
    category: "data_info",
    type: "text",
    level: "required",
    required: true,
    example: "XAFS measurement of Cu",
    description: "課題名や測定の目的など（英語表記）。MDR検索の主タイトル。"
  },
  {
    path: "@data_info@title_ja",
    name_ja: "データセット題名 (日本語)",
    name_en: "title of work (japanese)",
    category: "data_info",
    type: "text",
    level: "recommended",
    required: false,
    example: "CuのXAFS測定",
    description: "日本語でのデータセットタイトル（国内検索用）。"
  },
  {
    path: "@data_info@data_depositor@organization",
    name_ja: "データ登録者の組織",
    name_en: "organization of data depositor",
    category: "data_info",
    type: "string",
    level: "required",
    required: true,
    example: "Ritsumeikan",
    description: "登録者の大学・研究所・企業名などの名称。"
  },
  {
    path: "@data_info@data_depositor@name",
    name_ja: "データ登録者の氏名",
    name_en: "name of data depositor",
    category: "data_info",
    type: "string",
    level: "required",
    required: true,
    example: "Taro KEK",
    description: "データ登録者の氏名（ローマ字表記推奨）。"
  },
  {
    path: "@data_info@data_depositor@affiliation",
    name_ja: "データ登録者の所属部署",
    name_en: "affiliation of data depositor",
    category: "data_info",
    type: "string",
    level: "recommended",
    required: false,
    example: "Institute for Catalysis",
    description: "学部、研究科、部局など。"
  },
  {
    path: "@data_info@data_depositor@role",
    name_ja: "データ登録者の役割",
    name_en: "role of data depositor",
    category: "data_info",
    type: "string",
    level: "optional",
    required: false,
    enum: ["analyst", "manager", "director"],
    example: "analyst",
    description: "登録者の役割区分。"
  },
  {
    path: "@data_info@contact_name@organization",
    name_ja: "データ責任者（窓口）の組織",
    name_en: "organization of contact person",
    category: "data_info",
    type: "string",
    level: "required",
    required: true,
    example: "Ritsumeikan",
    description: "問い合わせ対応可能な組織名称。"
  },
  {
    path: "@data_info@contact_name@name",
    name_ja: "データ責任者（窓口）の氏名",
    name_en: "contact name",
    category: "data_info",
    type: "string",
    level: "required",
    required: true,
    example: "Jiro Hokudai",
    description: "データ責任者の氏名（ローマ字表記推奨）。"
  },
  {
    path: "@data_info@contact_name@affiliation",
    name_ja: "データ責任者の所属部署",
    name_en: "affiliation of contact person",
    category: "data_info",
    type: "string",
    level: "optional",
    required: false,
    example: "Ritsumeikan SR center",
    description: "責任者の所属センターや研究室。"
  },
  {
    path: "@data_info@contact_name@role",
    name_ja: "データ責任者の役割",
    name_en: "role of contact person",
    category: "data_info",
    type: "string",
    level: "optional",
    required: false,
    enum: ["contractor", "principal investigator", "head of the institution", "responsible"],
    example: "responsible",
    description: "責任者の役割区分。"
  },
  {
    path: "@data_info@deposite_time@create_time",
    name_ja: "メタデータ生成日時",
    name_en: "create time of data deposite",
    category: "data_info",
    type: "date",
    level: "required",
    required: true,
    example: "2023-02-03",
    description: "メタデータの生成日時 (YYYY-MM-DD または YYYY-MM-DD HH:mm:ss)。"
  },
  {
    path: "@data_info@deposite_time@update_time",
    name_ja: "メタデータ最終更新日時",
    name_en: "update time of data deposite",
    category: "data_info",
    type: "date",
    level: "optional",
    required: false,
    example: "2023-02-04",
    description: "メタデータの更新日時。"
  },
  {
    path: "@data_info@access_rights",
    name_ja: "アクセス権限",
    name_en: "access rights",
    category: "data_info",
    type: "string",
    level: "optional",
    required: false,
    enum: ["open", "close"],
    example: "open",
    description: "公開権限。未入力時は close 扱い。"
  },
  {
    path: "@data_info@license",
    name_ja: "二次利用ライセンス",
    name_en: "license",
    category: "data_info",
    type: "string",
    level: "recommended",
    required: false,
    enum: ["CC BY-NC-SA 4.0", "CC BY-NC-SA", "CC BY 4.0", "CC BY", "CC0"],
    example: "CC BY-NC-SA 4.0",
    description: "データセットの二次利用ライセンス (MDR推奨: CC BY-NC-SA 4.0)。"
  },
  {
    path: "@data_info@identifier@pid",
    name_ja: "データセット固有PID番号",
    name_en: "Persistent ID",
    category: "data_info",
    type: "string",
    level: "optional",
    required: false,
    example: "spring8.7e55cc2d-...",
    description: "リポジトリ登録固有ID。"
  },
  {
    path: "@data_info@identifier@proposal_number",
    name_ja: "実験課題番号",
    name_en: "proposal number",
    category: "data_info",
    type: "string",
    level: "optional",
    required: false,
    example: "2021Z000",
    description: "施設固有のビームタイム採択課題番号。"
  },
  {
    path: "@data_info@comment",
    name_ja: "コメント・自由記述",
    name_en: "comment",
    category: "data_info",
    type: "string",
    level: "optional",
    required: false,
    example: "metadata test",
    description: "データセットに関する補足・コメント。"
  },
  {
    path: "@data_info@metadata_format@version",
    name_ja: "メタデータフォーマットバージョン",
    name_en: "metadata format version",
    category: "data_info",
    type: "string",
    level: "optional",
    required: false,
    example: "XAFS.20230203",
    description: "JXS仕様バージョン。"
  },

  // -------------------------------------------------------------
  // 2. facility (測定施設・光源情報)
  // -------------------------------------------------------------
  {
    path: "@facility@name",
    name_ja: "放射光施設名",
    name_en: "facility name",
    category: "facility",
    type: "string",
    level: "required",
    required: true,
    enum: ["SAGA-LS", "SPring-8", "Photon Factory", "PF-AR", "AichiSR", "Ritsumeikan", "NanoTerasu", "UVSOR"],
    example: "SPring-8",
    description: "放射光施設の名称。"
  },
  {
    path: "@facility@beamline",
    name_ja: "使用ビームライン名",
    name_en: "beamline",
    category: "facility",
    type: "string",
    level: "required",
    required: true,
    example: "BL14B2",
    description: "測定を実施したビームライン名。"
  },
  {
    path: "@facility@ring@energy",
    name_ja: "加速器ビームエネルギー",
    name_en: "beam energy",
    category: "facility",
    type: "double",
    level: "optional",
    required: false,
    example: 8.0,
    description: "蓄積リングの電子エネルギー。"
  },
  {
    path: "@facility@ring@energy_unit",
    name_ja: "ビームエネルギー単位",
    name_en: "beam energy unit",
    category: "facility",
    type: "string",
    level: "optional",
    required: false,
    enum: ["GeV", "MeV"],
    example: "GeV",
    description: "ビームエネルギーの物理単位。"
  },
  {
    path: "@facility@ring@start_current",
    name_ja: "蓄積リング電流 (開始時)",
    name_en: "beam current (start)",
    category: "facility",
    type: "double",
    level: "optional",
    required: false,
    example: 99.9,
    description: "測定開始時のリング蓄積電流値。"
  },
  {
    path: "@facility@ring@start_current_unit",
    name_ja: "蓄積リング電流単位 (開始時)",
    name_en: "beam current unit (start)",
    category: "facility",
    type: "string",
    level: "optional",
    required: false,
    enum: ["mA", "A"],
    example: "mA",
    description: "蓄積電流の単位。"
  },
  {
    path: "@facility@ring@end_current",
    name_ja: "蓄積リング電流 (終了時)",
    name_en: "beam current (end)",
    category: "facility",
    type: "double",
    level: "optional",
    required: false,
    example: 99.8,
    description: "測定終了時のリング蓄積電流値。"
  },
  {
    path: "@facility@ring@end_current_unit",
    name_ja: "蓄積リング電流単位 (終了時)",
    name_en: "beam current unit (end)",
    category: "facility",
    type: "string",
    level: "optional",
    required: false,
    enum: ["mA", "A"],
    example: "mA",
    description: "蓄積電流の単位。"
  },
  {
    path: "@facility@ring@filling_pattern",
    name_ja: "運転フィリングパターン",
    name_en: "filling pattern",
    category: "facility",
    type: "string",
    level: "optional",
    required: false,
    example: "4 bunch train X 84",
    description: "リングのバンチ充填パターン。"
  },
  {
    path: "@facility@light_source@type",
    name_ja: "挿入光源・偏光の種類",
    name_en: "light source type",
    category: "facility",
    type: "string",
    level: "optional",
    required: false,
    enum: ["BM", "U", "W"],
    example: "BM",
    description: "BM (偏向電磁石), U (アンジュレータ), W (ウィグラー)。"
  },
  {
    path: "@facility@light_source@polarization",
    name_ja: "光源の偏光状態",
    name_en: "polarization of light source",
    category: "facility",
    type: "string",
    level: "optional",
    required: false,
    enum: ["linear", "circular", "horizontal", "vertical"],
    example: "linear",
    description: "放射光の偏光特性。"
  },

  // -------------------------------------------------------------
  // 3. files (データファイル仕様)
  // -------------------------------------------------------------
  {
    path: "@files[0].file[0].name",
    name_ja: "測定データファイル名",
    name_en: "filename",
    category: "files",
    type: "string",
    level: "recommended",
    required: false,
    example: "sample.dat",
    description: "登録する実データファイル名 (データ再利用・解析に推奨)。"
  },
  {
    path: "@files[0].description",
    name_ja: "ファイル性質分類",
    name_en: "description of file",
    category: "files",
    type: "string",
    level: "optional",
    required: false,
    enum: ["experimental", "calibrated", "corrected", "thumbnail"],
    example: "experimental",
    description: "ファイルの役割。"
  },
  {
    path: "@files[0].extension",
    name_ja: "ファイル拡張子",
    name_en: "file extension",
    category: "files",
    type: "string",
    level: "optional",
    required: false,
    example: "dat",
    description: "ファイルの拡張子。"
  },
  {
    path: "@files[0].format",
    name_ja: "物理フォーマット名",
    name_en: "file format",
    category: "files",
    type: "string",
    level: "recommended",
    required: false,
    example: "9809",
    description: "データ形式（9809, XDI 等。パースに推奨）。"
  },
  {
    path: "@files[0].headerlines",
    name_ja: "ヘッダー行数",
    name_en: "headerlines count",
    category: "files",
    type: "integer",
    level: "optional",
    required: false,
    example: 17,
    description: "実データ行の直前までのヘッダー行数。"
  },
  {
    path: "@files[0].columns[0].name",
    name_ja: "第1列 物理量名",
    name_en: "1st column name",
    category: "files",
    type: "string",
    level: "optional",
    required: false,
    enum: ["energy", "deg", "obs_deg", "dwell", "I0", "I", "I1", "I2", "If"],
    example: "energy",
    description: "データ第1列の意味（energy, deg 等）。"
  },
  {
    path: "@files[0].columns[0].unit",
    name_ja: "第1列 単位",
    name_en: "1st column unit",
    category: "files",
    type: "string",
    level: "optional",
    required: false,
    enum: ["eV", "deg", "sec", "count", "a.u."],
    example: "eV",
    description: "第1列の単位。"
  },
  {
    path: "@files[0].columns[1].name",
    name_ja: "第2列 物理量名",
    name_en: "2nd column name",
    category: "files",
    type: "string",
    level: "optional",
    required: false,
    enum: ["I0", "I", "I1", "I2", "If", "dwell"],
    example: "I0",
    description: "データ第2列の意味。"
  },
  {
    path: "@files[0].columns[1].unit",
    name_ja: "第2列 単位",
    name_en: "2nd column unit",
    category: "files",
    type: "string",
    level: "optional",
    required: false,
    enum: ["count", "a.u.", "V", "pA"],
    example: "count",
    description: "第2列の単位。"
  },

  // -------------------------------------------------------------
  // 4. instrument (光学系・光学素子)
  // -------------------------------------------------------------
  {
    path: "@instrument@arrangement",
    name_ja: "光学素子空間配置順",
    name_en: "arrange of instrument",
    category: "instrument",
    type: "string",
    level: "optional",
    required: false,
    example: "S1//M1//DCM//S2",
    description: "上流から下流への光学素子配置を // で連結した文字列。"
  },
  {
    path: "@instrument@monochromator@name",
    name_ja: "分光器名称",
    name_en: "monochromator name",
    category: "instrument",
    type: "string",
    level: "optional",
    required: false,
    example: "DCM",
    description: "分光器の機器名称（DCM等）。"
  },
  {
    path: "@instrument@monochromator@scan_mode",
    name_ja: "分光器スキャン駆動モード",
    name_en: "monochromator scan mode",
    category: "instrument",
    type: "string",
    level: "optional",
    required: false,
    enum: ["step scan", "quick scan", "continuous scan"],
    example: "quick scan",
    description: "分光器の駆動方式。"
  },
  {
    path: "@instrument@monochromator@detail@crystal_material",
    name_ja: "分光結晶材質",
    name_en: "crystal material",
    category: "instrument",
    type: "string",
    level: "recommended",
    required: false,
    enum: ["Si", "Ge", "InSb", "Beryl"],
    example: "Si",
    description: "分光器の結晶材料（エネルギー換算に推奨）。"
  },
  {
    path: "@instrument@monochromator@detail@crystal_plane",
    name_ja: "分光結晶回折面",
    name_en: "crystal plane",
    category: "instrument",
    type: "string",
    level: "recommended",
    required: false,
    enum: ["111", "311", "220", "511"],
    example: "111",
    description: "回折格子面（仕様書標準: 111, 311, 220。換算に推奨）。"
  },
  {
    path: "@instrument@monochromator@detail@crystal_d",
    name_ja: "分光結晶面間隔 d値",
    name_en: "crystal d-spacing",
    category: "instrument",
    type: "double",
    level: "optional",
    required: false,
    example: 3.13553,
    description: "結晶格子面間隔（角度-エネルギー変換用）。"
  },
  {
    path: "@instrument@monochromator@detail@crystal_d_unit",
    name_ja: "面間隔 d値の単位",
    name_en: "crystal d-spacing unit",
    category: "instrument",
    type: "string",
    level: "optional",
    required: false,
    enum: ["angstrom", "nm"],
    example: "angstrom",
    description: "面間隔の単位（仕様書標準: angstrom）。"
  },

  // -------------------------------------------------------------
  // 5. measurement (測定条件・吸収端・検出器)
  // -------------------------------------------------------------
  {
    path: "@measurement@edges[0].element",
    name_ja: "測定対象元素",
    name_en: "absorption edge element",
    category: "measurement",
    type: "string",
    level: "required",
    required: true,
    example: "Cu",
    description: "測定対象の元素記号（例: Cu, Fe, Pt）。検索最重要項目。"
  },
  {
    path: "@measurement@edges[0].edge",
    name_ja: "測定吸収端",
    name_en: "absorption edge name",
    category: "measurement",
    type: "string",
    level: "required",
    required: true,
    enum: ["K-edge", "L1-edge", "L2-edge", "L3-edge", "M-edge"],
    example: "K-edge",
    description: "吸収端の種別（K-edge, L3-edge 等）。検索最重要項目。"
  },
  {
    path: "@measurement@measured_time@start_time",
    name_ja: "測定開始日時",
    name_en: "start time of measurement",
    category: "measurement",
    type: "date",
    level: "recommended",
    required: false,
    example: "2022-03-18 20:13:31",
    description: "測定の開始タイムスタンプ（手順書推奨）。"
  },
  {
    path: "@measurement@measured_time@end_time",
    name_ja: "測定終了日時",
    name_en: "end time of measurement",
    category: "measurement",
    type: "date",
    level: "optional",
    required: false,
    example: "2022-03-18 20:33:28",
    description: "測定の終了タイムスタンプ。"
  },
  {
    path: "@measurement@energy_calibration@standard_sample",
    name_ja: "エネルギー較正用標準試料",
    name_en: "calibration standard sample",
    category: "measurement",
    type: "string",
    level: "optional",
    required: false,
    example: "Cu foil",
    description: "較正に使用した標準物質（Cu foil 等）。"
  },
  {
    path: "@measurement@energy_calibration@energy",
    name_ja: "較正エネルギー定義値",
    name_en: "calibration energy",
    category: "measurement",
    type: "double",
    level: "optional",
    required: false,
    example: 8980.12,
    description: "較正点の割り当てエネルギー値。"
  },
  {
    path: "@measurement@energy_calibration@energy_unit",
    name_ja: "較正エネルギー単位",
    name_en: "calibration energy unit",
    category: "measurement",
    type: "string",
    level: "optional",
    required: false,
    enum: ["eV", "keV"],
    example: "eV",
    description: "較正エネルギーの単位。"
  },
  {
    path: "@measurement@section@number",
    name_ja: "スキャン分割ブロック数",
    name_en: "section number",
    category: "measurement",
    type: "integer",
    level: "optional",
    required: false,
    example: 3,
    description: "9809形式のスキャン区間ブロック数。"
  },
  {
    path: "@measurement@section@data_points",
    name_ja: "測定総データ点数",
    name_en: "total data points",
    category: "measurement",
    type: "integer",
    level: "optional",
    required: false,
    example: 3783,
    description: "スペクトルの有効データ行数。"
  },
  {
    path: "@measurement@section@blocks[0].start",
    name_ja: "第1ブロック 開始エネルギー/角度",
    name_en: "1st block start",
    category: "measurement",
    type: "double",
    level: "optional",
    required: false,
    example: 8700.0,
    description: "第1ブロックの測定開始位置。"
  },
  {
    path: "@measurement@section@blocks[0].end",
    name_ja: "第1ブロック 終了エネルギー/角度",
    name_en: "1st block end",
    category: "measurement",
    type: "double",
    level: "optional",
    required: false,
    example: 8960.0,
    description: "第1ブロックの測定終了位置。"
  },
  {
    path: "@measurement@section@blocks[0].delta",
    name_ja: "第1ブロック ステップ幅",
    name_en: "1st block delta step",
    category: "measurement",
    type: "double",
    level: "optional",
    required: false,
    example: 5.0,
    description: "送りステップ幅。"
  },
  {
    path: "@measurement@section@blocks[0].dwell_time",
    name_ja: "第1ブロック 露光時間",
    name_en: "1st block dwell time",
    category: "measurement",
    type: "double",
    level: "optional",
    required: false,
    example: 1.0,
    description: "1点あたりの真の計測ゲート時間。"
  },
  {
    path: "@measurement@detectors[0].name",
    name_ja: "第1検出器 識別名",
    name_en: "1st detector name",
    category: "measurement",
    type: "string",
    level: "optional",
    required: false,
    example: "I0",
    description: "検出器名（I0, I1, SSD 等）。"
  },
  {
    path: "@measurement@detectors[0].hardware@type",
    name_ja: "第1検出器 デバイス種別",
    name_en: "1st detector type",
    category: "measurement",
    type: "string",
    level: "optional",
    required: false,
    enum: ["IC", "SDD", "SSD", "TEY", "PEY", "2D-CCD", "Photodiode"],
    example: "IC",
    description: "検出器ハードウェア種類（IC: 電離箱, SDD: シリコンドリフト 等）。"
  },
  {
    path: "@measurement@detectors[0].hardware@applied_voltage",
    name_ja: "第1検出器 印加電圧",
    name_en: "1st detector applied voltage",
    category: "measurement",
    type: "double",
    level: "optional",
    required: false,
    example: 1500,
    description: "電離箱等への動作印加電圧。"
  },
  {
    path: "@measurement@detectors[0].hardware@applied_voltage_unit",
    name_ja: "第1検出器 印加電圧単位",
    name_en: "1st detector applied voltage unit",
    category: "measurement",
    type: "string",
    level: "optional",
    required: false,
    enum: ["V", "kV"],
    example: "V",
    description: "印加電圧の単位。"
  },

  // -------------------------------------------------------------
  // 6. sample (測定試料情報)
  // -------------------------------------------------------------
  {
    path: "@sample@name",
    name_ja: "サンプル名称 (物質名)",
    name_en: "sample name",
    category: "sample",
    type: "string",
    level: "required",
    required: true,
    example: "Copper(II) oxide",
    description: "測定サンプルの英語表記名称。"
  },
  {
    path: "@sample@chemical_formula",
    name_ja: "化学組成式 (化学式)",
    name_en: "chemical formula",
    category: "sample",
    type: "string",
    level: "recommended",
    required: false,
    example: "CuO",
    description: "サンプルの化学式（名寄せ・検索・MI解析に超重要）。"
  },
  {
    path: "@sample@phase",
    name_ja: "サンプルの物理状態・相",
    name_en: "phase of sample",
    category: "sample",
    type: "string",
    level: "recommended",
    required: false,
    enum: ["solid", "powder", "film", "liquid", "gas"],
    example: "solid",
    description: "試料の相状態 (手順書推奨: solid, powder, film 等)。"
  },
  {
    path: "@sample@supplier",
    name_ja: "試薬・試料メーカー (入手先)",
    name_en: "sample supplier",
    category: "sample",
    type: "string",
    level: "optional",
    required: false,
    example: "Sigma-Aldrich",
    description: "化学品メーカー名。"
  },
  {
    path: "@sample@purity",
    name_ja: "試料純度",
    name_en: "sample purity",
    category: "sample",
    type: "string",
    level: "optional",
    required: false,
    example: "99.99%",
    description: "試料の純度スペック。"
  },
  {
    path: "@sample@concentration",
    name_ja: "目的物質含有濃度",
    name_en: "sample concentration",
    category: "sample",
    type: "string",
    level: "optional",
    required: false,
    example: "8 wt%",
    description: "希釈試料等の濃度。"
  },
  {
    path: "@sample@additional_data",
    name_ja: "試料調製補足",
    name_en: "sample additional data",
    category: "sample",
    type: "string",
    level: "optional",
    required: false,
    example: "diluted with BN, pelletized",
    description: "希釈剤（BN等）や成形方法などのメモ。"
  },
  {
    path: "@sample@condition@temperature@value",
    name_ja: "測定時温度",
    name_en: "sample measurement temperature",
    category: "sample",
    type: "double",
    level: "recommended",
    required: false,
    example: 300,
    description: "測定時の試料環境温度（常温300K等。仕様書推奨）。"
  },
  {
    path: "@sample@condition@temperature@unit",
    name_ja: "測定時温度単位",
    name_en: "sample temperature unit",
    category: "sample",
    type: "string",
    level: "recommended",
    required: false,
    enum: ["K", "degC", "C"],
    example: "K",
    description: "温度単位 (仕様書標準: K)。"
  },

  // -------------------------------------------------------------
  // 7. reference (較正用参照試料)
  // -------------------------------------------------------------
  {
    path: "@reference@chemical_formula",
    name_ja: "参照試料の化学式",
    name_en: "reference chemical formula",
    category: "reference",
    type: "string",
    level: "optional",
    required: false,
    example: "Cu",
    description: "エネルギー較正用ホイル等の化学式。"
  },
  {
    path: "@reference@name",
    name_ja: "参照試料名",
    name_en: "reference sample name",
    category: "reference",
    type: "string",
    level: "optional",
    required: false,
    example: "copper foil",
    description: "参照試料の名称。"
  },
  {
    path: "@reference@phase",
    name_ja: "参照試料の相",
    name_en: "reference phase",
    category: "reference",
    type: "string",
    level: "optional",
    required: false,
    enum: ["film", "solid", "powder", "liquid", "gas"],
    example: "film",
    description: "参照試料の相 (仕様書: film, solid, powder, liquid, gas)。"
  },

  // -------------------------------------------------------------
  // 8. local (独自拡張パラメータ枠)
  // -------------------------------------------------------------
  {
    path: "@local@additional_data",
    name_ja: "独自補足情報",
    name_en: "local custom additional data",
    category: "local",
    type: "string",
    level: "optional",
    required: false,
    example: "custom parameter note",
    description: "共通仕様にない独自メタデータを自由に格納。"
  }
];
