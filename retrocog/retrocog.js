import { createApp, ref, computed, onMounted, nextTick} from 'vue'

createApp({
    setup() {
        // refの宣言
        const fInput = ref('')
        const fName = ref('')
        const headerContent = ref('')
        const dataContent = ref('')
        const Numerator = ref(4)
        const Denominator = ref(5)
        const Columns = ref('')
        const applyLn = ref(true)
        const trg = ref(0) // ファイル読込み時の強制描画用トリガー
        const unloaded = ref(true)
        const headerColor = ref('no-margin grey-text')
        const isDragging = ref(false) // ファイルがドラッグされていればTrue

        // computedの宣言
        const Graph = computed(() => { // グラフの描画
            // データの定義
            const gdata = [{
                   x : data.map((a) => a[1]),
                   y : data.map((a) => {
                    if (applyLn.value) {
                        return Math.log((a[Numerator.value-1]/a[Denominator.value-1]))
                    } else {
                        return (a[Numerator.value-1]/a[Denominator.value-1])
                    }
                   }),
                type : 'line'
            }]
            // レイアウトの定義
            let layout = {
                height: 360,
                xaxis: {
                    title: {
                        text: 'Energy(o) [keV]'
                    },
                    showline: true,
                    linewidth: 2,
                    tickformat: '.4f',
                },
                yaxis: {
                    showline: true,
                    linewidth: 2,
                },
                margin: {
                    t: 36 // 上マージンを100ピクセルに設定
                }
            }
            // グラフの描画(※DOMの更新を待ってから描画するためにnextTickでラップしないと初回描画の横幅がおかしくなる)
            nextTick(() => {
                if (isMounted) Plotly.newPlot('myGraph', gdata, layout, {responsive : true})
            });
            // computedは値を返す必要があるため、trg.valueを参照して描画のトリガーとする
            trg.value;
            return Numerator.value * Denominator.value
        })

        // ローカルの宣言
        let data = []
        let isMounted = false

        onMounted(() => { isMounted = true })
        
        // ファイル選択の代理発火
        const triggerFileInput = (event) => {
            fInput.value.click()
        }

        // ファイルドロップ時のハンドラ
        const onDrop = (event) => {
            isDragging.value = false
            const file = event.dataTransfer.files[0]
            if (!file) return
            handleFileChange(file)
        }

        // ファイルインプットでのファイル選択時のハンドラ
        const onFileChange = (event) => {
            const file = event.target.files[0]
            if (!file) return
            console.log(file.name)
            handleFileChange(file)
        }

        // ファイル変更時のハンドラ
        const handleFileChange = (file) => {
            if (!file) return
            fName.value = file.name

            const reader = new FileReader()

            reader.onload = (e) => {
                // ヘッダーとデータの分割
                const lines = (e.target.result).split(/\n/)
                const headerLines = lines
                                .map((line, index) => line.includes('Angle(c)') ? index : -1)
                                .filter(lineNum => lineNum != -1)
                                .at(-1)
                if (headerLines === undefined) return // 9809形式ではなかった
                headerContent.value = lines.slice(0, headerLines).join('\n')
                dataContent.value = lines.slice(headerLines).join('\n')

                // ヘッダーから分光結晶のDを取得し2dとして保持する
                const MonoLine = (headerContent.value).split(/\n/)
                                    .map((line, index) => (line.trim().startsWith('Mono')) > 0 ? line : '')
                                    .filter(line => line != '')
                                    .at(-1)
                if (MonoLine === undefined) return
                const twoD = ((MonoLine.match(/D=([^A].*)A/))[1].trim()) * 2.0

                // データ部Mode行から測定種別を推定する
                if (1 == (((dataContent.value).trim().split(/\n/))[1].trim().split(/\s+/))[3]) { // Mode行の最初の検出器が「1」
                    applyLn.value = true
                    Numerator.value = 4
                    Denominator.value = 5
                } else { // Mode行の最初の検出器が「1」以外
                    applyLn.value = false
                    Numerator.value = 4
                    Denominator.value = 1 + (
                        ((dataContent.value).trim().split(/\n/))[1].trim().split(/\s+/)
                        .map((v, i) => (v=='1')?i:-1)
                        .filter(v => v > 0)
                        .at(0)
                    ) // 最初に見つかった検出器「1」のインデックス
                }

                // Numerator/Denominator選択プルダウンの生成
                const Channels = ((dataContent.value).trim().split(/\n/))[0].trim().split(/\s+/).slice(3)
                const Modes    = ((dataContent.value).trim().split(/\n/))[1].trim().split(/\s+/).slice(3)
                Columns.value = Channels.map((v, i) => ({
                    id : i+4,
                    ColItem : (i+4)+' (Ch:'+v+', Mode: '+Modes[i]+')'
                }))

                // データ部から実際の測定データを抽出して配列にぶち込む
                data = (dataContent.value).trim().split(/\n/).slice(3)
                            .map((line, index) => {
                                const arr = line.trim().split(/\s+/).map((v) => v*1.0)
                                arr[0] = 12.398 / (twoD * Math.sin(arr[0]*Math.PI/180))
                                arr[1] = 12.398 / (twoD * Math.sin(arr[1]*Math.PI/180))
                                return arr
                            })
                
                unloaded.value = false
                headerColor.value = 'no-margin'

                // 再読み込み可能とするためInputをクリアしておく
                document.getElementById("fileInput").value = ''
                
                // 読込みが完了したのでグラフ描画をトリガーする
                trg.value++
            }
            reader.readAsText(file)
        }

        return {
            fInput,
            fName,
            triggerFileInput,
            headerContent,
            dataContent,
            Numerator,
            Denominator,
            Columns,
            applyLn,
            trg,
            unloaded,
            headerColor,
            Graph,
            onDrop,
            onFileChange,
            isDragging,
        }
    }
}).mount('#app')