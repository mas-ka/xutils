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

    // JXS XAFSメタデータ共通仕様（20230203版）準拠のYAMLを生成
    generateMetadataYAML(fileName) {
        // パスを除去して純粋なファイル名からベース名と拡張子を取得
        const cleanName = (fileName || 'data.dat').split(/[/\\]/).pop();
        const lastDot = cleanName.lastIndexOf('.');
        const baseName = lastDot > 0 ? cleanName.substring(0, lastDot) : cleanName;
        const ext = lastDot > 0 ? cleanName.substring(lastDot + 1) : 'dat';

        // 1. data_info
        const today = new Date().toISOString().split('T')[0];

        // 2. facility
        let facilityName = '';
        let beamline = '';
        const lines = this.headerText.split(/\r?\n/);
        if (lines.length > 0) {
            const firstLineTokens = lines[0].trim().split(/\s+/);
            if (firstLineTokens.length >= 3) {
                facilityName = firstLineTokens[1];
                beamline = firstLineTokens[2];
            } else if (firstLineTokens.length === 2) {
                facilityName = firstLineTokens[1];
            }
        }
        // KEK-PF 正規化
        if (facilityName === 'KEK-PF' || facilityName === 'PF') {
            facilityName = 'Photon Factory';
        }

        // Ring情報
        let ringInfo = null;
        for (const line of lines) {
            const match = line.match(/Ring\s*:\s*([\d.]+)\s*GeV\s*([\d.]+)\s*mA\s*-\s*([\d.]+)\s*mA/i);
            if (match) {
                ringInfo = {
                    energy: parseFloat(match[1]),
                    energy_unit: 'GeV',
                    start_current: parseFloat(match[2]),
                    start_current_unit: 'mA',
                    end_current: parseFloat(match[3]),
                    end_current_unit: 'mA'
                };
                break;
            }
        }

        // 3. files
        // headerlines の計算: ファイル先頭から「Offset」行（実データ開始直前の行）までの行数
        const allLines = this.allText.split(/\r?\n/);
        let headerLinesCount = 0;
        for (let i = 0; i < allLines.length; i++) {
            if (allLines[i].includes('Offset')) {
                headerLinesCount = i + 1; // 1-indexedの行数
                break;
            }
        }
        if (headerLinesCount === 0) {
            const angleIdx = allLines.findIndex(l => l.includes('Angle(c)'));
            if (angleIdx !== -1) {
                headerLinesCount = angleIdx + 3;
            }
        }

        // 4. instrument
        let crystalMaterial = 'Si';
        let crystalPlane = '111';
        let crystalD = this.d || 3.13551;
        let crystalDUnit = 'angstrom';

        for (const line of lines) {
            const monoMatch = line.match(/Mono\s*:\s*([A-Za-z]+)\s*\(([^)]+)\)\s*D=\s*([\d.]+)\s*([A-Za-z]+)/i);
            if (monoMatch) {
                const matRaw = monoMatch[1].trim();
                crystalMaterial = matRaw.charAt(0).toUpperCase() + matRaw.slice(1).toLowerCase();
                crystalPlane = monoMatch[2].trim();
                crystalD = parseFloat(monoMatch[3]);
                const unitRaw = monoMatch[4].trim();
                crystalDUnit = (unitRaw.toUpperCase() === 'A' || unitRaw.toLowerCase() === 'angstrom') ? 'angstrom' : unitRaw.toLowerCase();
                break;
            }
        }

        // 5. measurement
        let startTime = '';
        let endTime = '';
        if (lines.length > 1) {
            // 2行目の日時マッチング: YY.MM.DD HH:mm - YY.MM.DD HH:mm
            const dateMatch = lines[1].match(/(\d{2,4})[./-](\d{2})[./-](\d{2})\s+(\d{2}:\d{2}(?::\d{2})?)\s*-\s*(\d{2,4})[./-](\d{2})[./-](\d{2})\s+(\d{2}:\d{2}(?::\d{2})?)/);
            if (dateMatch) {
                const formatYear = (yStr) => {
                    if (yStr.length === 4) return yStr;
                    const y = parseInt(yStr, 10);
                    return (y >= 80 ? 1900 + y : 2000 + y).toString();
                };
                const formatTime = (tStr) => (tStr.split(':').length === 2 ? tStr + ':00' : tStr);
                startTime = `${formatYear(dateMatch[1])}-${dateMatch[2]}-${dateMatch[3]} ${formatTime(dateMatch[4])}`;
                endTime = `${formatYear(dateMatch[5])}-${dateMatch[6]}-${dateMatch[7]} ${formatTime(dateMatch[8])}`;
            }
        }

        // Points
        let dataPoints = this.dataBody ? this.dataBody.length : 0;
        for (const line of lines) {
            const pointsMatch = line.match(/Points\s*=\s*(\d+)/i);
            if (pointsMatch) {
                dataPoints = parseInt(pointsMatch[1], 10);
                break;
            }
        }

        // Block count
        let blockCount = 1;
        if (this.blockText) {
            const bLines = this.blockText.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
            if (bLines.length > 1) {
                blockCount = bLines.length - 1; // ヘッダ行を除く
            }
        }

        // YAMLの組み立て
        let yml = `data_info:\n`;
        yml += `  deposite_time:\n`;
        yml += `    create_time: "${today}"\n`;
        yml += `  metadata_format:\n`;
        yml += `    version: XAFS.20230203\n`;

        yml += `facility:\n`;
        yml += `  name: ${facilityName}\n`;
        if (beamline) {
            yml += `  beamline: ${beamline}\n`;
        }
        if (ringInfo) {
            yml += `  ring:\n`;
            yml += `    energy: ${ringInfo.energy}\n`;
            yml += `    energy_unit: ${ringInfo.energy_unit}\n`;
            yml += `    start_current: ${ringInfo.start_current}\n`;
            yml += `    start_current_unit: ${ringInfo.start_current_unit}\n`;
            yml += `    end_current: ${ringInfo.end_current}\n`;
            yml += `    end_current_unit: ${ringInfo.end_current_unit}\n`;
        }

        yml += `files:\n`;
        yml += `- file:\n`;
        yml += `  - name: ${baseName}\n`;
        yml += `  description: experimental\n`;
        yml += `  extension: ${ext}\n`;
        yml += `  format: 9809\n`;
        yml += `  headerlines: ${headerLinesCount}\n`;

        yml += `instrument:\n`;
        yml += `  monochromator:\n`;
        yml += `    detail:\n`;
        yml += `      crystal_material: ${crystalMaterial}\n`;
        yml += `      crystal_plane: "${crystalPlane}"\n`;
        yml += `      crystal_d: ${crystalD}\n`;
        yml += `      crystal_d_unit: ${crystalDUnit}\n`;

        yml += `measurement:\n`;
        if (startTime || endTime) {
            yml += `  measured_time:\n`;
            if (startTime) yml += `    start_time: "${startTime}"\n`;
            if (endTime) yml += `    end_time: "${endTime}"\n`;
        }
        yml += `  section:\n`;
        yml += `    number: ${blockCount}\n`;
        yml += `    data_points: ${dataPoints}\n`;

        return yml;
    }
}