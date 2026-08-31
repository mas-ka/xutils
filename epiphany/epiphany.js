import { createApp, ref, onMounted, nextTick} from 'vue'
import { createVuetify } from 'vuetify'

import { SpectrogramData } from './SpectrogramData.js'

createApp({
    setup() {
        // refの宣言
        // ファイル関連
        const fInput = ref('')
        const fName = ref('')
        const isDragging = ref(false)
        // 励起エネルギースライダー
        const slider = ref('')
        const minSlider = ref(0)
        const maxSlider = ref(0)
        // ROIスライダー
        const roi = ref([0, 0])
        const minROI = ref(0)
        const maxROI = ref(0)
        const isROIDisabled = ref(false)
        // その他
        const license_dialog = ref(false)
        const aboutTab = ref('overview')
        const appLicenseText = ref('Loading LICENSE...')
        const header9809_dialog = ref(false)
        const header9809_text = ref('')
        const showHelp = ref(false)
        const hasHelp = ref(false)
        const helpTab = ref('guide')
        const helpGuideContent = ref('')
        const helpSpecContent = ref('')

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
                version: '3.11.4',
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
                name: 'UTIF.js',
                version: '3.1.0',
                license: 'MIT License',
                copyright: 'Copyright (c) 2018 Photopea',
                text: `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`
            },
            {
                name: 'sprintf-js',
                version: '1.1.3',
                license: 'BSD 3-Clause License',
                copyright: 'Copyright (c) 2007-present Alexandru Mărășteanu',
                text: `Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.`
            },
            {
                name: 'Material Design Icons',
                version: '5.x (@mdi/font)',
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
        const openHelpInNewTab = function (tabName) {
            const hash = tabName === 'spec' ? '#spec' : '#guide'
            window.open(`./help.html${hash}`, '_blank')
        }



        // ローカルの宣言
        let spectrogramData = null

        // ヒートマップグラフのプロパティ
        let gdata = [{
            z: [],
            zauto: false,
            zmin: 0,
            zmax: 0,
            showscale: false,
            x: [],
            y: [],
            type: 'heatmap',
            colorscale: 'Electric',
            transpose: true, // 画面上での水平を励起エネルギーにするために転置する
        }]
        let glayout = {
            autosize: false,
            showlegend: false,
            ticklabels: false,
            width: 512,   // グラフ全体の幅 (ピクセル)
            height:512,  // グラフ全体の高さ (ピクセル)
            yaxis: {
                visible: false,
                domain: [0, 1],
                range: [0, 0],
                rangemode: 'tozero', // 必要に応じて0起点にする
            },
            margin: {
                l: 10, r: 0, b: 0, t: 0
            }
        }

        // ヒートマップグラフの描画
        const drawHeatmap = () => {
            Plotly.newPlot('myHeatmap', gdata, glayout, {responsive : false})
        }

        // ヒストグラムグラフのプロパティ
        let hy = []
        let hdata = [
                {   x: [], // ヒストグラム本体
                    y: [],
                    type: 'lines',
                },
                {   x: [], // ROIを赤く塗りつぶした部分
                    y: [],
                    type: 'lines',
                    fill: 'tozeroy',
                    line: {color: 'red'},
                    fillcolor: 'red',
                },
                {   x: [], // ROI_L側の破線
                    y: [],
                    type: 'lines',
                    line: {color: '#AAAAAA', dash: 'dot'},
                },
                {   x: [], // ROI_H側の破線
                    y: [],
                    type: 'lines',
                    line: {color: '#AAAAAA', dash: 'dot'},
                },
            ]
        let hlayout = {
            showlegend: false,
            autosize: false,
            width: 320,   // グラフ全体の幅 (ピクセル)
            height:522,  // グラフ全体の高さ (ピクセル)
            xaxis: {
                mirror: true,
                showticklabels: false,
                showline: true,
                linecolor: 'black',
                domain: [0, 1],
                range: [0, 0],
                rangemode: 'tozero', // 必要に応じて0起点にする
            },
            yaxis: {
                mirror: true,
                showticklabels: false,
                showline: true,
                linecolor: 'black',
                domain: [0, 1],
                range: [0, 0],
                rangemode: 'tozero', // 必要に応じて0起点にする
            },
            margin: {
                l: 10, r: 10, b: 5, t: 5
            }
        }
        
        // ヒストグラムグラフの描画
        const drawHistgram = (value) => {
            // ヒストグラム(全体)の生成
            hdata[0].x = spectrogramData.dataCPS[Math.round(value)]
            hdata[0].y = hy
            // ヒストグラム(ROI)の生成
            hdata[1].x = spectrogramData.dataCPS[Math.round(value)].slice(roi.value[0], roi.value[1])
                hdata[1].x.unshift(0)
                hdata[1].x.push(0)
            hdata[1].y = hy.slice(roi.value[0], roi.value[1])
                hdata[1].y.unshift(roi.value[0])
                hdata[1].y.push(roi.value[1])
            // ROI線の描画
            hdata[2].y = [roi.value[0], roi.value[0]]
            hdata[3].y = [roi.value[1], roi.value[1]]
            const config = {
                responsive: false,
                modeBarButtonsToRemove: ['toImage', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d'],
            }
            // データをヒストグラム形式で表示する
            Plotly.newPlot('myHistgram', hdata, hlayout, config).then((plotDiv) => {
                // 描画完了後にイベントリスナーを登録
                plotDiv.on('plotly_relayout', handleZoom)
            })
        }

        // ヒストグラムグラフがズームされた時に発火するイベントを監視
        const handleZoom = (eventData) => {
            // 拡大・縮小された後のX軸の範囲
            const xRange = [eventData['xaxis.range[0]'], eventData['xaxis.range[1]']]
            gdata[0].zmin = xRange[0]
            gdata[0].zmax = xRange[1]

            // 拡大・縮小された後のY軸の範囲
            if (eventData['yaxis.range[0]'] !== undefined) {
                const yRange = [eventData['yaxis.range[0]'], eventData['yaxis.range[1]']]
                glayout.yaxis.range = [
                    spectrogramData.energiesFluor[Math.round(yRange[0])],
                    spectrogramData.energiesFluor[Math.round(yRange[1])]
                ]
                minROI.value = Math.round(yRange[0])
                maxROI.value = Math.round(yRange[1])
                isROIDisabled.value = (roi.value[0] < minROI.value || roi.value[1] > maxROI.value)
            }
            drawHeatmap()

            // 範囲が undefined になる場合（ダブルクリックでリセットした時など）は、
            // グラフの fullLayout から現在の軸の範囲を取得することも可能です。
            if (eventData['xaxis.range[0]'] === undefined) {
                // ヒートマップグラフの再描画
                gdata[0].zmin = 0
                gdata[0].zmax = spectrogramData.cpsMax
                glayout.yaxis.range = [
                    spectrogramData.energiesFluor[0], 
                    spectrogramData.energiesFluor[spectrogramData.energiesFluor.length-1]
                ]
                drawHeatmap()
                // ヒストグラムグラフの再描画
                isROIDisabled.value = false
                minROI.value = 0
                maxROI.value = spectrogramData.energiesFluor.length-1
                hlayout.autosize = false
                hlayout.xaxis.range = [0, spectrogramData.cpsMax]
                hlayout.yaxis.range = [0, spectrogramData.energiesFluor.length-1]
                hlayout.xaxis.autorange = false
                hlayout.yaxis.autorange = false
                drawHistgram(slider.value)
            }
        }

        // ROIスライダーが変更された
        const onROIChange = (value) => {
            drawHistgram(slider.value) // ヒストグラムの再描画
            drawMuT() // MuTの再描画
        }

        // カーソルグラフの描画
        const drawCursor = (value) => {// カーソルの生成と表示
            const cdata = [{
                x: [value, value],
                y: [0, 1],
                type: 'lines',
            }]
            const clayout = {
                showlegend: false,
                autosize: false,
                dragmode: false,
                hovermode: false,
                width: 512,   // グラフ全体の幅 (ピクセル)
                height:512,  // グラフ全体の高さ (ピクセル)
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                margin: {
                    l: 10, r: 0, b: 0, t: 0
                },
                xaxis: {
                    showgrid: false,
                    showticklabels: false,
                    domain: [0, 1],
                    range: [0, spectrogramData.energiesExcite.length-1],
                    rangemode: 'tozero', // 必要に応じて0起点にする
                },
                yaxis: {
                    showgrid: false,
                    showticklabels: false,
                    domain: [0, 1],
                    range: [0, 1],
                    rangemode: 'tozero', // 必要に応じて0起点にする
                },
            }
            Plotly.newPlot('myCursor', cdata, clayout, {responsive : false, displayModeBar: false})
        }

        // ファイルドロップ時のハンドラ
        const onDrop = (event) => {
            isDragging.value = false
            const file = event.dataTransfer.files[0]
            if (!file) return
            handleFileChange(file)
        }

        // ファイル選択の代理発火
        const triggerFileInput = (event) => {
            fInput.value.click()
        }

        // ファイルインプットでのファイル選択時のハンドラ
        const onFileChange = (event) => {
            const file = event.target.files[0]
            if (!file) return
            handleFileChange(file)
        }

        // ファイル変更時のハンドラ
        const handleFileChange = async (file) => {
            if (!file) return
            fName.value = file.name
            // SpacrrogramDataの生成と読み込み
            spectrogramData = new SpectrogramData()
            await spectrogramData.loadFromTIFFile(file)

            // 9809ヘッダの取得
            header9809_text.value = spectrogramData.header9809.replace(/\0+/g, "")

            // データをヒートマップ形式で表示する
            gdata[0].z = spectrogramData.dataCPS
            gdata[0].zmin = 0
            gdata[0].zmax = spectrogramData.cpsMax
            gdata[0].x = spectrogramData.energiesExcite
            gdata[0].y = spectrogramData.energiesFluor

            glayout.yaxis.range = [
                spectrogramData.energiesFluor[0], 
                spectrogramData.energiesFluor[spectrogramData.energiesFluor.length-1]
            ]

            drawHeatmap()

            // スライダーの現在値を設定
            nextTick(() => {
                // 励起エネルギースライダー
                minSlider.value = 0
                maxSlider.value = spectrogramData.energiesExcite.length-1
                slider.value = Math.round((minSlider.value + maxSlider.value) / 2)
                onInputSlider(slider.value)
                // ROIスライダー
                minROI.value = 0
                maxROI.value = spectrogramData.energiesFluor.length-1
                roi.value = [minROI.value, maxROI.value]
                drawHistgram(slider.value)
                // MuTグラフのプロパティ初期化と描画
                mdata[0].x = spectrogramData.energiesExcite
                mdata[0].y = spectrogramData.secsReal // テスト用
                drawMuT()
            });

            // ヒストグラムグラフのプロパティの初期化と描画
            hy = [...Array(spectrogramData.dataCPS[0].length-1)].map((_, i) => i)
            hlayout.xaxis.range = [0, spectrogramData.cpsMax]
            hlayout.yaxis.range = [0, spectrogramData.dataCPS[0].length-1]
            hdata[2].x = [0, spectrogramData.cpsMax]
            hdata[2].y = [roi.value[0], roi.value[0]]
            hdata[3].x = [0, spectrogramData.cpsMax]
            hdata[3].y = [roi.value[0], roi.value[0]]
            drawHistgram(slider.value)

            document.getElementById("fileInput").value = ''

            // MuTグラフのプロパティ初期化と描画
            drawMuT()
        }
            
        // 励起エネルギースライダーが動かされている間
        const onInputSlider = (value) => {
            // カーソルグラフの再描画
            drawCursor(value)

            // ヒストグラムの再描画
            drawHistgram(value)
        }

        // MuTグラフのプロパティ
        const mdata = [
                {   x: [], // MuTグラフ本体
                    y: [],
                    type: 'lines',
                },
            ]
        let mlayout = {
            height: 320,   // グラフ全体の幅 (ピクセル)
            autosize: true,
            showlegend: false,
            xaxis: {
                mirror: true,
                showline: true,
                linecolor: 'black',
                tickformat: '.2f',
            },
            yaxis: {
                mirror: true,
                linecolor: 'black',
                tickformat: '.2f',
            },
            margin: {
                l: 50, r: 30, b: 40, t: 20
            }
        }

        // MuTグラフの描画
        const drawMuT = () => {
            mdata[0].x = spectrogramData.energiesExcite
            mdata[0].y = spectrogramData.dataCNT.map((row, i) => {
                return row.slice(roi.value[0], roi.value[1]+1).reduce((a, c) => a + c, 0) / spectrogramData.countsI0[i]
            })
            Plotly.newPlot('myMuT', mdata, mlayout, {responsive : false})
        }

        // 9809ファイルの保存
        const save9809File = () => {
            // 9809テキストの生成
            let text = String(header9809_text.value) // 9809ヘッダ
            spectrogramData.degrees.map((v, i) => {
                text += sprintf(' %9.5f %9.5f %9.2f %9d %9d %9d %9d %9d %9d\r\n',
                    v, v, spectrogramData.secsReal[i],
                    spectrogramData.dataCNT[i].slice(roi.value[0], roi.value[1]+1).reduce((a, c) => a + c, 0),
                    spectrogramData.countsI0[i],
                    spectrogramData.countsICR[i], 0,
                    Math.round(spectrogramData.secsLive[i]*1000000), 0
                )
            })

            // 保存データ用Blobの生成
            const blob = new Blob([text], {type: 'text/plain'})

            // ダウンロード用リンクの生成
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = fName.value.split('.').slice(0, -1).join('.')
                            + sprintf('_pp%04d-%04d', roi.value[0], roi.value[1])
                            + '.dat'
            a.click()

            // リーク対策のため破棄しておく
            URL.revokeObjectURL(a.href)
        }

        // 励起エネルギーIdxから励起エネルギーを取得する
        const getExcitedEnergyFromIdx = (idx) => {
            return spectrogramData.energiesExcite[idx]
        }

        // マウント時の処理
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

            // ヘルプの読み込み
            try {
                const res = await fetch('./help.html')
                if (res.ok) {
                    const fullHtml = await res.text()
                    const parser = new DOMParser()
                    const doc = parser.parseFromString(fullHtml, 'text/html')
                    const guideElem = doc.getElementById('help_text_guide')
                    const specElem = doc.getElementById('help_text_spec')
                    helpGuideContent.value = guideElem ? guideElem.innerHTML : fullHtml
                    helpSpecContent.value = specElem ? specElem.innerHTML : ''
                    hasHelp.value = true
                } else {
                    hasHelp.value = false
                }
            } catch (error) {
                hasHelp.value = false
            }
        })

        return {
            fInput, fName, triggerFileInput, onDrop, isDragging,
            slider, minSlider, maxSlider,
            roi, minROI, maxROI, isROIDisabled,
            onROIChange,
            spectrogramData,
            gdata, glayout,
            hdata, hlayout,
            onInputSlider, getExcitedEnergyFromIdx,
            onFileChange,
            save9809File,
            header9809_dialog, header9809_text,
            license_dialog, aboutTab, appLicenseText, ossLicenses,
            showHelp, hasHelp, helpTab, helpGuideContent, helpSpecContent, openHelpInNewTab,
        }
    }
}).use(createVuetify()).mount('#app')