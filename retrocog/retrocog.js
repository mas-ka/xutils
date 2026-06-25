import { createApp, ref, onMounted, nextTick} from 'vue'
import { createVuetify } from 'vuetify'

import { is9809File, File9809, CORRECTNESS } from './Format9809.js'

createApp({
    setup() {
        // refの宣言
        const numLoaded = ref(0)
        const currFileName = ref('not loaded')
        const currFileIdx = ref(-1)
        const FileNums = ref(0)
        const files = ref()
        const fileNames = ref()
        const filesDrop = ref()
        const isCorrect9809 = ref(true)
        const fInput = ref('') // ファイルインプットのリファレンス
        const isDragging = ref(false)
        const fileHeader = ref('')
        const fileBlock = ref('')
        const fileDataHeader = ref('')
        const fileDataBody = ref([])
        const Numerator = ref('')
        const Denominator = ref('')
        const ColsNum = ref([])
        const ColsDen = ref([])
        const applyLn = ref(true)
        const isAxisInEnergy = ref(true)
        // その他
        const licenseHTML = ref('')
        const license_dialog = ref(false)

        // ローカルの宣言
        let curr9809File = new File9809()

        // 関数
        // チャートの描画
        const drawChart = (data) => {
            // データの定義
            const gdata = [{
                    //x : data.map((a) => a[1]), // カラムは「E(c) E(o) A(c) A(o) T D ...」
                    x : data.map((a) => a[isAxisInEnergy.value ? 1 : 3]),
                    y : data.map((a) => {
                    const N = (Numerator.value == 0) ? 1.0 : a[Numerator.value+1]
                    const D = (Denominator.value == 0) ? 1.0 : a[Denominator.value+1]
                    if (applyLn.value) {
                        return Math.log( N / D )
                    } else {
                        return ( N / D )
                    }
                }),
                type : 'line'
            }]
            // レイアウトの定義
            let layout = {
                title: {
                    text: currFileName.value + (applyLn.value?'  Ln':'  ') + '(' + Numerator.value + '/' + Denominator.value + ')',
                    font: {
                        size: 14
                    }
                },
                //height: 360,
                xaxis: {
                    title: {
                        text: isAxisInEnergy.value ? 'Energy(o) [keV]' : 'Angle(o) [deg.]',
                    },
                    showline: true,
                    mirror: true,
                    linewidth: 2,
                    tickformat: '.4f',
                    autorange: isAxisInEnergy.value ? 'true' : 'reversed',
                },
                yaxis: {
                    showline: true,
                    mirror: true,
                    linewidth: 2,
                },
                margin: {
                    t: 36 // 上マージンを100ピクセルに設定
                }
            }
            // グラフの描画(※DOMの更新を待ってから描画するためにnextTickでラップしないと初回描画の横幅がおかしくなる)
            nextTick(() => {
                Plotly.newPlot('myGraph', gdata, layout, {responsive : true})
            })
        }
        
        // データ列選択セレクタの変更時
        const handleSwitch = (newValue) => {
            isAxisInEnergy = newValue
            drawChart(curr9809File.dataArray)
        }

        // Ｘ軸スイッチ左の<span>Angle(o)</span>クリック
        const onClickAngle = () => {
            if (numLoaded.value < 1) return
            if (isAxisInEnergy.value) {
                isAxisInEnergy.value = false
                handleSelect()
            }
        }

        // Ｘ軸スイッチ右の<span>Energy(o)</span>クリック
        const onClickEnergy = () => {
            if (numLoaded.value < 1) return
            if (!isAxisInEnergy.value) {
                isAxisInEnergy.value = true
                handleSelect()
            }
        }
        
        // Ｘ軸スイッチの変更時
        const handleSelect = () => {
            drawChart(curr9809File.dataArray)
        }

        // 現在のIdxのファイルを読み込む
        const loadCurrFileFromIdx = async () => {
            currFileName.value = fileNames.value[currFileIdx.value]
            if (await is9809File(files.value[currFileIdx.value]) === CORRECTNESS.CANONICAL) {
                isCorrect9809.value = true
            } else {
                isCorrect9809.value = false
            }
            await curr9809File.loadFrom9809File(files.value[currFileIdx.value])
            fileHeader.value = curr9809File.headerText
            fileBlock.value = curr9809File.blockText
            fileDataHeader.value = curr9809File.dataHeaderText
            fileDataBody.value = curr9809File.dataBody
            if (curr9809File.detType === 'TRANS') {
                Numerator.value = 4
                Denominator.value = 5
                applyLn.value = true
            } else {
                Numerator.value = 4
                Denominator.value = 1 + curr9809File.idx1stIC
                applyLn.value = false
            }
            ColsNum.value = curr9809File.ColsNum
            ColsDen.value = curr9809File.ColsDen
            numLoaded.value++
            drawChart(curr9809File.dataArray)
        }

        // 最初のファイルを読み込む
        const firstFile = () => {
            currFileIdx.value = 0
            loadCurrFileFromIdx()
        }

        // １つ前のファイルを読み込む
        const prevFile = () => {
            if (currFileIdx.value > 0) {
                currFileIdx.value--
                loadCurrFileFromIdx()
            }
        }

        // １つ次のファイルを読み込む
        const nextFile = () => {
            if (currFileIdx.value < FileNums.value-1) {
                currFileIdx.value++
                loadCurrFileFromIdx()
            }
        }

        // 最後のファイルを読み込む
        const lastFile = () => {
            currFileIdx.value = FileNums.value-1
            loadCurrFileFromIdx()
        }
            


        // ファイルロードボタン押下によるファイルインプットの代理発火
        const triggerFileInput = (event) => {
            fInput.value.click()
        }
        
        // ファイルインプットでのファイル選択時のハンドラ
        const onFileChange = async (event) => {
            if (event.target.files.length < 1) return // キャンセルされた場合には早期リターン
            // 選択されたファイルをソート
            const files4File = []
            for (let i = 0 ; i < event.target.files.length ; i++) {
                files4File.push(event.target.files[i])
            }
            files4File.sort((a, b) => a.name.localeCompare(b.name))
            // ソート済みのものに対して検証
            files.value = {}
            fileNames.value = []
            for (let i = 0, j = 0 ; i < files4File.length ; i++) {
                if ((await is9809File(files4File[i])) != CORRECTNESS.NOT9809) {
                    fileNames.value.push(files4File[i].name)
                    files.value[j++] = files4File[i]
                }
            }
            files.value.length = Object.keys(files.value).length
            if (files.value.length < 1) return // チェックをくぐり抜けたファイルがゼロならリターン

            FileNums.value = files.value.length
            currFileIdx.value = 0

            loadCurrFileFromIdx()
        }

        // ファイルドロップ時のハンドラ
        const onDropFiles = async (event) => {
            isDragging.value = false
            
            const items = event.dataTransfer.items
            const droppedFiles = []

            // ディレクトリトラバース関数
            const traverseFileTree = async (item, path = '') => {
                if (item.isFile) {
                    const file = await new Promise((resolve) => item.file(resolve))
                    if ((await is9809File(file)) != CORRECTNESS.NOT9809) {
                        fileNames.value.push(`${path}${file.name}`)
                        droppedFiles.push(file)
                    }
                } else if (item.isDirectory) {
                    const dirReader = item.createReader()
                    let entries = await new Promise((resolve) => dirReader.readEntries(resolve))
                    // ディレクトリ内のエントリをソートしてフォルダを後回しにする
                    const entries4File = []
                    const entries4Dir = []
                    for (let i = 0; i < entries.length; i++) {
                        const item = entries[i];
                        if (item.isFile) entries4File.push(item)
                        else if (item.isDirectory) entries4Dir.push(item)
                    }
                    entries4File.sort((a, b) => a.name.localeCompare(b.name))
                    entries4Dir.sort((a, b) => a.name.localeCompare(b.name))
                    entries = entries4File.concat(entries4Dir)
                    // 順序入れ替えを行った後のディレクトリ内エントリを再帰呼び出しする
                    for (let j = 0 ; j < entries.length ; j++) {
                        await traverseFileTree(entries[j], `${path}${item.name}/`)
                    }
                }
            }
            // ドロップされたアイテムを展開
            // event.dataTransfer.items（DataTransferItemList）は、
            // ブラウザの仕様によりドロップイベントのハンドラ（同期処理）が終了するか、
            // 次の非同期マクロタスクに移った時点でクリア（データが消去）される
            // という厳格なライフサイクルを持っています。
            if (items) { // 【重要】await を呼ぶ前に、同期処理で Entry オブジェクトをすべて配列にコピーする
                let entriesToProcess = []
                for (let i = 0; i < items.length; i++) {
                    const entry = items[i].webkitGetAsEntry();
                    if (entry) {
                        entriesToProcess.push(entry)
                    }
                }

                // ファイルをソートし、フォルダを後ろに回す
                const entriesToProcess4File = []
                const entriesToProcess4Dir = []
                for (let i = 0; i < entriesToProcess.length; i++) {
                    const item = entriesToProcess[i];
                    if (item.isFile) {
                        entriesToProcess4File.push(item)
                    } else if (item.isDirectory) {
                        entriesToProcess4Dir.push(item)
                    }
                }
                entriesToProcess4File.sort((a, b) => a.name.localeCompare(b.name))
                entriesToProcess4Dir.sort((a, b) => a.name.localeCompare(b.name))
                entriesToProcess = entriesToProcess4File.concat(entriesToProcess4Dir)

                // コピーした配列を使って、安全に非同期（await）のループを回す
                fileNames.value = []
                for (let i = 0; i < entriesToProcess.length; i++) {
                    const item = entriesToProcess[i];
                    if (item.isFile) {
                        const file = await new Promise((resolve) => item.file(resolve))
                        if ((await is9809File(file)) != CORRECTNESS.NOT9809) {
                            fileNames.value.push(file.name)
                            droppedFiles.push(file)
                        }
                    } else if (item.isDirectory) {
                        await traverseFileTree(item);
                    }
                }
                // FileListに変換
                files.value = {}
                for (let i = 0 ; i < droppedFiles.length ; i++) {
                    files.value[i] = droppedFiles[i]
                }
                files.value.length = Object.keys(files.value).length
            }
            if (files.value.length < 1) return // チェックをくぐり抜けたファイルがゼロならリターン

            FileNums.value = files.value.length
            currFileIdx.value = 0

            loadCurrFileFromIdx()
        }

        // マウント時の処理
        onMounted(async () => {
            numLoaded.value = 0
            // ライセンス表示用HTMLの読み込み
            try {
                const res = await fetch('./license.html')
                licenseHTML.value = await res.text()
                console
            } catch (error) {
                licenseHTML.value = '<p></p>'
            }
        })

        return {
            numLoaded, currFileName, currFileIdx, FileNums, fInput, isDragging, isCorrect9809,
            fileHeader, fileBlock, fileDataHeader, fileDataBody, 
            triggerFileInput, onFileChange, onDropFiles,
            firstFile, prevFile, nextFile, lastFile,
            Numerator, Denominator, ColsNum, ColsDen, applyLn, 
            handleSelect, isAxisInEnergy, handleSwitch, onClickAngle, onClickEnergy,
            licenseHTML, license_dialog,
        }
    }
}).use(createVuetify()).mount('#app')