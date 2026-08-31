import { createApp, ref, onMounted, nextTick } from 'vue'
import { createVuetify } from 'vuetify'

import { is9809File, File9809, CORRECTNESS } from './Format9809.js'
import { elements, getElementByName } from './elements.js'

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
        const showDevider = ref(false)
        const isAxisInEnergy = ref(true)
        // その他
        const license_dialog = ref(false)
        const aboutTab = ref('overview')
        const appLicenseText = ref('Loading LICENSE...')
        const exportAgenda_dialog = ref(false)
        const elementList = ref(elements)
        const selectedElement = ref(null)
        const selectedEdge = ref('K')
        const showHelp = ref(false)
        const hasHelp = ref(false)
        const helpContent = ref('')

        // オープンソースライセンス一覧
        const ossLicenses = [
            {
                name: 'Vue.js',
                version: '3.x',
                license: 'MIT License',
                copyright: 'Copyright (c) 2018-present Yuxi (Evan) You',
                text: `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`
            },
            {
                name: 'Vuetify',
                version: '3.12.6',
                license: 'MIT License',
                copyright: 'Copyright (c) 2016-2024 John Jeremy Leider',
                text: `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`
            },
            {
                name: 'Plotly.js',
                version: '3.6.0',
                license: 'MIT License',
                copyright: 'Copyright (c) 2016-2024 Plotly Technologies Inc.',
                text: `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`
            },
            {
                name: 'Material Design Icons',
                version: '5.x / 7.x (@mdi/font)',
                license: 'Apache 2.0 / SIL OFL 1.1',
                copyright: 'Copyright (c) Pictogrammers',
                text: 'Icons licensed under Apache License 2.0. Fonts licensed under SIL Open Font License 1.1.'
            },
            {
                name: 'Google Fonts (Noto Serif, Roboto Mono)',
                version: 'Web Fonts',
                license: 'SIL OFL 1.1 / Apache 2.0',
                copyright: 'Copyright (c) Google LLC',
                text: 'Noto Serif licensed under SIL Open Font License 1.1. Roboto Mono licensed under Apache License 2.0.'
            }
        ]

        // ローカルの宣言
        let curr9809File = new File9809()

        // ユーティリティ関数
        const energy2theta = function (e, d) { return Math.toDegrees(Math.asin(12398.4264684 / (2 * d * e))); }
        const theta2energy = function (t, d) { return 12398.4264684 / (2 * d * Math.sin(Math.toRadians(t))); }
        Math.toDegrees = function (radian) {
            var toDegree = 180 / Math.PI;
            if (isNaN(radian)) return NaN;
            return radian * toDegree;
        }
        Math.toRadians = function (degree) {
            return isNaN(degree) ? NaN : degree * Math.PI / 180;
        }
        String.formatF = function (f, w, d) {
            var z = Array(d + 1).join("0");
            var y = "" + f + ((("" + f).indexOf('.') < 0) ? "." + z : z);
            var t = "." + (y.split('\.'))[1].substr(0, d);
            if (Math.abs(f) < 1) {
                return Array(w - (y.split('\.'))[0].length - t.length + 2).join(" ") + (f < 0 ? "-" : "") + t;
            } else {
                return Array(w - (y.split('\.'))[0].length - t.length + 1).join(" ") + (y.split('\.'))[0] + t;
            }
        }
        String.formatI = function (i, w) {
            return Array(w - ("" + i).length + 1).join(" ") + i;
        }

        // チャートの描画
        const drawChart = (data) => {
            // Block構造を描画するためのshapesを生成する。
            const BlockLines = curr9809File.blockArray.map((val) => {
                return {
                    type: 'line',
                    xref: 'x',
                    yref: 'paper',
                    x0: isAxisInEnergy.value ? val : energy2theta(val * 1000, curr9809File.d),
                    x1: isAxisInEnergy.value ? val : energy2theta(val * 1000, curr9809File.d),
                    y0: 0,
                    y1: 1,
                    line: {
                        color: 'grey',
                        width: 1,
                        dash: 'dash'
                    }
                }
            })
            // データの定義
            const gdata = [{
                //x : data.map((a) => a[1]), // カラムは「E(c) E(o) A(c) A(o) T D ...」
                x: data.map((a) => a[isAxisInEnergy.value ? 1 : 3]),
                y: data.map((a) => {
                    const N = (Numerator.value == 0) ? 1.0 : a[Numerator.value + 1]
                    const D = (Denominator.value == 0) ? 1.0 : a[Denominator.value + 1]
                    if (applyLn.value) {
                        return Math.log(N / D)
                    } else {
                        return (N / D)
                    }
                }),
                type: 'line'
            }]
            // レイアウトの定義
            let layout = {
                title: {
                    text: currFileName.value + (applyLn.value ? '  Ln' : '  ') + '(' + Numerator.value + '/' + Denominator.value + ')',
                    font: {
                        size: 14
                    }
                },
                shapes: showDevider.value ? BlockLines : [],
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
                Plotly.newPlot('myGraph', gdata, layout, { responsive: true })
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
            if (currFileIdx.value < FileNums.value - 1) {
                currFileIdx.value++
                loadCurrFileFromIdx()
            }
        }

        // 最後のファイルを読み込む
        const lastFile = () => {
            currFileIdx.value = FileNums.value - 1
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
            for (let i = 0; i < event.target.files.length; i++) {
                files4File.push(event.target.files[i])
            }
            files4File.sort((a, b) => a.name.localeCompare(b.name))
            // ソート済みのものに対して検証
            files.value = {}
            fileNames.value = []
            for (let i = 0, j = 0; i < files4File.length; i++) {
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
                    for (let j = 0; j < entries.length; j++) {
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
                for (let i = 0; i < droppedFiles.length; i++) {
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

        // 与えられたエレメントとエッジから出力するAgenda文字列を生成する
        const generateAgenda = (element, edge) => {
            // 選択されたエレメントとエッジから、エッジエネルギーを求める。
            const edgeEnergy = (getElementByName(element))[edge]
            // 出力するAgendaファイルのうち、共通する部分を作っておく
            var l = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>\r\n";
            l += "<parameter>\r\n";
            l += "  <monochrometer>\r\n";
            l += "    <d_spacing unit=\"angstrom\">" + String.formatF(curr9809File.d, 10, 6).trim() + "</d_spacing>\r\n";
            l += "    <name>" + curr9809File.mono.trim().toUpperCase() + "</name>\r\n";
            l += "  </monochrometer>\r\n";
            l += "  <element>\r\n";
            l += "    <symbol>" + selectedElement.value + "</symbol>\r\n";
            l += "    <edge>" + selectedEdge.value + "</edge>\r\n";
            l += "  </element>\r\n";
            // ここから export Agenda の処理を実装
            // Blockヘッダから記述単位がEngかAngか判定する
            const blockArray = fileBlock.value.trim().split(/\r?\n/)
            const isBlockAsEng = ('INIT-ENG' === (blockArray[0].trim().split(/\s+/))[1].toUpperCase())
            // fileBlock.valueの行数から測定手法を推定する
            if (2 == blockArray.length) { // Quick測定であると推定
                l += "  <scan type=\"quick\">\r\n";
                l += "    <edge_energy unit=\"eV\">" + String.formatF(edgeEnergy, 10, 2).trim() + "</edge_energy>\r\n";
                // １つしかないBlockデータ行を連続する空白文字で分割した配列を作る
                const dataArray = blockArray[1].trim().split(/\s+/)
                const iniEnergy = isBlockAsEng ? dataArray[1] : theta2energy(dataArray[1], curr9809File.d)
                const finalEnergy = isBlockAsEng ? dataArray[2] : theta2energy(dataArray[2], curr9809File.d)
                const time = dataArray[4]
                const num = dataArray[5]
                const s4q = theta2energy((energy2theta(edgeEnergy, curr9809File.d)
                    - (energy2theta(iniEnergy, curr9809File.d) - energy2theta(finalEnergy, curr9809File.d)) / (num - 1)), curr9809File.d) - edgeEnergy
                const t4q = Math.trunc((time < 1.0) ? time * (num - 1) : time)
                l += "    <agenda final=\"" + String.formatF(finalEnergy, 10, 2).trim()
                    + "\" step_for_quick=\"" + String.formatF(s4q, 10, 5).trim()
                    + "\" time_for_quick=\"" + t4q + "\" unit=\"eV\">\r\n";
                l += "      <block id=\"1\">\r\n";
                l += "        <ini>" + String.formatF(iniEnergy, 10, 2).trim() + "</ini><div>50</div><sec>1</sec>\r\n";
                l += "      </block>\r\n";
            } else { // Step測定であると推定
                l += "  <scan type=\"step\">\r\n";
                l += "    <edge_energy unit=\"eV\">" + String.formatF(edgeEnergy, 10, 2).trim() + "</edge_energy>\r\n";
                // 最終行から各パラメータを求める
                const dataArray = blockArray[blockArray.length - 1].trim().split(/\s+/)
                const finalEnergy = isBlockAsEng ? dataArray[2] : theta2energy(dataArray[2], curr9809File.d)
                l += "    <agenda final=\"" + String.formatF(finalEnergy, 10, 2).trim() + "\" step_for_quick=\".36384\" time_for_quick=\"120\" unit=\"eV\">\r\n";
                // 残りブロックを出力
                for (let i = 1; i < blockArray.length; i++) {
                    const dataArray = blockArray[i].trim().split(/\s+/)
                    const iniEnergy = isBlockAsEng ? dataArray[1] : theta2energy(dataArray[1], curr9809File.d)
                    l += "      <block id=\"" + i + "\">\r\n";
                    l += "        <ini>" + String.formatF(iniEnergy, 10, 2).trim() + "</ini><div>" + dataArray[5] + "</div><sec>" + dataArray[4] + "</sec>\r\n";
                    l += "      </block>\r\n";
                }
            }
            l += "    </agenda>\r\n";
            l += "  </scan>\r\n";
            l += "</parameter>\r\n";
            return l
        }

        // Export AgendaダイアログのOKボタン押下時の処理
        const onClickExportAgendaOK = () => {
            // 選択されたエレメント・エッジを引数として、Agenda文字列を生成する
            const agendaStr = generateAgenda(selectedElement.value, selectedEdge.value)
            // ダイアログを閉じる
            exportAgenda_dialog.value = false
            // ファイルとして保存する
            // 拡張子の付け替え
            let fileName = currFileName.value
            const match = fileName.match(/(.+)\.([^.]+)$/)
            if (match) {
                fileName = match[1] + '.agenda'
            } else {
                fileName = fileName + '.agenda'
            }
            // 保存ダイアログの呼び出しとダウンロード
            const blob = new Blob([agendaStr], { type: 'text/plain;charset=utf-8' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            URL.revokeObjectURL(link.href)
        }

        // サムネイル画像のエクスポート処理
        const onClickExportThumbnail = async () => {
            if (numLoaded.value < 1) return

            // パスが含まれている場合は末尾のファイル名のみを抽出
            const rawFileName = currFileName.value.split(/[/\\]/).pop()
            let baseName = rawFileName
            const lastDotIdx = baseName.lastIndexOf('.')
            if (lastDotIdx > 0) {
                baseName = baseName.substring(0, lastDotIdx)
            }
            const exportFileName = `${baseName}_thumbnail.png`

            const thumbData = [{
                x: curr9809File.dataArray.map((a) => a[1] * 1000.0),
                y: curr9809File.dataArray.map((a) => {
                    const N = (Numerator.value == 0) ? 1.0 : a[Numerator.value + 1]
                    const D = (Denominator.value == 0) ? 1.0 : a[Denominator.value + 1]
                    if (applyLn.value) {
                        return Math.log(N / D)
                    } else {
                        return (N / D)
                    }
                }),
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: '#1f77b4',
                    width: 2.5
                }
            }]

            const yAxisTitle = applyLn.value ? 'μT' : 'Intensity [arb. unit]'

            const thumbLayout = {
                title: {
                    text: baseName,
                    font: {
                        size: 32
                    },
                    y: 0.96
                },
                width: 1280,
                height: 1280,
                plot_bgcolor: '#ffffff',
                paper_bgcolor: '#ffffff',
                xaxis: {
                    title: {
                        text: 'Energy [eV]',
                        font: { size: 28 }
                    },
                    tickfont: { size: 22 },
                    ticks: 'outside',
                    tickwidth: 2,
                    ticklen: 8,
                    showline: true,
                    mirror: true,
                    linewidth: 2,
                    showgrid: false,
                    zeroline: false,
                    autorange: true,
                    tickformat: 'd'
                },
                yaxis: {
                    title: {
                        text: yAxisTitle,
                        font: { size: 28 }
                    },
                    tickfont: { size: 22 },
                    ticks: 'outside',
                    tickwidth: 2,
                    ticklen: 8,
                    showline: true,
                    mirror: true,
                    linewidth: 2,
                    showgrid: false,
                    zeroline: false,
                    autorange: true
                },
                margin: {
                    t: 90,
                    b: 110,
                    l: 120,
                    r: 60
                }
            }

            try {
                const dataUrl = await Plotly.toImage({
                    data: thumbData,
                    layout: thumbLayout
                }, {
                    format: 'png',
                    width: 1280,
                    height: 1280
                })

                const link = document.createElement('a')
                link.href = dataUrl
                link.download = exportFileName
                link.click()
            } catch (error) {
                console.error('Failed to export thumbnail:', error)
            }
        }

        // 9809メタデータYAMLのエクスポート処理
        const onClickExportMetadataYAML = () => {
            if (numLoaded.value < 1) return

            // パスが含まれている場合は末尾のファイル名のみを抽出
            const rawFileName = currFileName.value.split(/[/\\]/).pop()
            let baseName = rawFileName
            const lastDotIdx = baseName.lastIndexOf('.')
            if (lastDotIdx > 0) {
                baseName = baseName.substring(0, lastDotIdx)
            }
            const exportFileName = `${baseName}_9809_metadata.yml`

            // Format9809からYAML文字列を生成
            const yamlStr = curr9809File.generateMetadataYAML(rawFileName)

            // ダウンロードの実行
            const blob = new Blob([yamlStr], { type: 'text/yaml;charset=utf-8' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = exportFileName
            link.click()
            URL.revokeObjectURL(link.href)
        }

        // ヘルプを別タブで開く
        const openHelpInNewTab = function () {
            window.open('./help.html', '_blank')
        }

        onMounted(async () => {
            // LICENSE 取得
            try {
                const res = await fetch('./LICENSE')
                if (res.ok) {
                    appLicenseText.value = await res.text()
                } else {
                    appLicenseText.value = 'Failed to load LICENSE file.'
                }
            } catch (err) {
                appLicenseText.value = 'Failed to load LICENSE file.'
            }

            // help.html 取得
            try {
                const helpRes = await fetch('./help.html')
                if (helpRes.ok) {
                    const fullHtml = await helpRes.text()
                    const parser = new DOMParser()
                    const doc = parser.parseFromString(fullHtml, 'text/html')
                    const helpElem = doc.getElementById('help_text')
                    helpContent.value = helpElem ? helpElem.innerHTML : fullHtml
                    hasHelp.value = true
                }
            } catch (e) {
                console.error('Failed to load help.html', e)
            }
        })

        return {
            numLoaded, currFileName, currFileIdx, FileNums, fInput, isDragging, isCorrect9809,
            fileHeader, fileBlock, fileDataHeader, fileDataBody,
            triggerFileInput, onFileChange, onDropFiles,
            firstFile, prevFile, nextFile, lastFile,
            Numerator, Denominator, ColsNum, ColsDen, applyLn, showDevider,
            handleSelect, isAxisInEnergy, handleSwitch, onClickAngle, onClickEnergy,
            license_dialog, aboutTab, appLicenseText, ossLicenses, exportAgenda_dialog, onClickExportAgendaOK, onClickExportThumbnail, onClickExportMetadataYAML, elementList, selectedElement, selectedEdge,
            showHelp, hasHelp, helpContent, openHelpInNewTab,
        }
    }
}).use(createVuetify()).mount('#app')