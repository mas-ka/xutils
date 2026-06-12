export class SpectrogramData {
    // コンストラクタ
    constructor() {
        this.d = 0;                 // 分光結晶のd値 [Angstrom]
        this.detId = 0;             // 検出器の素子番号
        this.version = 0;           // SpectrogramDataのバージョン番号
        this.offsetI0 = 0;          // I0のオフセット値
        this.energiesFluor = [];    // 蛍光エネルギーの配列 [eV]
        this.degrees = [];          // 分光結晶角度の配列 [degree]
        this.energiesExcite = [];    // 励起エネルギーの配列 [eV]
        this.secsReal = [];         // リアルタイム秒の配列 [sec.]
        this.secsLive = [];         // ライブタイム秒の配列 [sec.]
        this.countsI0 = [];         // I0のカウント値の配列(オフセットが引かれた)
        this.countsICR = [];        // ICRカウント値の配列
        this.dataCNT = [];          // スペクトログラムの2次元データ [count](第1添字が励起エネルギーで第2添字がそこでの蛍光エネルギー)
        this.dataCPS = [];          // スペクトログラムの2次元データ [cps](第1添字が励起エネルギーで第2添字がそこでの蛍光エネルギー)
        this.cntMax = -Infinity;   // スペクトログラムの最大値
        this.cpsMax = -Infinity;   // スペクトログラムの最大値
        this.header9809 = '';       // 9809ヘッダ
    }

    // メソッド
    getDoubleFrom2Float(f0, f1) { // 2コのfloat32をつないで1コのdouble64を返す(エンディアンはリトル)
        const view = new DataView(new ArrayBuffer(8));
        view.setFloat32(0, f0, true);
        view.setFloat32(4, f1, true);
        return view.getFloat64(0, true);
    }

    async loadFromTIFFile(file) {
        if (!file) return; // fileが空なら早期リターン

        // ファイルをArrayBufferとして読み込みUTIF.jsでTIFファイルとしてデコードする
        const arrayBuffer = await file.arrayBuffer();
        const ifds = UTIF.decode(arrayBuffer);
        UTIF.decodeImage(arrayBuffer, ifds[0]);
        const width = ifds[0].width;
        const height = ifds[0].height;

        // 9809ヘッダの取得
        this.header9809 = (ifds[0].t270)[0];

        // データのフォーマット変換
        const view = new DataView((ifds[0].data).buffer); // データビューを生成
        const float32 = new Float32Array((ifds[0].data).length / 4); // float32配列を生成
        for (let i = 0; i < float32.length; i++) // データビューから4バイト取り出してfloat32にリトルエンディアンで変換
            float32[i] = 1.0 / view.getFloat32(i * 4, true); // SpectrogramDataは逆数で格納している
        
        // フォーマット変換されたフラットなデータを2次元配列に変換する
        const dataHeadered = Array.from(
            { length: Math.ceil(float32.length / ifds[0].width) },
            (_, i) => float32.slice(i * ifds[0].width, i * ifds[0].width + ifds[0].width)
        );

        // 全体ヘッダピクセルから情報を取得する
        this.d = this.getDoubleFrom2Float(dataHeadered[0][0], dataHeadered[0][1]);
        this.detId = dataHeadered[0][2];
        this.version = dataHeadered[0][3];
        this.offsetI0 = this.getDoubleFrom2Float(dataHeadered[0][4], dataHeadered[0][5])
        this.energiesFluor = dataHeadered[0].slice(8).map(v => Math.round(v*1000)/1000)
        
        // 各励起エネルギーでのパラメータとスペクトログラム2次元データの取得
        this.degrees = Array(ifds[0].height-1);
        this.energiesExcite = Array(ifds[0].height-1);
        this.secsReal = Array(ifds[0].height-1);
        this.secsLive = Array(ifds[0].height-1);
        this.countsI0 = Array(ifds[0].height-1);
        this.countsICR = Array(ifds[0].height-1);
        this.dataCNT = Array.from(new Array(ifds[0].height-1), () => new Array(ifds[0].width-8).fill(0));
        this.dataCPS = Array.from(new Array(ifds[0].height-1), () => new Array(ifds[0].width-8).fill(0));
        dataHeadered.slice(1).forEach((row, i) => {
            this.degrees[i] = this.getDoubleFrom2Float(row[0], row[1]);
            this.energiesExcite[i] = 12398 / (2 * this.d * Math.sin(this.degrees[i] * Math.PI / 180));
            this.secsReal[i] = row[2];
            this.secsLive[i] = row[3];
            this.countsI0[i] = Math.round(this.getDoubleFrom2Float(row[4], row[5]) * 1000) / 1000;
            this.countsICR[i] = Math.round(this.getDoubleFrom2Float(row[6], row[7]) * 1000) / 1000;
            row.slice(8).forEach((v, j) => {
                this.dataCNT[i][j] = Math.round(v * 1000) / 1000;
                this.dataCPS[i][j] = this.dataCNT[i][j] / this.secsReal[i];
            });
        });
        this.cntMax = (this.dataCNT).reduce((maxVal, row) => { return Math.max(maxVal, ...row); }, -Infinity);
        this.cpsMax = (this.dataCPS).reduce((maxVal, row) => { return Math.max(maxVal, ...row); }, -Infinity);
    }
}
