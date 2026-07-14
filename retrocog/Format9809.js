// 9809形式を扱うためのexportライブラリ
// ファイルが適正な9809かどうかを表す疑似Enum
export const CORRECTNESS = Object.freeze({
    CANONICAL: 'CANONICAL',
    PARTIALLY: 'PARTIALLY',
    NOT9809: 'NOT9809'
});


// ファイルが9809形式かどうか判定
export async function is9809File(file) {
    try {
        const buffer = await (file.slice(0, 11)).arrayBuffer();
        const text = new TextDecoder().decode(new Uint8Array(buffer));
        if (text === '  9809     ') return CORRECTNESS.CANONICAL
        else if (text.trim() === '9809') return CORRECTNESS.PARTIALLY
        else return CORRECTNESS.NOT9809
    } catch (error) {
        return CORRECTNESS.NOT9809
    }
}

// 9809形式のファイルを取り扱うクラス
export class File9809 {
    // コンストラクタ
    constructor() {
        // 列挙型


        // メンバ変数
        this.allText = '';
        this.headerText = '';
        this.blockText = '';
        this.dataHeaderText = '';
        this.dataBody = [];
        this.mono = '';
        this.d = 0;                 // 分光結晶のd値 [Angstrom]
        this.detType = ''; // 測定種別[TRANS, FLUOR]
        this.idx1stIC = 0;
        this.ColsNum = []; // チャート描画列選択セレクトNumeratorのアイテム
        this.ColsDen = []; // チャート描画列選択セレクトDenominatorのアイテム
        this.dataArray = [];
        this.blockArray = []; // Block構造における開始エネルギー[keV]を保持する配列
    }

    // メソッド
    async loadFrom9809File(file) {
        const DETTYPE = Object.freeze({
            TRANS: 'TRANS',
            FLUOR: 'FLUOR'
        });

        if (!file) return; // fileが空なら早期リターン

        // 最初に全文読んじゃう
        this.allText = await file.text()

        // ヘッダーとデータの分割
        const lines = this.allText.split(/\n/)
        const dataLineNum = (lines
            .map((line, index) => line.includes('Angle(c)') ? index : -1)
            .filter(lineNum => lineNum != -1)
            .at(-1)) - 1
        if (dataLineNum === undefined) return // 9809形式ではなかった
        this.dataHeaderText = lines.slice(dataLineNum, dataLineNum + 4).join('\n').trimEnd() // データヘッダの抽出
        // データ部に表示するテーブル用のデータ配列生成
        const arr = lines.slice(dataLineNum + 4)
        this.dataBody = []
        for (let i = 0; i < arr.length; i++) {
            const obj = {}
            obj['index'] = i
            obj['data'] = arr[i].trimEnd()
            this.dataBody.push(obj)
        }

        // ヘッダをヘッダとブロックに分割
        const blockLineNum = (lines
            .map((line, index) => line.startsWith(' Block') ? index : -1)
            .filter(lineNum => lineNum != -1)
            .at(-1))
        this.headerText = lines.slice(0, blockLineNum).join('\n').trimEnd()
        this.blockText = lines.slice(blockLineNum, dataLineNum).join('\n').trimEnd()

        // Blockテキストから各ブロックの開始エネルギーを取得
        const blockTexts = this.blockText.trim().split(/\r?\n/)
        const isBlockAsEng = ('INIT-ENG' === (blockTexts[0].trim().split(/\s+/))[1].toUpperCase())
        // fileBlock.valueの行数から測定手法を推定する
        if (2 == blockTexts.length) {// Quick測定と推定
            this.blockArray = [] // ブロック構造は表示しないので空にしておく
        } else {  // Step測定であると推定
            this.blockArray = [] // 一旦空にする
            for (let i = 2; i < blockTexts.length; i++) {
                const data = blockTexts[i].trim().split(/\s+/)
                const iniE = isBlockAsEng ? data[1] : theta2energy(data[1], this.d)
                this.blockArray.push(iniE / 1000.0)
            }
        }
        console.log("BlockArray", this.blockArray)

        // 分光結晶情報の取得
        const MonoLine = (this.headerText).split(/\n/)
            .map((line, index) => (line.trim().startsWith('Mono')) > 0 ? line : '')
            .filter(line => line != '')
            .at(-1)
        if (MonoLine === undefined) return
        this.mono = (MonoLine.match(/Mono\s:(.*)D/))[1].trim()
        this.d = ((MonoLine.match(/D=([^A].*)A/))[1].trim()) * 1.0

        // データ部Mode行から測定種別を推定する
        if (1 == (((this.dataHeaderText).trim().split(/\n/))[2].trim().split(/\s+/))[3]) { // Mode行の最初の検出器が「1」
            this.detType = DETTYPE.TRANS
        } else { // Mode行の最初の検出器が「1」以外
            this.detType = DETTYPE.FLUOR
        }

        this.idx1stIC = ((this.dataHeaderText).trim().split(/\n/))[2].trim().split(/\s+/)
            .map((v, i) => (v == '1') ? i : -1)
            .filter(v => v > 0)
            .at(0) // 最初に見つかった検出器「1」のインデックス

        // Numerator/Denominator選択プルダウンの生成
        const Channels = ((this.dataHeaderText).trim().split(/\n/))[1].trim().split(/\s+/).slice(3)
        const Modes = ((this.dataHeaderText).trim().split(/\n/))[2].trim().split(/\s+/).slice(3)
        this.ColsNum = Channels.map((v, i) => ({
            value: i + 4,
            title: (i + 4) + ' (Ch:' + v + ', Mode: ' + Modes[i] + ')'
        }))
        this.ColsNum = [{ value: 0, title: '-- (  1.0  )' }].concat(this.ColsNum)
        this.ColsDen = this.ColsNum

        // データ部から実際の測定データを抽出して配列にぶち込む
        // this.dataArray = arr.map((line, index) => {
        //                             const a = line.trim().split(/\s+/).map((v) => v*1.0)
        //                             // データ各行のAngleをEnergyに置換する
        //                             a[0] = 12.398 / (2.0 * this.d * Math.sin(a[0]*Math.PI/180))
        //                             a[1] = 12.398 / (2.0 * this.d * Math.sin(a[1]*Math.PI/180))
        //                             return a
        //                     })
        this.dataArray = arr.map((line, index) => {
            const a = line.trim().split(/\s+/).map((v) => v * 1.0)
            return [
                // データ各行にEnergyに追加する
                12.398 / (2.0 * this.d * Math.sin(a[0] * Math.PI / 180)),
                12.398 / (2.0 * this.d * Math.sin(a[1] * Math.PI / 180))
            ].concat(a)
        })
    }
}