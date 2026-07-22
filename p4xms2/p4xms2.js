import { createApp, ref, computed, watch, onMounted, } from 'vue'
import { createVuetify } from 'vuetify'

import { edges, getElementNames, getElementByName } from './elements.js'

createApp({
    setup() {
        // refの宣言
        const licenseDialog = ref(false)
        const licenseContent = ref('')
        const selectedXtal = ref(null)
        const selectedElement = ref(null)
        const selectedEdge = ref(null)
        const availableEdges = ref([])
        const blocks = ref([])
        const editingIndex = ref(null)          // 現在ダイアログで編集している行のインデックス
        const dialogInputValue = ref(0)         // ダイアログ内の入力欄の値
        const isDialogOpen_K = ref(false)       // K値入力ダイアログの開閉フラグ
        const dialog_Kprefix = ref('')          // K値入力ダイアログのラベル
        const dialog_Ksuffix = ref('')          // K値入力ダイアログの単位
        const dialog_Kpreci = ref(2)            // K値入力ダイアログの精度
        const dialog_Kstep = ref(0.1)           // K値入力ダイアログのステップ
        const dialog_Kmin = ref(0.00)           // K値入力ダイアログの最小値
        const dialog_Kmax = ref(999999.99)      // K値入力ダイアログの最大値
        const isDialogOpen_E = ref(false)       // E値入力ダイアログの開閉フラグ
        const dialog_Emin = ref(0.00)           // E値入力ダイアログの最小値
        const dialog_Emax = ref(999999.99)      // E値入力ダイアログの最大値


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

        // 初期化関数
        const init_parameters = function (E0) {
            blocks.value = [] // 一旦全削除
            blocks.value.push( // [0]
                { BEGIN: E0 - 330 }
            )
            blocks.value.push( // [1]
                { BEGIN: E0 - 30 }
            )
            for (let i = 2; i < 6; i++) { // [2...]
                blocks.value.push(
                    { BEGIN: k2eV(2 * i, E0) }
                )
            }
        }

        // 初期値の宣言
        selectedXtal.value = xtals[0]
        selectedElement.value = 'Cu'
        selectedEdge.value = 'K'
        init_parameters(8981.00) // 初回起動時なので手動でCu-KのE0である「8981.00」を与える

        onMounted(async () => {
            try {
                const res = await fetch('license.html')
                licenseContent.value = await res.text()
            } catch (e) {
                console.error('Failed to load license.html', e)
            }
        })

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
            init_parameters(selectedEdgeValue.value)
        }, { immediate: true, deep: true })

        // selectedEdge が変化したら Edge リストを再構築する
        watch(selectedEdge, (newVal) => {
            init_parameters(selectedEdgeValue.value)
        }, { immediate: true, deep: true })

        // Ｋ値入力ダイアログを開く
        const openDialog_K = (index, block) => {
            editingIndex.value = index
            // 直接元のデータを書き換えないよう、現在の値を一時変数にコピー[Å⁻¹]
            if (blocks.value[index].BEGIN < selectedEdgeValue.value) {
                // 編集行がE0未満だったのでΔE0として扱う
                dialogInputValue.value = blocks.value[index].BEGIN - selectedEdgeValue.value
                dialog_Kprefix.value = 'ΔE₀'
                dialog_Ksuffix.value = 'eV'
                dialog_Kpreci.value = 0
                dialog_Kstep.value = 1
            } else {
                // 編集行がE0以上だったのでE0からの波数kとして扱う
                dialogInputValue.value = eV2k(Number(block.BEGIN), selectedEdgeValue.value)
                dialog_Kprefix.value = 'k'
                dialog_Ksuffix.value = 'Å⁻¹'
                dialog_Kpreci.value = 2
                dialog_Kstep.value = 0.1
            }

            const prevK = (index > 0)
                ? ((blocks.value[index - 1].BEGIN < selectedEdgeValue.value)
                    ? blocks.value[index - 1].BEGIN - selectedEdgeValue.value // １つ前がE0より小さいのでそのまま
                    : Number(eV2k(blocks.value[index - 1].BEGIN, selectedEdgeValue.value).toFixed(2)))
                : -999999.99 // [0] なので下限なし
            const nextK = (index < blocks.value.length - 1)
                ? ((blocks.value[index + 1].BEGIN < selectedEdgeValue.value)
                    ? blocks.value[index + 1].BEGIN - selectedEdgeValue.value // １つ後がE0より小さいのでそのまま
                    : Number(eV2k(blocks.value[index + 1].BEGIN, selectedEdgeValue.value).toFixed(2)))
                : 999999.99 // finalなので上限なし
            dialog_Kmin.value = Number((prevK + 0.01).toFixed(2))
            dialog_Kmax.value = Number((nextK - 0.01).toFixed(2))

            isDialogOpen_K.value = true
        }

        const isOKDisabled_K = computed(() => {
            const val = Number(dialogInputValue.value)

            // 0. ついでにsuffixを制御する
            if (val < 0) {
                dialog_Kprefix.value = 'ΔE₀'
                dialog_Ksuffix.value = 'eV'
                dialog_Kpreci.value = 0
                dialog_Kstep.value = 1
            } else if (val === 0) {
                dialog_Kprefix.value = 'k'
                dialog_Ksuffix.value = 'Å⁻¹'
                if (dialog_Kpreci.value === 0) { // 負から正へ
                    dialog_Kpreci.value = 2
                    dialog_Kstep.value = 0.1
                } else { // 正から負へ
                    dialog_Kpreci.value = 0
                    dialog_Kstep.value = 1
                }
            } else {
                dialog_Kprefix.value = 'k'
                dialog_Ksuffix.value = 'Å⁻¹'
                dialog_Kpreci.value = 2
                dialog_Kstep.value = 0.1
            }

            // 1. 入力が空（手入力で全部消した時など）や数値ではない場合は無効化
            if (val === null || val === undefined || isNaN(val)) {
                return true
            }

            // 2. 最小値の制限を下回っている、または最大値の制限を上回っている場合は無効化
            if (val < dialog_Kmin.value || val > dialog_Kmax.value) {
                return true
            }

            // すべての条件をクリアしていればボタンを有効（disabled = false）にする
            return false
        })

        // Enterキーが押された
        const onEnter_K = () => {
            if (!isOKDisabled_K.value) {
                cancelDialog_K(false)
            }
        }

        // Ｋ値入力ダイアログを閉じる（キャンセルもしくはOK）
        const cancelDialog_K = (isCanceled) => {
            if (isCanceled) { // キャンセルされた
                editingIndex.value = null
            } else { // OKされた
                if (editingIndex.value !== null) {
                    const index = editingIndex.value
                    const val = Number(dialogInputValue.value)
                    const E0 = selectedEdgeValue.value
                    if (val < 0) { // 入力値が負だったのでΔE0として扱う
                        blocks.value[index].BEGIN = Number((E0 + val).toFixed(2))
                    } else { // 入力値がゼロか正だったのでkとして扱う
                        blocks.value[index].BEGIN = Number(k2eV(val, E0).toFixed(2))
                    }
                }
            }
            isDialogOpen_K.value = false
        }

        // Ｅ値入力ダイアログを開く
        const openDialog_E = (index, block) => {
            editingIndex.value = index
            // 直接元のデータを書き換えないよう、現在の値を一時変数にコピー
            dialogInputValue.value = block.BEGIN

            const prevE = (index > 0)
                ? blocks.value[index - 1].BEGIN
                : -999999.99 // [0] なので下限なし
            const nextE = (index < blocks.value.length - 1)
                ? blocks.value[index + 1].BEGIN
                : 999999.99 // finalなので上限なし
            dialog_Emin.value = Number((prevE + 0.01).toFixed(2))
            dialog_Emax.value = Number((nextE - 0.01).toFixed(2))
            isDialogOpen_E.value = true
        }

        const isOKDisabled_E = computed(() => {
            const val = Number(dialogInputValue.value)

            // 1. 入力が空（手入力で全部消した時など）や数値ではない場合は無効化
            if (val === null || val === undefined || isNaN(val)) {
                return true
            }

            // 2. 最小値の制限を下回っている、または最大値の制限を上回っている場合は無効化
            if (val < dialog_Emin.value || val > dialog_Emax.value) {
                return true
            }

            // すべての条件をクリアしていればボタンを有効（disabled = false）にする
            return false
        })

        // Enterキーが押された
        const onEnter_E = () => {
            if (!isOKDisabled_E.value) {
                cancelDialog_E(false)
            }
        }

        // Ｅ値入力ダイアログを閉じる（キャンセルもしくはOK）
        const cancelDialog_E = (isCanceled) => {
            if (isCanceled) { // キャンセルされた
                editingIndex.value = null
            } else { // OKされた
                if (editingIndex.value !== null) {
                    const index = editingIndex.value
                    const val = Number(dialogInputValue.value)
                    blocks.value[index].BEGIN = val
                }
            }
            isDialogOpen_E.value = false
        }



        return {
            formatF, eV2deg, eV2k,
            licenseDialog, licenseContent,
            xtals, selectedXtal, changeXtalPlane,
            elementNames, selectedElement, selectedEdge, edges,
            selectedEdge, selectedEdgeValue, availableEdges,
            blocks,
            editingIndex, dialogInputValue,
            isDialogOpen_K, openDialog_K, cancelDialog_K,
            dialog_Kprefix, dialog_Ksuffix, dialog_Kpreci, dialog_Kstep,
            dialog_Kmin, dialog_Kmax, isOKDisabled_K, onEnter_K,
            isDialogOpen_E, openDialog_E, cancelDialog_E,
            dialog_Emin, dialog_Emax, isOKDisabled_E, onEnter_E,
        }
    }
}).use(createVuetify()).mount('#app')