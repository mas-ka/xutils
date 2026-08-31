import { createApp, ref, computed, watch, onMounted, nextTick } from 'vue'
import { createVuetify } from 'vuetify'

import { elements, edges, getElementNames, getElementByName } from './elements.js'

createApp({
    setup() {
        // refの宣言
        const licenseDialog = ref(false)
        const aboutTab = ref('overview')
        const appLicenseText = ref('Loading LICENSE...')
        const helpContent = ref('')
        const showHelp = ref(false)
        const hasHelp = ref(false)
        const selectedXtal = ref(null)
        const selectedElement = ref(null)
        const selectedEdge = ref(null)
        const availableEdges = ref([])
        const Ebegin = ref()
        const beginDelta = ref()
        const Eend = ref()
        const Kend = ref()
        const Estep = ref()
        const expTime = ref()
        const isDragging = ref(false)           // ファイルドラッグ中のフラグ
        const snackbar = ref(false)             // 通知スナックバーの表示フラグ
        const snackbarText = ref('')            // 通知スナックバーのテキスト

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
            } catch (e) {
                appLicenseText.value = 'Failed to load LICENSE file.'
            }

            // help.html 取得
            try {
                const resHelp = await fetch('./help.html')
                if (resHelp.ok) {
                    const fullHtml = await resHelp.text()
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


        // ローカルの宣言
        const EL = 12398.4264684
        const xtals = [
            { name: 'Si(111)', d: 3.13551 },
            { name: 'Si(311)', d: 1.63747 },
            { name: 'Si(220)', d: 1.92010 },
            { name: 'Other...', d: 3.13551 }
        ]
        const elementNames = getElementNames()

        // ユーティリティ関数
        const eV2deg = function (e, d) { return Math.toDegrees(Math.asin(EL / (2 * d * e))); }
        const deg2eV = function (t, d) { return EL / (2 * d * Math.sin(Math.toRadians(t))); }
        const k2eV = function (k, e0) { return e0 + k * k / 0.262467191; }
        const eV2k = function (e, e0) { return Math.sqrt(0.262467191 * (e - e0)); }
        Math.toDegrees = function (radian) {
            var toDegree = 180 / Math.PI;
            if (isNaN(radian)) return NaN;
            return radian * toDegree;
        }
        Math.toRadians = function (degree) {
            return isNaN(degree) ? NaN : degree * Math.PI / 180;
        }
        const formatF = function (f, w, d) {
            var z = Array(d + 1).join("0");
            var y = "" + f + ((("" + f).indexOf('.') < 0) ? "." + z : z);
            var t = "." + (y.split('\.'))[1].substr(0, d);
            if (Math.abs(f) < 1) {
                return Array(w - (y.split('\.'))[0].length - t.length + 2).join(" ") + (f < 0 ? "-" : "") + t;
            } else {
                return Array(w - (y.split('\.'))[0].length - t.length + 1).join(" ") + (y.split('\.'))[0] + t;
            }
        }
        const formatI = function (i, w) {
            return Array(w - ("" + i).length + 1).join(" ") + i;
        }

        // 初期値の宣言
        selectedXtal.value = xtals[0]
        selectedElement.value = 'Cu'
        selectedEdge.value = 'K'
        beginDelta.value = -330.0
        Kend.value = 20.00
        Ebegin.value = 8951.00 + beginDelta.value
        Eend.value = k2eV(Kend.value, 8951.00)
        expTime.value = 120
        Estep.value = 0.36384



        const changeXtalPlane = function () { }

        // 選択された Element の選択された Edge のエネルギー値を返す
        const selectedEdgeValue = computed(() => {
            if (!selectedElement.value || !selectedEdge.value) return ''
            const el = getElementByName(selectedElement.value)
            return el[selectedEdge.value] ?? ''
        })

        // 選択された Element で値が 0.00 の Edge は disabled にする
        // availableEdges を再構築し、現在の selectedEdge が無効なら最初の有効な Edge に切り替える
        const buildAvailableEdges = function (elementName) {
            const el = elementName ? getElementByName(elementName) : {}
            const list = edges.map(edge => ({
                title: edge,
                value: edge,
                disabled: (el[edge] ?? 0) === 0
            }))
            availableEdges.value = list
            // 現在選択中の Edge が disabled になった場合、最初の有効な Edge に切り替える
            const current = list.find(item => item.value === selectedEdge.value)
            if (!current || current.disabled) {
                const first = list.find(item => !item.disabled)
                selectedEdge.value = first ? first.value : ''
            }
        }

        // selectedElement が変化したら Edge リストを再構築する
        watch(selectedElement, (newVal) => {
            buildAvailableEdges(newVal)
            // Parametersの再構築
            beginDelta.value = -330
            Kend.value = 20.00
            Ebegin.value = selectedEdgeValue.value + beginDelta.value
            Eend.value = k2eV(Kend.value, selectedEdgeValue.value)
            expTime.value = 120
            Estep.value = 0.36384
        }, { immediate: true, deep: true })

        // selectedEdge が変化したら Edge リストを再構築する
        watch(selectedEdge, (newVal) => {
            // Parametersの再構築
            beginDelta.value = -330
            Kend.value = 20.00
            Ebegin.value = selectedEdgeValue.value + beginDelta.value
            Eend.value = k2eV(Kend.value, selectedEdgeValue.value)
            expTime.value = 120
            Estep.value = 0.36384
        }, { immediate: true, deep: true })

        const onChange_Ebegin = () => {
            beginDelta.value = Ebegin.value - selectedEdgeValue.value
        }

        const onChange_beginDelta = () => {
            Ebegin.value = selectedEdgeValue.value + beginDelta.value
        }

        const onChange_Eend = () => {
            Kend.value = eV2k(Eend.value, selectedEdgeValue.value)
        }

        const onChange_Kend = () => {
            Eend.value = k2eV(Kend.value, selectedEdgeValue.value)
        }

        const onChange_expTime = () => {
        }

        // 与えられたエレメントとエッジから出力するAgenda文字列を生成する
        const generateAgenda = (element, edge) => {
            // 選択されたエレメントとエッジから、エッジエネルギーを求める。
            const edgeEnergy = selectedEdgeValue.value
            // 出力するAgendaファイルのうち、共通する部分を作っておく
            var l = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>\r\n";
            l += "<parameter>\r\n";
            l += "  <monochrometer>\r\n";
            l += "    <d_spacing unit=\"angstrom\">" + formatF(selectedXtal.value.d, 10, 6).trim() + "</d_spacing>\r\n";
            l += "    <name>" + selectedXtal.value.name.trim().toUpperCase() + "</name>\r\n";
            l += "  </monochrometer>\r\n";
            l += "  <element>\r\n";
            l += "    <symbol>" + selectedElement.value + "</symbol>\r\n";
            l += "    <edge>" + selectedEdge.value + "</edge>\r\n";
            l += "  </element>\r\n";
            // ここから export Agenda の処理を実装
            l += "  <scan type=\"quick\">\r\n";
            l += "    <edge_energy unit=\"eV\">" + formatF(selectedEdgeValue.value, 10, 2).trim() + "</edge_energy>\r\n";
            l += "    <agenda final=\"" + formatF(Eend.value, 10, 2).trim()
                + "\" step_for_quick=\"" + formatF(Estep.value, 10, 5).trim()
                + "\" time_for_quick=\"" + formatI(expTime.value, 10).trim()
                + "\" unit=\"eV\">\r\n";
            // block id="1"のみ出力
            l += "      <block id=\"1\">\r\n";
            l += "        <ini>" + formatF(Ebegin.value, 10, 2).trim() + "</ini><div>50</div><sec>1</sec>\r\n";
            l += "      </block>\r\n";
            l += "    </agenda>\r\n";
            l += "  </scan>\r\n"
            l += "</parameter>\r\n";
            return l
        }

        const onSaveAsAgenda = () => {
            // 選択されたエレメント・エッジを引数として、Agenda文字列を生成する
            const agendaStr = generateAgenda(selectedElement.value, selectedEdge.value)

            // 1. データをBlobオブジェクトに変換
            const blob = new Blob([agendaStr], { type: 'text/plain;charset=utf-8' })
            const url = URL.createObjectURL(blob)

            // 2. 画面に見えない <a> タグを作ってクリックを擬似再現
            const a = document.createElement('a')
            a.href = url
            a.download = selectedElement.value + '-' + selectedEdge.value + '_Q.agenda' // 保存時のデフォルトファイル名

            document.body.appendChild(a)
            a.click() // ダイアログ（または即時ダウンロード）がトリガーされる

            // 3. 後片付け
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        }

        const loadAgendaFromFile = async (file) => {
            // 3. テキストファイルとして中身を読み込む
            const xmlText = await file.text() // XMLテキストを読み込み

            // 4. DOMParserを使ってXML文字列を解析
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

            // 5. XMLの解析エラーをチェック
            const parserError = xmlDoc.querySelector('parsererror')
            if (parserError) {
                throw new Error('XMLのパースに失敗しました。正しいフォーマットか確認してください。')
            }

            // 6. 各タグのデータを安全に抽出（存在しない場合は空文字やnullを代入）
            // まっさきにScanタイプの確認をおこなう
            const scanTypeText = (xmlDoc.querySelector('scan')).getAttribute('type').toLowerCase() || 'unknown'
            if (scanTypeText !== 'quick') {
                throw new Error('対応していないスキャンタイプです。Quickスキャンのみ対応しています。')
            }
            // monochrometerパラメータの抽出
            const dValueText = xmlDoc.querySelector('monochrometer > d_spacing')?.textContent || '3.135510'
            const xtalName = (xmlDoc.querySelector('monochrometer > name')?.textContent || 'SI(111)').toUpperCase()
            let xtal = xtals.find(x => x.name.toUpperCase() === xtalName)
            if (!xtal) {
                xtal = { name: 'Other...', d: parseFloat(dValueText) }
            }
            selectedXtal.value = xtal
            // elementパラメータの取得
            selectedElement.value = xmlDoc.querySelector('element > symbol')?.textContent || 'Cu'
            selectedEdge.value = xmlDoc.querySelector('element > edge')?.textContent || 'K'
            // edgeエネルギーは設定ファイルから読み込まないでelementパラメータから再構成する。  
            await nextTick() // elementとedgeを読み込んだ段階で一度描画を待たないと以降で再描画が行われない
            // scanパラメータの取得
            const agendaUnit = xmlDoc.querySelector('agenda').getAttribute('unit').toLowerCase() || 'unknown'
            const iniEnergyText = xmlDoc.querySelector('agenda > block[id="1"] > ini')?.textContent || '8651.00'
            const finalEnergyText = xmlDoc.querySelector('agenda').getAttribute('final') || '10505.00'
            const stepForQuickText = xmlDoc.querySelector('agenda').getAttribute('step_for_quick') || '0.36384'
            if (agendaUnit === 'ev') {
                Ebegin.value = parseFloat(iniEnergyText)
                Eend.value = parseFloat(finalEnergyText)
                Estep.value = parseFloat(stepForQuickText)
            } else if (agendaUnit === 'kev') {
                Ebegin.value = parseFloat(iniEnergyText) * 1000.0
                Eend.value = parseFloat(finalEnergyText) * 1000.0
                Estep.value = parseFloat(stepForQuickText) * 1000.0
            } else if (agendaUnit === 'a' || agendaUnit === 'ang' || agendaUnit === 'angstrom') {
                Ebegin.value = EL / parseFloat(iniEnergyText)
                Eend.value = EL / parseFloat(finalEnergyText)
                Estep.value = EL / parseFloat(stepForQuickText)
            } else if (agendaUnit === 'd' || agendaUnit === 'deg' || agendaUnit === 'degree') {
                Ebegin.value = deg2eV(parseFloat(iniEnergyText), selectedXtal.value.d)
                Eend.value = deg2eV(parseFloat(finalEnergyText), selectedXtal.value.d)
                const degE0 = eV2deg(selectedEdgeValue.value, selectedXtal.value.d)
                Estep.value = deg2eV(degE0 + parseFloat(stepForQuickText), selectedXtal.value.d) - selectedEdgeValue.value
            }
            onChange_Ebegin() // beginDeltaを強制定期に更新
            onChange_Eend() // Kendを強制定期に更新
            const timeForQuickText = xmlDoc.querySelector('agenda').getAttribute('time_for_quick') || '120'
            expTime.value = parseFloat(timeForQuickText)

            // 読み込み完了通知を表示（2秒間）
            snackbarText.value = `${file.name || 'ファイル'} をロードしました`
            snackbar.value = true
        }

        const onLoadFromAgenda = async () => {
            try {
                // 1. ファイル選択ダイアログを開く
                const [fileHandle] = await window.showOpenFilePicker({
                    types: [
                        {
                            description: 'SAGA-LS Agenda Files (*.agenda)',
                            accept: {
                                // ブラウザにテキストファイルとして認識させるため text/plain を指定し、
                                // 拡張子として .agenda のみを受け付けるよう制限します
                                'text/plain': ['.agenda']
                            }
                        }
                    ],
                    excludeAcceptAllOption: true, // 「すべてのファイル(*.*)」を選択肢から排除
                    multiple: false              // 複数ファイルの選択を禁止
                })

                // 2. ファイルオブジェクトを取得
                const file = await fileHandle.getFile()
                await loadAgendaFromFile(file)
            } catch (err) {
                // ユーザーがダイアログをキャンセルした（閉じられた）場合は AbortError が発生します
                if (err.name === 'AbortError') {
                    return
                }
                // その他のエラー（ファイル破損、権限エラーなど）
                alert(err.message)
            }
        }

        // ファイルドロップ時のハンドラ
        const onDrop = async (event) => {
            isDragging.value = false
            const file = event.dataTransfer?.files?.[0]
            if (!file) return
            try {
                await loadAgendaFromFile(file)
            } catch (err) {
                alert(err.message)
            }
        }

        return {
            formatF, eV2deg, eV2k,
            licenseDialog, aboutTab, appLicenseText, ossLicenses,
            helpContent, showHelp, hasHelp, openHelpInNewTab,
            xtals,
            selectedXtal,
            changeXtalPlane,
            elementNames,
            selectedElement, selectedEdge,
            edges,
            selectedEdgeValue,
            availableEdges,
            Ebegin, Eend, Estep,
            beginDelta, Kend, expTime,
            onChange_Ebegin, onChange_beginDelta,
            onChange_Eend, onChange_Kend,
            onChange_expTime,
            onSaveAsAgenda, onLoadFromAgenda, loadAgendaFromFile,
            isDragging, onDrop,
            snackbar, snackbarText,
        }
    }
}).use(createVuetify()).mount('#app')