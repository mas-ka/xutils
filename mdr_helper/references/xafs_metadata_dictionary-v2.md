# XAFSメタデータ共通仕様スキーマ・ディクショナリ
## 〜データベース登録・検索用 Key定義リファレンスマニュアル〜

本ディクショナリは、日本XAFS研究会（JXS）XAFSワーキンググループが2023年2月3日にリリースした**「XAFSメタデータ共通仕様（20230203リリース版）」**で定義されている全てのメタデータ項目（Key）について、大分類（カテゴリ）ごとに詳細な仕様を整理したリファレンスマニュアルです。

それぞれのカテゴリにおいて、システム上必須とされる項目（**required**）を先頭にまとめ、その後に任意の項目（**optional**）を共通仕様スキーマの定義順に掲載しています。

---

## 1. data_info カテゴリ (データ・登録基本情報)
登録者情報、公開権限、ライセンス、データセット全体のタイトル、メタデータ仕様バージョンなどを定義する最上位のカテゴリです。

### ■ 必須項目 (Required)

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@data_info@data_depositor@organization` | string | データ登録者の組織<br>*organization of data depositor* | `Ritsumeikan` | 大学・研究所・企業などの名称。 |
| `@data_info@data_depositor@name` | string | データ登録者の氏名<br>*name of data depositor* | `Taro KEK` | ローマ字表記推奨。 |
| `@data_info@contact_name@organization` | string | データ責任者（窓口）の組織<br>*organization of contact person* | `Ritsumeikan` | 問い合わせ対応可能な組織。 |
| `@data_info@contact_name@name` | string | データ責任者（所属名でも可）<br>*contact name (person or affiliation)* | `Jiro Hokudai` | ローマ字表記推奨。 |
| `@data_info@deposite_time@create_time` | date | メタデータの生成日時<br>*create time of data deposite* | `2023-02-03` | `YYYY-MM-DD` 形式。 |
| `@data_info@title` | text | データセットの題名(英語)<br>*title of work (english)* | `XAFS measurement of Cu` | 課題名や測定の目的など。 |

### ■ 任意項目 (Optional)

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@data_info@data_depositor@affiliation` | string | データ登録者の所属部署<br>*affiliation of data depositor* | `Institute for Catalysis` | 登録者の学部、研究科、部局など。 |
| `@data_info@data_depositor@role` | string | データ登録者の役割<br>*role of data depositor* | `analyst` | **Enum**: `analyst`, `manager`, `director` |
| `@data_info@contact_name@affiliation` | string | データ責任者の所属部署<br>*affiliation of contact person* | `Ritsumeikan SR center` | 責任者の所属センターや研究室。 |
| `@data_info@contact_name@role` | string | データ責任者の役割<br>*role of data contact name* | `responsible` | **Enum**: `contractor`, `principal investigator`, `head of the institution`, `responsible` |
| `@data_info@access_rights` | string | アクセス権限<br>*access rights* | `open` | 未入力の場合は `close`。<br>**Enum**: `open`, `close` |
| `@data_info@license` | string | 二次利用ライセンス<br>*license* | `CC BY-NC-SA` | 例: `CC BY`, `CC BY-NC-SA` など。 |
| `@data_info@deposite_time@update_time` | date | メタデータの最終更新日時<br>*update time of data deposite* | `2023-02-04` | `YYYY-MM-DD` 形式。 |
| `@data_info@title_ja` | text | データセットの題名(日本語)<br>*title of work (japanese)* | `CuのXAFS測定` | 日本語でのタイトル。 |
| `@data_info@identifier@pid` | keyword | データセット固有のPID番号<br>*Persistent ID* | `spring8.7e55cc2d-...` | 登録毎にユニークなID。 |
| `@data_info@identifier@proposal_number` | string | 実験課題番号<br>*proposal number* | `2014S0000` | 施設固有の課題番号など。 |
| `@data_info@identifier@register_name` | string | データベース登録名<br>*register name* | `/SPring-8/BL14B2/...` | パス形式などで定義。 |
| `@data_info@related_ids` | array | 関連データセットIDの配列<br>*related id list of the dataset* | | 複数データが関連する場合に使用。 |
| `@data_info@related_ids.id` | string | 関連するデータセットのID<br>*id of the related dataset* | `spring8.7e55cc2d-...` | |
| `@data_info@related_ids.description` | string | 関連するデータセットの説明<br>*description of the related dataset* | `time-resolved` | |
| `@data_info@comment` | string | コメント・自由記述<br>*comment* | `metadata test` | |
| `@data_info@metadata_format@version` | string | メタデータフォーマットバージョン<br>*metadata format version* | `XAFS.20230203` | 本仕様規格のバージョン。 |
| `@data_info@metadata_format@schema_uri` | string | メタデータスキーマのURI<br>*URI of metadata schema* | `https://raw.githubusercontent.com/...` | バリデーション用スキーマ定義URI。 |
| `@data_info@metadata_format@version_branch` | string | フォーマットのバージョンブランチ<br>*metadata format version branch* | `AichiSR.20230203` | ローカルで拡張規格を適用する場合。 |
| `@data_info@measurement_methods` | array | 計測手法の配列<br>*list of measurement methods* | | |
| `@data_info@measurement_methods.category` | string | 計測手法カテゴリ<br>*category of measurement method* | `spectroscopy` | |
| `@data_info@measurement_methods.sub_category` | string | 計測手法サブカテゴリ<br>*sub category of measurement method* | `XAFS` | |

---

## 2. facility カテゴリ (測定施設・光源情報)
測定を行った放射光施設、加速器リング、およびビームラインのスペック情報を格納するカテゴリです。

### ■ 必須項目 (Required)

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@facility@name` | string | 放射光施設名<br>*facility name* | `SPring-8` | 例: `PF-AR`, `AichiSR`, `Ritsumeikan` 等 |
| `@facility@beamline` | string | 使用したビームライン名<br>*beamline* | `BL14B2` | 例: `BL-12C`, `BL-10` など。 |

### ■ 任意項目 (Optional)

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@facility@ring@energy` | double | 加速器のビームエネルギー<br>*beam energy* | `100000` | 通常は単位指定とセット。 |
| `@facility@ring@energy_unit` | string | ビームエネルギーの単位<br>*beam energy unit* | `GeV` | |
| `@facility@ring@filling_pattern` | string | 運転フィリングパターン<br>*filling pattern* | `4 bunch train X 84` | |
| `@facility@ring@filling_pattern_mode` | string | フィリングパターンモード<br>*filling pattern mode* | `A` | |
| `@facility@ring@start_current` | double | 蓄積リング電流(開始時)<br>*beam current (start)* | `99.9` | |
| `@facility@ring@start_current_unit` | string | 蓄積電流単位(開始時)<br>*beam current unit (start)* | `mA` | |
| `@facility@ring@end_current` | double | 蓄積リング電流(終了時)<br>*beam current (end)* | `99.8` | |
| `@facility@ring@end_current_unit` | string | 蓄積電流単位(終了時)<br>*beam current unit (end)* | `mA` | |
| `@facility@light_source@type` | string | 挿入光源の種類<br>*light source type* | `BM` | 偏向電磁石、アンジュレータ、ウィグラー等。<br>**Enum**: `BM`, `U`, `W` |
| `@facility@light_source@polarization` | string | 光源の偏光状態<br>*polarization of light source* | `circular` | 例: `linear`, `circular` など。 |

---

## 3. files カテゴリ (データファイル仕様)
アップロードされる測定データファイルそのもののファイル形式、行数、カラム構成を機械判読可能に定義するカテゴリです。

### ■ 必須項目 (Required)
*※本カテゴリは必須（required）指定のKeyはありません（すべて optional）。しかし、データ再利用性の観点から `name`, `extension`, `format`, `headerlines`, `columns` の定義は実質必須です。*

### ■ 任意項目 (Optional)

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@files` | array | 登録するファイルの配列<br>*file array defined by each format* | | 複数ファイルを関連づけて登録可能。 |
| `@files@file` | array | 利用されるファイルのリスト<br>*file array used for each format* | | |
| `@files@file.name` | string | 実ファイル名<br>*filename* | `sample.dat` | 拡張子を含むファイル名。 |
| `@files.description` | string | ファイルに関する説明・性質分類<br>*description of the file* | `experimental` | **Enum**: `experimental`, `calibrated`, `corrected`, `thumbnail` |
| `@files.extension` | string | ファイルの拡張子<br>*file extension* | `dat` | `dat`, `csv`, `txt` など。 |
| `@files.format` | string | ファイルの物理フォーマット名<br>*file format* | `9809` | 9809形式、XDI形式など。 |
| `@files.headerlines` | integer | 数値コラム（実データ）までの行数<br>*Number of rows before measured data* | `17` | ヘッダー行のスキップ数（カウントに注意）。 |
| `@files.columns` | array | 列構造（カラム）の定義配列<br>*data column array* | | 1列目から順番に定義します。 |
| `@files.columns.name` | string | 列（カラム）の意味・物理量名<br>*Header name for each column* | `energy` | `energy`, `I0`, `I`, `obs_angle` など。 |
| `@files.columns.unit` | string | カラムデータの単位<br>*column unit* | `eV` | `eV`, `counts`, `deg`, `a.u.` など。 |
| `@files.columns.type` | string | カラムデータが「生」か「処理済」か<br>*column type* | `raw` | 生測定値は `raw`、補正後は `processed`。<br>**Enum**: `raw`, `processed` |
| `@files.columns.additional_data` | string | カラムに関する追加の補足<br>*additional data* | `Uncalibrated` | |
| `@files.columns.detection` | string | この列データの測定検出方法<br>*detection method* | `transmission` | 例: `transmission`, `fluorescence`, `TEY`, `PEY` |
| `@files.columns.reference_to_detector` | string | 参照している検出器名・物理演算式<br>*reference to detector* | `I0` | `@instrument@detectors.name` から引用。 |

---

## 4. instrument カテゴリ (光学系・光学素子)
ビームラインに設置された分光器（DCM）、ミラー、スリット、フィルターなどの空間配置と仕様を定義するカテゴリです。

### ■ 必須項目 (Required)
*※本カテゴリに必須項目はありません（すべて optional）。*

### ■ 任意項目 (Optional)

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@instrument@arrangement` | string | 光学素子の上流から下流への空間配置関係<br>*arrange of instrument* | `S1//M1//DCM//S2` | 各素子名を `//` で連結して表記する。 |
| `@instrument@monochromator@name` | string | 分光器の名称<br>*monochromator name* | `DCM` | ダブルクリスタルモノクロメータ等。 |
| `@instrument@monochromator@distance` | double | 分光器の光源（光源点）からの距離<br>*distance from light source* | `4000` | 施設依存値。 |
| `@instrument@monochromator@distance_unit` | string | 光源からの距離の単位<br>*distance unit from light source* | `mm` | `mm` や `m` など。 |
| `@instrument@monochromator@type` | string | 分光器のタイプ分類<br>*monochromator type* | `DCM` | |
| `@instrument@monochromator@scan_mode` | string | 分光器のスキャン駆動モード<br>*monochromator scan mode* | `quick scan` | 例: `step scan`, `quick scan` |
| `@instrument@monochromator@detail@crystal_material` | string | 分光結晶の材質<br>*crystal material* | `Si` | |
| `@instrument@monochromator@detail@crystal_plane` | string | 分光結晶の回折格子面<br>*crystal plane* | `111` | `111`, `311` など。 |
| `@instrument@monochromator@detail@crystal_d` | double | 分光結晶の面間隔 定数値<br>*monochromator distance* | `3.13553` | 単位とともに角度-エネルギー換算に必須。 |
| `@instrument@monochromator@detail@crystal_d_unit` | string | 面間隔の物理単位<br>*monochromator distance unit* | `angstrom` | |
| `@instrument@mirrors` | array | ミラー素子のリスト<br>*mirror list* | | ビームライン内の全ミラーを配列で登録。 |
| `@instrument@mirrors.name` | string | ミラーの個別名称<br>*mirror name* | `M1` | |
| `@instrument@mirrors.distance` | double | ミラーの光源からの距離<br>*distance of mirror* | `3500` | |
| `@instrument@mirrors.distance_unit` | string | ミラーの光源からの距離の単位<br>*distance unit of mirror* | `mm` | |
| `@instrument@mirrors.role` | string | ミラーの物理的役割<br>*role of mirror* | `higher-order-cut` | 高調波カット、集光など。 |
| `@instrument@mirrors.type` | string | ミラーの種類<br>*mirror type* | `double` | 平面・トロイダル、単・双など。 |
| `@instrument@mirrors.angle` | double | ミラーの設置角度・臨界角<br>*mirror angle* | `4` | |
| `@instrument@mirrors.angle_unit` | string | ミラー角度の単位<br>*mirror angle unit* | `mrad` | `mrad` などの微小角度単位。 |
| `@instrument@mirrors.coating` | string | ミラー表面のコーティング金属材<br>*mirror coating* | `Rh` | `Rh`, `Pt`, `Si` など。 |
| `@instrument@mirrors.shape` | string | ミラーの物理形状<br>*mirror shape* | `flat` | `flat` (平面), `cylindrical` 等。 |
| `@instrument@filters` | array | 高調波カット等用フィルターのリスト<br>*filter list* | | |
| `@instrument@filters.name` | string | フィルター名<br>*filter name* | `F1` | |
| `@instrument@filters.distance` | double | フィルターの光源からの距離<br>*filter distance* | `2000` | |
| `@instrument@filters.distance_unit` | string | フィルター距離の単位<br>*filter distance unit* | `mm` | |
| `@instrument@filters.role` | string | フィルターの役割<br>*role of filter* | `attenuation` | |
| `@instrument@filters.material` | string | フィルターの材質<br>*material of filter* | `Be` | 例: `Al`, `Be`, `Kapton` |
| `@instrument@filters.thickness` | double | フィルターの厚み<br>*filter thickness* | `1` | |
| `@instrument@filters.thickness_unit` | string | フィルター厚みの単位<br>*filter thickness unit* | `mm` | |
| `@instrument@slits` | array | スリット装置のリスト<br>*list for slit* | | |
| `@instrument@slits.name` | string | スリット装置名<br>*slit name* | `S1` | |
| `@instrument@slits.type` | string | スリットの形式<br>*slit type* | `4D-slit` | 四方独立スリット等。 |
| `@instrument@slits.distance` | double | スリットの光源からの距離<br>*distance of slit* | `1000` | |
| `@instrument@slits.distance_unit` | string | スリット距離の単位<br>*distance unit of slit* | `mm` | |
| `@instrument@slits.vertical_size` | double | スリットの垂直方向の開口幅<br>*slit vertical size* | `1` | |
| `@instrument@slits.vertical_size_unit` | string | 垂直開口幅の単位<br>*slit vertical size unit* | `mm` | |
| `@instrument@slits.horizontal_size` | double | スリットの水平方向の開口幅<br>*slit horizontal size* | `1` | |
| `@instrument@slits.horizontal_size_unit` | string | 水平開口幅の単位<br>*slit horizontal size unit* | `mm` | |
| `@instrument@slits.diameter` | double | ピンホールスリット等の直径開口<br>*slit diameter* | `2` | 円形スリット用。 |
| `@instrument@slits.diameter_unit` | string | スリット直径の単位<br>*slit diameter unit* | `mm` | |

---

## 5. measurement カテゴリ (スキャン方法・エネルギー補正・検出器一式)
最も項目数が多く複雑なカテゴリです。測定対象元素や吸収端、エネルギー補正（エネルギー較正）情報、測定時間、および「検出器（detectors）」ごとのアンプやプロセッサ等の一連の処理パラメータを含みます。

### ■ 必須項目 (Required)
*※本カテゴリに必須項目はありません（すべて optional）。ただし、検索・MI活用のために `edges.element`, `edges.edge` は実質必須です。*

### ■ 任意項目 (Optional)

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@measurement@edges` | array | 測定した吸収端情報の配列<br>*array of absorption edge* | | 1測定で複数元素/端をスキャンした場合は複数記述。 |
| `@measurement@edges.element` | string | 測定対象元素の化学記号<br>*absorption edge element* | `Co` | 例: `Cu`, `Fe`, `Si`。**（検索インデックス最重要）** |
| `@measurement@edges.edge` | string | 測定した吸収端の分類名<br>*absorption edge name* | `K-edge` | 例: `K-edge`, `L3-edge`。**（検索インデックス最重要）** |
| `@measurement@measured_time@start_time` | date | 測定開始時刻<br>*start time of measurement* | `2019-01-22 13:43:15` | |
| `@measurement@measured_time@end_time` | date | 測定終了時刻<br>*end time of measurement* | `2019-01-22 14:01:06` | |
| `@measurement@energy_calibration@standard_sample` | string | エネルギー較正に使用した標準物質<br>*standard sample for energy calibration* | `alpha-Al2O3` | 例: `Cu foil` など。 |
| `@measurement@energy_calibration@calibration_position` | string | 較正基準（エネルギー値）の指標物理位置<br>*calibration position* | `white line peak maximum` | 第1変曲点、ピークトップ、ホワイトライン最大等。 |
| `@measurement@energy_calibration@energy` | double | 較正点に割り当てた定義エネルギー値<br>*energy used for energy calibration* | `1567.71` | |
| `@measurement@energy_calibration@energy_unit` | string | 較正エネルギーの単位<br>*energy unit used for calibration* | `eV` | 通常は `eV`。 |
| `@measurement@tune@type` | string | 測定軸チューニングの種別<br>*tune type* | `single` | |
| `@measurement@tune@angle` | double | チューンされた角度<br>*tune angle* | `46` | |
| `@measurement@tune@angle_unit` | string | チューン角度の単位<br>*tune angle unit* | `deg` | |
| `@measurement@tune@energy` | double | チューンされたエネルギー<br>*tune energy* | | |
| `@measurement@tune@energy_unit` | string | チューンエネルギーの単位<br>*tune energy unit* | | |
| `@measurement@tune@ratio` | double | チューンのデチューニング比率（高調波カット）<br>*tune ratio* | `80` | 入射光量をあえて落とす割合等。 |
| `@measurement@tune@ratio_unit` | string | デチューン比率の単位<br>*tune ratio unit* | `%` | |
| `@measurement@section@number` | integer | 測定を分割した「ブロック（セクション）」数<br>*section number* | `4` | 9809形式スキャンパラメータ。 |
| `@measurement@section@blocks` | array | 各測定ブロックの条件配列<br>*array of section block* | | |
| `@measurement@section@blocks.start` | double | 各ブロックの開始エネルギー（または角度）<br>*start value* | `1500` | |
| `@measurement@section@blocks.start_unit` | string | 開始値の単位<br>*start unit* | `eV` | `eV` もしくは `deg`。 |
| `@measurement@section@blocks.end` | double | 各ブロックの終了エネルギー（または角度）<br>*end value* | `1550` | |
| `@measurement@section@blocks.end_unit` | string | 終了値の単位<br>*end unit* | `eV` | |
| `@measurement@section@blocks.delta` | double | 送りステップ幅<br>*delta* | `2.5` | |
| `@measurement@section@blocks.delta_unit` | string | 送りステップ幅の単位<br>*delta unit* | `eV` | `eV` もしくは `deg`。 |
| `@measurement@section@blocks.wait_time` | double | モーター駆動後の測定待機時間（セトリング時間）<br>*wait time* | `1` | |
| `@measurement@section@blocks.wait_time_unit` | string | 測定待機時間の単位<br>*wait time unit* | `s` | |
| `@measurement@section@blocks.dwell_time` | double | 1点あたりの真のゲート（露光）時間<br>*dwell time* | | |
| `@measurement@section@blocks.dwell_time_unit` | string | 露光時間の単位<br>*dwell time unit* | | |
| `@measurement@section@blocks.sampling_number` | integer | 各測定点のサンプリング積算回数<br>*sampling number* | | |
| `@measurement@section@data_points` | integer | データセット全体の測定データ総点数<br>*data points* | `294` | データファイルの有効行数に一致。 |
| `@measurement@chamber_environment` | string | 測定時試料チェンバー内環境気体<br>*chamber environment* | `He` | `He` (ヘリウムガス通気), `Vacuum` (真空) 等。 |
| `@measurement@additional_data` | string | 測定全体の補足事項<br>*additional data* | `Time-resolved` | |

---

### 🚨 detectors 構造 (検出器ハード・電気信号処理チェーン)
測定に用いられた検出器（イオンチャンバ、SSD等）ごとに、生データがどのような電気アンプ、デジタルシグナルプロセッサ（DSP）を通ったかの全信号系統図を定義する、`detectors` 配列以下のサブKey群です。

#### 1) 検出器の基本割当
| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@measurement@detectors` | array | 測定検出器の配列<br>*detector array* | | イオンチャンバI0、透過検出器I、蛍光多素子など。 |
| `@measurement@detectors.name` | string | 検出器の個別識別名（必須・ユニーク）<br>*detector name* | `I0` | 登録データファイルのcolumnsから参照される名前。 |
| `@measurement@detectors.arrangement` | string | 検出器の接続シグナルチェーン図<br>*detector arrangement* | `IC//Current Amp.//Counter` | 上流から回路素子を順に `//` で連結して定義。 |

#### 2) hardware サブツリー (検出器自体の物理・構造)
各検出器デバイスそのものの仕様を定義します。

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@measurement@detectors.hardware@type` | string | 検出器デバイスの種類<br>*type of hardware* | `IC` | `IC`, `TEY`, `PEY`, `SDD`, `2D-CCD` など。 |
| `@measurement@detectors.hardware@manufacturer` | string | デバイスの製造メーカー<br>*manufacturer of hardware* | `OHYO KOKEN KOGYO CO., LTD.` | |
| `@measurement@detectors.hardware@model_number` | string | デバイスの型番・モデル番号<br>*model number of hardware* | `18cm` | |
| `@measurement@detectors.hardware@drain@type` | string | ドレイン電流読み出しのターゲット種別<br>*drain type of hardware* | `mirror` | TEY（全電子収量）測定などの補足情報。<br>**Enum**: `mirror/mesh`, など。 |
| `@measurement@detectors.hardware@coating_material` | string | ターゲット表面コーティングコート材<br>*coating material* | `Ni` | |
| `@measurement@detectors.hardware@aperture_ratio` | double | ドレインメッシュ等の幾何学的開口（透過）率<br>*aperture ratio* | `89` | |
| `@measurement@detectors.hardware@aperture_ratio_unit` | string | 開口率の単位<br>*aperture ratio unit* | `%` | |
| `@measurement@detectors.hardware@gases_number` | integer | 電離箱（IC）封入ガスの構成要素ガス数<br>*gas number* | `2` | 混合ガスの場合の要素ガス数。 |
| `@measurement@detectors.hardware@gases` | array | 封入ガスの混合組成リスト<br>*gas list* | | ガス名と混合比率をセットで並べます。 |
| `@measurement@detectors.hardware@gases.name` | string | ガス名<br>*name of gas* | `N2` | `N2`, `Ar`, `He`, `Kr` など。 |
| `@measurement@detectors.hardware@gases.proportion` | double | ガスの混合組成比（パーセント）<br>*proportion of gas* | `50` | `50` であれば 50 %。 |
| `@measurement@detectors.hardware@applied_voltage` | double | 検出器への印加動作電圧<br>*applied voltage* | `1500` | ICやダイオードなどの印加バイアス電圧。 |
| `@measurement@detectors.hardware@applied_voltage_unit` | string | 印加電圧の単位<br>*applied voltage unit* | `V` | |
| `@measurement@detectors.hardware@device_number_total` | integer | 検出器全体の検出素子（チャンネル）数<br>*total device number* | `19` | 19素子SSDなどの場合「19」。 |
| `@measurement@detectors.hardware@dimension` | integer | 2D検出器等の次元数<br>*dimension number* | `2` | 2次元CCDカメラなどの場合は `2`。 |
| `@measurement@detectors.hardware@device_number_1` | integer | 素子数（1次元/X軸方向画素数）<br>*device number (dimension 1)* | `1024` | |
| `@measurement@detectors.hardware@device_number_2` | integer | 素子数（2次元/Y軸方向画素数）<br>*device number (dimension 2)* | `1024` | |
| `@measurement@detectors.hardware@applied_voltages` | array | 複数素子への個別印加電圧のリスト<br>*list of applied voltages* | | |
| `@measurement@detectors.hardware@applied_voltages.applied_voltage` | double | 該当素子の印加電圧値<br>*applied voltage (each device)* | `500` | |
| `@measurement@detectors.hardware@applied_voltages.applied_voltage_unit` | string | 該当素子の印加電圧の単位<br>*applied voltage unit (each device)* | `V` | |
| `@measurement@detectors.hardware@applied_voltages.device` | integer | 該当素子の配列内インデックスID<br>*device ID* | `1` | |
| `@measurement@detectors.hardware@applied_voltage_front` | double | PEY等阻止格子(Front側)印加電圧<br>*applied voltage (front)* | `10` | |
| `@measurement@detectors.hardware@applied_voltage_front_unit` | string | 阻止格子(Front側)印加電圧の単位<br>*applied voltage unit (front)* | `V` | |
| `@measurement@detectors.hardware@applied_voltage_rear` | double | PEY等阻止格子(Rear側)印加電圧<br>*applied voltage (rear)* | `100` | |
| `@measurement@detectors.hardware@applied_voltage_rear_unit` | string | 阻止格子(Rear側)印加電圧の単位<br>*applied voltage unit (rear)* | `V` | |
| `@measurement@detectors.hardware@battery_box_voltage` | double | 信号引込電池（バイアス箱）の電圧<br>*battery box voltage* | `200` | |
| `@measurement@detectors.hardware@battery_box_voltage_unit` | string | バイアス箱電圧の単位<br>*battery box voltage unit* | `V` | |
| `@measurement@detectors.hardware@deflection_voltage` | double | 偏向・反射電界用の印加電圧<br>*deflection voltage* | `50` | |
| `@measurement@detectors.hardware@deflection_voltage_unit` | string | 偏向電圧の単位<br>*deflection voltage unit* | `V` | |
| `@measurement@detectors.hardware@retarding_voltage` | double | 阻止（リターディング）電位電圧<br>*retarding voltage* | `15` | |
| `@measurement@detectors.hardware@retarding_voltage_unit` | double | 阻止電位電圧の単位<br>*retarding voltage unit* | `V` | |

#### 3) processing_lines ＆ processors サブツリー (電気信号処理系統)
検出器が検出した微小な物理信号（電流・電荷等）を増幅・計数してデータ（数値）に落とし込むまでの処理機器パラメータを定義します。

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@measurement@detectors.processing_lines` | array | 信号経路（ライン）の定義配列<br>*array for processing line* | | 多素子の場合は素子分定義。 |
| `@measurement@detectors.processing_lines.conversion_factor` | double | 最終出力数値から真のフォトン計数への換算係数<br>*conversion factor* | `1.00E+08` | 各ビームライン固有の装置効率補正値。 |
| `@measurement@detectors.processing_lines.conversion_factor_unit` | string | 換算係数の物理単位<br>*conversion factor unit* | `/pA` | `/pA`, `/V`, `/count` など。 |
| `@measurement@detectors.processing_lines.processors` | array | ラインに挿入された信号処理回路の配列<br>*array of processor* | | 増幅器、VF変換器、カウンタ、DSPなどを直列に並べる。 |
| `@measurement@detectors.processing_lines.processors.processor` | string | プロセッサの名称<br>*processor name* | `Current Amp.` | モジュールの名前。 |
| `@measurement@detectors.processing_lines.processors.type` | string | プロセッサの演算/電気的タイプ分類<br>*processor type* | `Average` | `Average`, `MCA`, `pulse height discriminator` 等。 |
| `@measurement@detectors.processing_lines.processors.manufacturer` | string | プロセッサ回路モジュールの製造メーカー<br>*manufacturer of processor* | `NF` | |
| `@measurement@detectors.processing_lines.processors.model_number` | string | モジュールの型番<br>*model number of processor* | `CA5350` | |
| `@measurement@detectors.processing_lines.processors.gain` | double | 増幅アンプ等の動作設定ゲイン・倍率<br>*gain value of processor* | `1.00E+06` | |
| `@measurement@detectors.processing_lines.processors.gain_unit` | string | 設定ゲインの倍率単位<br>*gain value unit of processor* | `V/A` | `V/A`, `Hz/V` など。 |
| `@measurement@detectors.processing_lines.processors.time_constant` | double | アンプ等の信号応答動作時定数<br>*time constant of processor* | `1.00E-03` | |
| `@measurement@detectors.processing_lines.processors.time_constant_unit` | string | 時定数の単位<br>*time constant unit of processor* | `s` | `s` (秒) 単位が標準。 |
| `@measurement@detectors.processing_lines.processors.spatial_resolution` | double | カメラ型検出器等の空間分解能パラメータ<br>*spatial resolution of processor* | `1.00E+01` | イメージングXAFSカメラ等の画素物理分解能。 |
| `@measurement@detectors.processing_lines.processors.spatial_resolution_unit` | double | 空間分解能の単位<br>*spatial resolution unit* | `um` | |
| `@measurement@detectors.processing_lines.processors.unit_id` | integer | クレート内等でのモジュールの物理スロット番号<br>*unit id of processor* | `2` | CAMAC等での位置特定ID。 |
| `@measurement@detectors.processing_lines.processors.shaping_parameter@peaking_time` | double | シェーピング（パルス整形）時ピーク時間<br>*peaking time of shaping parameter* | `5.00E-07` | DSP等パルス整形定数。 |
| `@measurement@detectors.processing_lines.processors.shaping_parameter@peaking_time_unit` | string | ピーク時間の単位<br>*peaking time unit* | `s` | |
| `@measurement@detectors.processing_lines.processors.shaping_parameter@through_rate` | double | スルーレート 立ち上がり制限パラメータ<br>*through rate of shaping parameter* | `1.00E-09` | |
| `@measurement@detectors.processing_lines.processors.shaping_parameter@through_rate_unit` | string | スルーレートの単位<br>*through rate unit* | `s/V` | |
| `@measurement@detectors.processing_lines.processors.shaping_parameter@rising_time` | double | パルス立ち上がり設定時間<br>*rising time* | | |
| `@measurement@detectors.processing_lines.processors.shaping_parameter@rising_time_unit` | string | 立ち上がり時間の単位<br>*rising time unit* | | |
| `@measurement@detectors.processing_lines.processors.shaping_parameter@fast_process_peaking_time` | double | デジタル高速（Fast）時定数整形時間<br>*fast peaking time* | | 主にSSDの極短時定数系統用。 |
| `@measurement@detectors.processing_lines.processors.shaping_parameter@fast_process_peaking_time_unit` | string | 高速整形時間の単位<br>*fast peaking time unit* | | |
| `@measurement@detectors.processing_lines.processors.shaping_parameter@slow_process_peaking_time` | double | デジタル高精度（Slow）時定数整形時間<br>*slow peaking time* | | |
| `@measurement@detectors.processing_lines.processors.shaping_parameter@slow_process_peaking_time_unit` | string | 高精度整形時間の単位<br>*slow peaking time unit* | | |
| `@measurement@detectors.processing_lines.processors.ROI@lower_limit` | double | 関心領域（ROI）チャンネル下限閾値<br>*ROI lower limit* | `125` | 特定エネルギーのX線だけを選別する際のMCA閾値下限。 |
| `@measurement@detectors.processing_lines.processors.ROI@upper_limit` | double | 関心領域（ROI）チャンネル上限閾値<br>*ROI upper limit* | `355` | 閾値上限。 |
| `@measurement@detectors.processing_lines.processors.ROI@unit` | string | ROI閾値の指定単位<br>*ROI unit* | `bin` | `bin` (MCAチャンネル数) や `V` 等。 |
| `@measurement@detectors.processing_lines.processors.deadtime@value` | double | システムのデッドタイム（数え落とし不感時間）<br>*deadtime value* | | パルス計数回路の不感時間実測値。 |
| `@measurement@detectors.processing_lines.processors.deadtime@unit` | string | デッドタイムの単位<br>*deadtime unit* | | |
| `@measurement@detectors.processing_lines.processors.deadtime@set_at@energy` | double | デッドタイム定義の基準測定エネルギー値<br>*set energy of deadtime* | | |
| `@measurement@detectors.processing_lines.processors.deadtime@set_at@unit` | string | 基準測定エネルギーの単位<br>*set energy unit of deadtime* | | |
| `@measurement@detectors.processing_lines.processors.full_scale` | double | 入力アンプ等の最大許容レンジフルスケール<br>*full scale* | `0.2` | |
| `@measurement@detectors.processing_lines.processors.full_scale_unit` | string | フルスケールの単位<br>*full scale unit* | `mA` | `mA` や `V` など。 |
| `@measurement@detectors.additional_data` | string | 検出器ごとの個別の補足情報記述<br>*additional data of detector* | | |

---

## 6. sample カテゴリ (測定試料情報)
測定対象となったサンプルの化学的特徴、物理特性、メーカー、および「測定温度」や「ガス雰囲気」などのその場測定（in-situ）の環境条件を定義します。

### ■ 必須項目 (Required)

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@sample@name` | string | サンプル（物質）の名称<br>*sample name* | `vanadium (II) oxide` | 物質の名称（ローマ字表記推奨）。 |

### ■ 任意項目 (Optional)

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@sample@chemical_formula` | string | サンプルの組成化学式<br>*chemical formula* | `V2O5` | 表記の揺れ・名寄せに必須。超重要項目。 |
| `@sample@supplier` | string | 試料の入手先・化学品製造業者メーカー<br>*sample supplier* | `KOJUNDO KAGAKU` | 高純度化学等。 |
| `@sample@model_number` | string | 試料のカタログ製品番号（型番）<br>*sample model number* | `VVO03GB` | |
| `@sample@lot_number` | string | 試料の製造管理ロッド番号<br>*sample lot number* | `1234567` | |
| `@sample@CAS_number` | string | 物質登録CAS番号<br>*sample CAS number* | `1314-62-1` | |
| `@sample@identifier@global_identifiers` | array | 外部一般データベース上の登録識別IDリスト<br>*list of sample global identifiers* | | |
| `@sample@identifier@global_identifiers.global_identifier` | string | 外部データベース固有ID番号<br>*sample global identifier* | `CID:14814` | PubChem CID番号、ChemSpider IDなど。 |
| `@sample@identifier@local_identifiers` | array | 研究グループ等の内部ローカルサンプル管理ID<br>*list of sample local identifier* | | |
| `@sample@identifier@local_identifiers.local_identifier` | string | ローカルのサンプル管理ID番号<br>*sample local identifier* | `VO-00002` | 実験室内で振られた試料サンプル番号。 |
| `@sample@phase` | string | 試料の物理的な相状態分類<br>*phase of sample* | `solid` | **Enum**: `gas`, `solid`, `liquid`, `film` |
| `@sample@purity` | string | 試料の純度規格スペック<br>*sample purity* | `3N` | 例: `3N`, `99.9%` など。 |
| `@sample@concentration` | string | 目的物質の含有濃度比率（希釈試料の場合等）<br>*sample concentration* | `1 wt%` | 例: `1 wt%`, `1 at%`, `1 ppm` 等。 |
| `@sample@shape@type` | string | 試料の外観形状タイプ分類<br>*sample shape type* | `grains` | `grains` (粒状), `foil` (箔) など。 |
| `@sample@shape@size@type` | string | 試料サイズ寸法パラメーターの測定次元<br>*sample size type* | `diameter` | **Enum**: `diameter`, `radius`, `thickness` |
| `@sample@shape@size@value` | double | 試料サイズの物理的な寸法数値<br>*sample size value* | `2` | |
| `@sample@shape@size@unit` | string | 試料寸法寸法の物理単位<br>*sample size unit* | `mm` | 通常は `mm`。 |
| `@sample@create_time` | date | 試料（または薄膜等の成膜）作成された日付<br>*sample create time* | `2023-01-12` | `YYYY-MM-DD` 形式。 |
| `@sample@contact_name@organization` | string | 試料調製・合成を担当した責任者組織<br>*organization of sample contact* | `Ritsumeikan` | |
| `@sample@contact_name@affiliation` | string | 試料合成責任者の所属部署<br>*affiliation of sample contact* | `Ritsumeikan SR center` | |
| `@sample@contact_name@name` | string | 試料合成責任者の氏名<br>*name of sample contact* | `Jiro Hokudai` | ローマ字表記。 |
| `@sample@contact_name@role` | string | 試料合成責任者の役割・権限<br>*role of sample contact* | `responsible` | |
| `@sample@additional_data` | string | 試料調製に関する任意の補足説明<br>*sample additional data* | `on carbon tape` | 導電性カーボンテープ貼り付け等。 |
| `@sample@condition@temperature@value` | double | 測定時における試料の雰囲気設定「温度」<br>*temperature* | `300` | スキーマ上、温度のみが必須の環境Key。 |
| `@sample@condition@temperature@unit` | string | 設定温度の熱力学単位<br>*temperature unit* | `K` | 通常は `K`（ケルビン）。 |
| `@sample@condition@conditions` | array | 温度以外の特殊測定環境（ガス圧、電位等）リスト<br>*list of condition* | | in-situ / operando 測定時などに必須。 |
| `@sample@condition@conditions.name` | string | 測定環境物理量のアフィニティラベル名<br>*condition name* | `sample atmosphere` | ラベル（例: 「セル雰囲気」など）。 |
| `@sample@condition@conditions.types` | array | 設定環境条件の物理的カテゴリー分類リスト<br>*list of condition type* | | |
| `@sample@condition@conditions.types.type` | string | 測定環境条件の物理カテゴリ名<br>*condition type* | `atmosphere` | **Enum**: `atmosphere`, `voltage`, `current`, `coordinate`, `optical`, `thermal`, `mechanical`, `polarization` |
| `@sample@condition@conditions.value` | string | 設定した環境物理条件の印加数値<br>*condition value* | `0.2` | |
| `@sample@condition@conditions.unit` | string | 印加物理条件値の単位<br>*condition unit* | `kPa` | `kPa`, `V`, `A` など。 |
| `@sample@condition@conditions.additional_data` | string | 設定環境物理条件に関する追加補足<br>*additional data of condition* | `Vacuum` | 真空度やガス流量、セル材質の補足など。 |
| `@sample@condition@additional_data` | string | 試料環境パラメータ全体の自由補足項目<br>*additional data* | | |

---

## 7. reference カテゴリ (参照試料情報・較正材)
エネルギー補正（エネルギーキャリブレーション）用に、目的試料と同時に、または前後に測定された「参照試料（リファレンス）」の化学特性・物理特性情報を格納するカテゴリです。

### ■ 必須項目 (Required)
*※本カテゴリに必須項目はありません（すべて optional）。*

### ■ 任意項目 (Optional)

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・Enum等 |
| :--- | :---: | :--- | :--- | :--- |
| `@reference@chemical_formula` | string | 較正用参照試料の化学式<br>*[reference] chemical formula* | `V` | 例: エネルギー較正用金属箔の場合は `Cu`, `Co` 等。 |
| `@reference@name` | string | 参照試料名<br>*[reference] sample name* | `vanadium` | `vanadium foil`, `copper foil` など。 |
| `@reference@supplier` | string | 参照試料の入手メーカー・業者名<br>*[reference] sample supplier* | `Sigma-Aldrich` | |
| `@reference@model_number` | string | 参照試料のカタログ型番番号<br>*[reference] sample model number* | `255205` | |
| `@reference@lot_number` | string | 参照試料のロッド製造管理番号<br>*[reference] sample lot number* | `987654` | |
| `@reference@CAS_number` | string | 参照試料のCAS登録番号<br>*[reference] sample CAS number* | `7440-62-2` | |
| `@reference@identifier@global_identifiers` | array | 参照試料の外部データベース登録リスト<br>*[reference] list of sample global identifiers* | | |
| `@reference@identifier@global_identifiers.global_identifier` | string | 参照試料の外部データベース固有ID<br>*[reference] sample global identifier* | `SID:24861892` | |
| `@reference@identifier@local_identifier` | string | 研究室内の参照試料ローカル管理識別ID<br>*[reference] sample local identifier* | `V-00100` | |
| `@reference@phase` | string | 参照試料の物理的な相状態<br>*[reference] phase of sample* | `film` | 箔を挟むのが多いため `film` が多用されます。<br>**Enum**: `gas`, `solid`, `liquid`, `film` |
| `@reference@purity` | string | 参照試料の純度スペック<br>*[reference] sample purity* | `3N` | 較正用ホイルなら `3N` 以上を推奨。 |
| `@reference@concentration` | string | 参照試料の目的物含有濃度<br>*[reference] sample concentration* | `100 %` | 金属箔なら 100 % または `pure foil`。 |
| `@reference@shape@type` | string | 参照試料の形状タイプ分類<br>*[reference] sample shape type* | `film` | |
| `@reference@shape@size@type` | string | 参照試料寸法の測定定義次元<br>*[reference] sample size type* | `thickness` | **Enum**: `diameter`, `radius`, `thickness` |
| `@reference@shape@size@value` | double | 参照試料の寸法実測数値<br>*[reference] sample size value* | `0.25` | 箔の厚みなど。 |
| `@reference@shape@size@unit` | string | 参照試料寸法の物理単位<br>*[reference] sample size unit* | `mm` | `mm` や `um` など。 |
| `@reference@create_time` | date | 参照試料を調製、あるいはフォイルを購入した日<br>*[reference] sample create time* | `2023-01-12` | `YYYY-MM-DD` 形式。 |
| `@reference@contact_name@organization` | string | 参照試料調製・管理責任者の組織名<br>*[reference] organization of sample contact* | `Ritsumeikan` | |
| `@reference@contact_name@affiliation` | string | 参照試料責任者の所属部署<br>*[reference] affiliation of sample contact* | `Ritsumeikan SR center` | |
| `@reference@contact_name@name` | string | 参照試料責任者の氏名ローマ字表記<br>*[reference] name of sample contact* | `Jiro Hokudai` | |
| `@reference@contact_name@role` | string | 参照試料責任者の役割<br>*[reference] role of sample contact* | `responsible` | |
| `@reference@additional_data` | string | 参照試料の補足データ<br>*[reference] sample additional data* | `24.8-26.0 μΩ-cm` | 箔の電気抵抗率など、物性メモ。 |\n---

## 8. local カテゴリ (ローカル・独自拡張パラメータ枠)
共通スキーマに規定のない、各ビームラインや測定グループ独自のパラメータを、任意のKey-Value（または入れ子構造）で自由かつ無制限に定義できる「自由区画」カテゴリです。

### ■ 必須項目 (Required)
*※本カテゴリにシステム的に規定された必須項目はありません。*

### ■ 任意項目 (Optional / 自由定義エリア)
共通スキーマのバリデーションシステムにより、`local:` または `@local` 以下の階層に配置されたキーは、名前やネスト構造を問わず全てバリデーションエラーをバイパスして格納されます。

| Key名 | データ型 | 説明 (日本語 / 英語) | 記述例 | 補足・利用方法 |
| :--- | :---: | :--- | :--- | :--- |
| `@local` | object / free | 独自拡張パラメータ群のルート<br>*local custom parameters* | (下記記述例参照) | 自由なキー・バリューや入れ子構造を何でも記述できます。 |
| `@local@additional_data` | string | 測定全体のカスタム補足情報<br>*local additional data* | `additional_data: "A"` | 共通仕様の `additional_data` では収まらない特殊な補足用。 |
| `@local@condition@...` | free | 独自の制御・その場測定環境条件<br>*local custom experimental conditions* | `temperature: ramping: 10, ramping_unit: min` | 昇温プログラムのレート、セル内のガス圧、電気化学条件など。 |

#### 📝 YAML/JSONにおける記述例
以下のように、各測定ビームラインの独自パラメータを、任意の定義（Key）で階層的に整理して書き込むことができます。

```yaml
local:
  additional_data: "A"
  condition:
    temperature:
      ramping: 10
      ramping_unit: "min"
```\n