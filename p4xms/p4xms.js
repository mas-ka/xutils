import { createApp, ref, computed, watch, onMounted, nextTick, } from 'vue'
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
        const activeBlockMenuIndex = ref(null)       // Blockメニューが開いている行のインデックス
        const editingIndex = ref(null)          // 現在ダイアログで編集している行のインデックス
        const dialogOriginalValue = ref(0)         // ダイアログ内の入力欄の値
        const dialogInputValue = ref(0)         // ダイアログ内の入力欄の値
        const isDialogOpen_K = ref(false)       // K値入力ダイアログの開閉フラグ
        const isInvalid_K = ref(false)          // K値入力ダイアログの無効フラグ
        const dialog_Kprefix = ref('')          // K値入力ダイアログのラベル
        const dialog_Ksuffix = ref('')          // K値入力ダイアログの単位
        const dialog_Kpreci = ref(2)            // K値入力ダイアログの精度
        const dialog_Kstep = ref(0.1)           // K値入力ダイアログのステップ
        const dialog_Kmin = ref(0.00)           // K値入力ダイアログの最小値
        const dialog_Kmax = ref(999999.99)      // K値入力ダイアログの最大値
        const isDialogOpen_E = ref(false)       // E値入力ダイアログの開閉フラグ
        const isInvalid_E = ref(false)          // E値入力ダイアログの無効フラグ
        const dialog_Emin = ref(0.00)           // E値入力ダイアログの最小値
        const dialog_Emax = ref(999999.99)      // E値入力ダイアログの最大値
        const isDialogOpen_I = ref(false)       // I値入力ダイアログの開閉フラグ
        const isInvalid_I = ref(false)          // I値入力ダイアログの無効フラグ
        const dialog_Imin = ref(1)              // I値入力ダイアログの最小値
        const dialog_Imax = ref(9999999)        // I値入力ダイアログの最大値
        const dialog_Itype = ref(1)             // I値の補間方法 By step or By division
        const dialog_Isuffix = ref('eV')
        const dialog_Iprecision = ref(0)
        const dialog_Istep = ref(1)
        const isDialogOpen_T = ref(false)       // Ｔ値入力ダイアログの開閉フラグ
        const isInvalid_T = ref(false)          // Ｔ値入力ダイアログの無効フラグ
        const isDragging = ref(false)           // ファイルドラッグ中のフラグ
        const snackbar = ref(false)             // 通知スナックバーの表示フラグ
        const snackbarText = ref('')            // 通知スナックバーのテキスト

        // ローカルの宣言
        const EL = 12398.4264684
        const xtals = [
            { name: 'Si(111)', d: 3.13551 },
            { name: 'Si(311)', d: 1.63747 },
            { name: 'Si(220)', d: 1.92010 },
            { name: 'Other...', d: 3.13551 }
        ]
        const elementNames = getElementNames()

        const TYPE_I = Object.freeze({
            BY_STEP: 0,
            BY_DIVS: 1,
            BY_FINAL: 2,
        })


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
                { BEGIN: E0 - 330, TYPE_I: TYPE_I.BY_DIVS, NUM_I: 50, EXPT: 1.0, }
            )
            blocks.value.push( // [1]
                { BEGIN: E0 - 30, TYPE_I: TYPE_I.BY_DIVS, NUM_I: 250, EXPT: 1.0, }
            )
            for (let i = 2; i < 10; i++) { // [2...]
                blocks.value.push(
                    { BEGIN: k2eV(2 * i, E0), TYPE_I: TYPE_I.BY_DIVS, NUM_I: 40, EXPT: 1.0, }
                )
            }
            blocks.value.push( // 最終行
                { BEGIN: k2eV(2 * blocks.value.length, E0), TYPE_I: TYPE_I.BY_FINAL, NUM_I: 1, EXPT: 1.0, }
            )
            // blocks.value.push({ BEGIN: E0 - 331, TYPE_I: TYPE_I.BY_DIVS, NUM_I: 10, EXPT: 1.0, })
            // blocks.value.push({ BEGIN: E0 - 31, TYPE_I: TYPE_I.BY_DIVS, NUM_I: 10, EXPT: 1.0, })
            // blocks.value.push({ BEGIN: 9000, TYPE_I: TYPE_I.BY_STEP, NUM_I: 5, EXPT: 1.0, })
            // blocks.value.push({ BEGIN: 9100, TYPE_I: TYPE_I.BY_DIVS, NUM_I: 10, EXPT: 1.0, })
            // blocks.value.push({ BEGIN: 9200, TYPE_I: TYPE_I.BY_DIVS, NUM_I: 100, EXPT: 1.0, })
            // blocks.value.push({ BEGIN: 9300, TYPE_I: TYPE_I.BY_FINAL, NUM_I: 1, EXPT: 1.0, })
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

        // Block メニューを開閉する
        const toggleBlockMenu = (index) => {
            activeBlockMenuIndex.value = activeBlockMenuIndex.value === index ? null : index
        }

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
            dialogOriginalValue.value = dialogInputValue.value

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
            isInvalid_K.value = false
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

        const onInput_K = (event) => {
            const rawValue = Number(event.target.value)
            isInvalid_K.value = (rawValue < dialog_Kmin.value || rawValue > dialog_Kmax.value)
        }

        // Ｋ値入力ダイアログのビフォーフォーカスアウト
        const onBlur_K = async (event) => {
            // 現在の入力値を取得
            const rawValue = Number(event.target.value)
            if (rawValue < dialog_Kmin.value || rawValue > dialog_Kmax.value) {
                // 範囲外だったので再描画を待ってから保存しておいた元の値に戻す
                await nextTick()
                dialogInputValue.value = Number(dialogOriginalValue.value)
            }
        }

        // スピナー押下や内部確定時に強制的に呼び出されるイベント
        const onUpdate_K = (value) => {
            // 1. まず v-model の値を最新の値で強制上書き（フリーズを解除）
            dialogInputValue.value = value
            // 2. 現在の `isInvalid_K` も最新の値で更新する
            if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
                isInvalid_K.value = true
            } else {
                isInvalid_K.value = (Number(value) < dialog_Kmin.value || Number(value) > dialog_Kmax.value)
            }
        }

        // Enterキーが押された
        const onEnter_K = () => {
            if (!isOKDisabled_K.value && !isInvalid_K.value) {
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
                    const E0 = selectedEdgeValue.value
                    let val = 0;
                    if (dialogInputValue.value < 0) { // 入力値が負だったのでΔE0として扱う
                        val = Number((E0 + dialogInputValue.value).toFixed(2))
                    } else { // 入力値がゼロか正だったのでkとして扱う
                        val = Number(k2eV(dialogInputValue.value, E0).toFixed(2))
                    }
                    // １つ前とこのblockの補間値を計算する
                    const prevBlock = blocks.value[index - 1]
                    const currBlock = blocks.value[index]
                    const nextBlock = blocks.value[index + 1]
                    if (index > 0 && prevBlock.TYPE_I === TYPE_I.BY_DIVS) { // 等分割だった場合のみ再計算
                        prevBlock.NUM_I = Number((prevBlock.NUM_I * ((val - prevBlock.BEGIN) / (currBlock.BEGIN - prevBlock.BEGIN))).toFixed(0))
                    }
                    if (index < blocks.value.length - 1 && currBlock.TYPE_I === TYPE_I.BY_DIVS) { // 等分割だった場合のみ再計算
                        currBlock.NUM_I = Number((currBlock.NUM_I * ((nextBlock.BEGIN - val) / (nextBlock.BEGIN - currBlock.BEGIN))).toFixed(0))
                    }
                    blocks.value[index].BEGIN = val
                }
            }
            isDialogOpen_K.value = false
        }

        // Ｅ値入力ダイアログを開く
        const openDialog_E = (index, block) => {
            editingIndex.value = index
            // 直接元のデータを書き換えないよう、現在の値を一時変数にコピー
            dialogInputValue.value = block.BEGIN
            dialogOriginalValue.value = dialogInputValue.value

            const prevE = (index > 0)
                ? blocks.value[index - 1].BEGIN
                : -999999.99 // [0] なので下限なし
            const nextE = (index < blocks.value.length - 1)
                ? blocks.value[index + 1].BEGIN
                : 999999.99 // finalなので上限なし
            dialog_Emin.value = Number((prevE + 0.01).toFixed(2))
            dialog_Emax.value = Number((nextE - 0.01).toFixed(2))
            isInvalid_E.value = false
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

        const onInput_E = (event) => {
            const rawValue = Number(event.target.value)
            isInvalid_E.value = (rawValue < dialog_Emin.value || rawValue > dialog_Emax.value)
        }

        // Ｅ値入力ダイアログのビフォーフォーカスアウト
        const onBlur_E = async (event) => {
            // 現在の入力値を取得
            const rawValue = Number(event.target.value)
            if (rawValue < dialog_Emin.value || rawValue > dialog_Emax.value) {
                // 範囲外だったので再描画を待ってから保存しておいた元の値に戻す
                await nextTick()
                dialogInputValue.value = Number(dialogOriginalValue.value)
            }
        }

        // スピナー押下や内部確定時に強制的に呼び出されるイベント
        const onUpdate_E = (value) => {
            // 1. まず v-model の値を最新の値で強制上書き（フリーズを解除）
            dialogInputValue.value = value
            // 2. 現在の `isInvalid_E` も最新の値で更新する
            if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
                isInvalid_E.value = true
            } else {
                isInvalid_E.value = (Number(value) < dialog_Emin.value || Number(value) > dialog_Emax.value)
            }
        }

        // Enterキーが押された
        const onEnter_E = () => {
            if (!isOKDisabled_E.value && !isInvalid_E.value) {
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
                    // １つ前とこのblockの補間値を計算する
                    const prevBlock = blocks.value[index - 1]
                    const currBlock = blocks.value[index]
                    const nextBlock = blocks.value[index + 1]
                    if (index > 0 && prevBlock.TYPE_I === TYPE_I.BY_DIVS) { // 等分割だった場合のみ再計算
                        prevBlock.NUM_I = Number((prevBlock.NUM_I * ((val - prevBlock.BEGIN) / (currBlock.BEGIN - prevBlock.BEGIN))).toFixed(0))
                    }
                    if (index < blocks.value.length - 1 && currBlock.TYPE_I === TYPE_I.BY_DIVS) { // 等分割だった場合のみ再計算
                        currBlock.NUM_I = Number((currBlock.NUM_I * ((nextBlock.BEGIN - val) / (nextBlock.BEGIN - currBlock.BEGIN))).toFixed(0))
                    }
                    blocks.value[index].BEGIN = val
                }
            }
            isDialogOpen_E.value = false
        }

        // Ｉ値入力ダイアログを開く
        const openDialog_I = (index, block) => {
            editingIndex.value = index
            // 直接元のデータを書き換えないよう、現在の値を一時変数にコピー
            dialogInputValue.value = block.NUM_I
            dialogOriginalValue.value = dialogInputValue.value

            // I値の補間方法を記憶
            dialog_Itype.value = block.TYPE_I
            onUpdate_Itype(false) // 単位とか上下限を補完
            isInvalid_I.value = false
            isDialogOpen_I.value = true
        }

        const isOKDisabled_I = computed(() => {
            const val = Number(dialogInputValue.value)

            // 1. 入力が空（手入力で全部消した時など）や数値ではない場合は無効化
            if (val === null || val === undefined || isNaN(val)) {
                return true
            }

            // 2. 最小値の制限を下回っている、または最大値の制限を上回っている場合は無効化
            if (val < dialog_Imin.value || val > dialog_Imax.value) {
                return true
            }

            // すべての条件をクリアしていればボタンを有効（disabled = false）にする
            return false
        })

        // TYPE_Iの変更にともなう単位とか上下限の補完
        const onUpdate_Itype = (flag) => {
            const index = editingIndex.value
            const block = blocks.value[index]
            const nextBlock = blocks.value[index + 1]
            if (dialog_Itype.value === TYPE_I.BY_STEP) {
                dialog_Isuffix.value = 'eV'
                dialog_Imin.value = 0.00001
                dialog_Imax.value = 999999.99999
                dialog_Iprecision.value = 5
                dialog_Istep.value = 0.00001
                if (flag) dialogInputValue.value = Number(((nextBlock.BEGIN - block.BEGIN) / dialogInputValue.value).toFixed(5))
            } else if (dialog_Itype.value === TYPE_I.BY_DIVS) {
                dialog_Isuffix.value = 'div.'
                dialog_Imin.value = 1
                dialog_Imax.value = 999999
                dialog_Iprecision.value = 0
                dialog_Istep.value = 1
                if (flag) dialogInputValue.value = Number(((nextBlock.BEGIN - block.BEGIN) / dialogInputValue.value).toFixed(0))
            }
        }

        const onInput_I = (event) => {
            const rawValue = Number(event.target.value)
            isInvalid_I.value = (rawValue < dialog_Imin.value || rawValue > dialog_Imax.value)
        }

        // Ｉ値入力ダイアログのビフォーフォーカスアウト
        const onBlur_I = async (event) => {
            // 現在の入力値を取得
            const rawValue = Number(event.target.value)
            if (rawValue < dialog_Imin.value || rawValue > dialog_Imax.value) {
                // 範囲外だったので再描画を待ってから保存しておいた元の値に戻す
                await nextTick()
                dialogInputValue.value = Number(dialogOriginalValue.value)
            }
        }

        // スピナー押下や内部確定時に強制的に呼び出されるイベント
        const onUpdate_I = (value) => {
            // 1. まず v-model の値を最新の値で強制上書き（フリーズを解除）
            dialogInputValue.value = value
            // 2. 現在の `isInvalid_I` も最新の値で更新する
            if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
                isInvalid_I.value = true
            } else {
                isInvalid_I.value = (Number(value) < dialog_Imin.value || Number(value) > dialog_Imax.value)
            }
        }

        // Enterキーが押された
        const onEnter_I = () => {
            if (!isOKDisabled_I.value && !isInvalid_I.value) {
                cancelDialog_I(false)
            }
        }

        // Ｉ値入力ダイアログを閉じる（キャンセルもしくはOK）
        const cancelDialog_I = (isCanceled) => {
            if (isCanceled) { // キャンセルされた
                editingIndex.value = null
            } else { // OKされた
                if (editingIndex.value !== null) {
                    blocks.value[editingIndex.value].TYPE_I = dialog_Itype.value
                    blocks.value[editingIndex.value].NUM_I = Number(dialogInputValue.value)
                }
            }
            isDialogOpen_I.value = false
        }

        // Ｔ値入力ダイアログを開く
        const openDialog_T = (index, block) => {
            editingIndex.value = index
            // 直接元のデータを書き換えないよう、現在の値を一時変数にコピー
            dialogInputValue.value = block.EXPT
            dialogOriginalValue.value = dialogInputValue.value
            isInvalid_T.value = false
            isDialogOpen_T.value = true
        }

        const isOKDisabled_T = computed(() => {
            const val = Number(dialogInputValue.value)
            // 1. 入力が空（手入力で全部消した時など）や数値ではない場合は無効化
            if (val === null || val === undefined || isNaN(val)) {
                return true
            }
            // 2. 最小値の制限を下回っている場合は無効化
            if (val < 0.1) {
                return true
            }
            // すべての条件をクリアしていればボタンを有効（disabled = false）にする
            return false
        })

        const onInput_T = (event) => {
            const rawValue = Number(event.target.value)
            isInvalid_T.value = (rawValue < 0.1)
        }

        // Ｅ値入力ダイアログのビフォーフォーカスアウト
        const onBlur_T = async (event) => {
            // 現在の入力値を取得
            const rawValue = Number(event.target.value)
            if (rawValue < 0.1) {
                // 範囲外だったので再描画を待ってから保存しておいた元の値に戻す
                await nextTick()
                dialogInputValue.value = Number(dialogOriginalValue.value)
            }
        }

        // スピナー押下や内部確定時に強制的に呼び出されるイベント
        const onUpdate_T = (value) => {
            // 1. まず v-model の値を最新の値で強制上書き（フリーズを解除）
            dialogInputValue.value = value
            // 2. 現在の `isInvalid_E` も最新の値で更新する
            if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
                isInvalid_T.value = true
            } else {
                isInvalid_T.value = (Number(value) < 0.1)
            }
        }

        // Enterキーが押された
        const onEnter_T = () => {
            if (!isOKDisabled_T.value && !isInvalid_T.value) {
                cancelDialog_T(false)
            }
        }

        // Ｔ値入力ダイアログを閉じる（キャンセルもしくはOK）
        const cancelDialog_T = (isCanceled) => {
            if (isCanceled) { // キャンセルされた
                editingIndex.value = null
            } else { // OKされた
                if (editingIndex.value !== null) {
                    blocks.value[editingIndex.value].EXPT = Number(dialogInputValue.value)
                }
            }
            isDialogOpen_T.value = false
        }

        // 左スピードダイアルの[+]がクリックされた
        const addBlock = (index) => {
            if (index === 0) { // 先頭への追加
                const e = blocks.value[0].BEGIN
                const newBlock = { BEGIN: e - 300, TYPE_I: TYPE_I.BY_DIVS, NUM_I: 50, EXPT: 1.0, }
                blocks.value.unshift(newBlock)
            } else if (index === blocks.value.length - 1) { // 末尾への追加
                const e = blocks.value[index].BEGIN
                const old_k = eV2k(e, selectedEdgeValue.value)
                const new_k = Math.floor(((Math.round(old_k * 1000) / 1000)) / 2) * 2 + 2
                const new_e = k2eV(new_k, selectedEdgeValue.value)
                console.log(old_k, new_k, new_e)
                // 現在の最終Blockをfinalでなくする
                blocks.value[index].TYPE_I = TYPE_I.BY_DIVS // 等分割に変更
                blocks.value[index].NUM_I = Number(((new_k - old_k) * 20).toFixed(2)) // 分割数を計算してセット
                blocks.value[index].EXPT = 1.0
                const newBlock = { BEGIN: new_e, TYPE_I: TYPE_I.BY_FINAL, NUM_I: 1, EXPT: 1.0, }
                blocks.value.push(newBlock)
            }
        }

        // 左スピードダイアルの[-]がクリックされた
        const removeBlock = (index) => {
            if (index === 0) { // 先頭の削除
                blocks.value.shift()
            } else if (index === blocks.value.length - 1) { // 末尾の削除
                // 末尾の１つ前のBlockを最終に変更する
                blocks.value[index - 1].TYPE_I = TYPE_I.BY_FINAL
                blocks.value[index - 1].NUM_I = 1
                blocks.value[index - 1].EXPT = 1.0
                // 末尾を削除
                blocks.value.pop()
            }
        }

        // 左スピードダイアルの[X]がクリックされた
        const mergeBlocks = (index) => {
            const prevBlock = blocks.value[index - 1]
            const currBlock = blocks.value[index]
            const nextBlock = blocks.value[index + 1]
            console.log(prevBlock, currBlock)
            if (prevBlock.TYPE_I === TYPE_I.BY_STEP) { // １つ前のBlockが等間隔だったら
                // 単純のこのBlockを削除する
                blocks.value.splice(index, 1)
            } else { // １つ前のBlockが等分割だったら
                let divs = currBlock.NUM_I // このBlockの分割数で仮受けする
                if (currBlock.TYPE_I === TYPE_I.BY_STEP) { // このBlockが等間隔だったら
                    // このBlockを一時的に等分割に変更し、仮受けした分割数を上書きする
                    divs = Math.round((nextBlock.BEGIN - currBlock.BEGIN) / currBlock.NUM_I)
                }
                prevBlock.NUM_I += divs // １つ前のBlockの分割数を変更する
                blocks.value.splice(index, 1) // このBlockを削除する
            }
        }

        // 右スピードダイアルの[<]がクリックされた
        const splitBlock = (index) => {
            const E0 = selectedEdgeValue.value
            const currBlock = blocks.value[index]
            const nextBlock = blocks.value[index + 1]
            if (nextBlock.BEGIN <= E0 || currBlock.BEGIN <= E0) { // どちらかがE0より小さい場合には、kではなくE基準で2分割する
                const newBEGIN = Number(((nextBlock.BEGIN + currBlock.BEGIN) / 2).toFixed(2))
                if (currBlock.TYPE_I === TYPE_I.BY_STEP) { // このBlockが等間隔だったら
                    blocks.value.splice(index + 1, 0, { BEGIN: newBEGIN, TYPE_I: TYPE_I.BY_STEP, NUM_I: currBlock.NUM_I, EXPT: currBlock.EXPT, })
                } else if (currBlock.NUM_I === 1) { // このBlockの等分割で分割数が1だったら
                    // 分割数1のBlockを挿入する
                    blocks.value.splice(index + 1, 0, { BEGIN: newBEGIN, TYPE_I: TYPE_I.BY_DIVS, NUM_I: 1, EXPT: currBlock.EXPT, })
                } else { // このBlockの分割数が1以外だったら
                    // このBlockの分割数を半分にする(奇数の場合は切り上げ)
                    blocks.value[index].NUM_I = Math.ceil(currBlock.NUM_I / 2)
                    // 分割数を半分にした新しいBlockを追加
                    blocks.value.splice(index + 1, 0, { BEGIN: newBEGIN, TYPE_I: TYPE_I.BY_DIVS, NUM_I: blocks.value[index].NUM_I, EXPT: currBlock.EXPT, })
                }
            } else { // どちらもE0より大きい場合には、k基準で2分割する
                const currK = eV2k(currBlock.BEGIN, E0)
                const nextK = eV2k(nextBlock.BEGIN, E0)
                const newBEGIN = Number((k2eV((currK + nextK) / 2, E0)).toFixed(2))
                if (currBlock.TYPE_I === TYPE_I.BY_STEP) { // このBlockが等間隔だったら
                    blocks.value.splice(index + 1, 0, { BEGIN: newBEGIN, TYPE_I: TYPE_I.BY_STEP, NUM_I: currBlock.NUM_I, EXPT: currBlock.EXPT, })
                } else { // このBlockが等分割だったら
                    if (currBlock.NUM_I === 1) { // このBlockの分割数が1だったら
                        // 分割数1のBlockを挿入する
                        blocks.value.splice(index + 1, 0, { BEGIN: newBEGIN, TYPE_I: TYPE_I.BY_DIVS, NUM_I: 1, EXPT: currBlock.EXPT, })
                    } else { // このBlockの分割数が1以外だったら
                        // このBlockの分割数を半分にする(奇数の場合は切り上げ)
                        blocks.value[index].NUM_I = Math.ceil(currBlock.NUM_I / 2)
                        // 分割数を半分にした新しいBlockを追加
                        blocks.value.splice(index + 1, 0, { BEGIN: newBEGIN, TYPE_I: TYPE_I.BY_DIVS, NUM_I: blocks.value[index].NUM_I, EXPT: currBlock.EXPT, })
                    }
                }
            }

        }

        // 露光時間のインクリメントスピナーがクリックされた時
        const onClick_Tplus = function (index) {
            blocks.value[index].EXPT = Number(blocks.value[index].EXPT) + 1.0
            const t = blocks.value[index].EXPT
            for (let i = index + 1; i < blocks.value.length - 1; i++) {
                blocks.value[i].EXPT = t
            }
        }

        // 露光時間のデクリメントスピナーがクリックされた時
        const onClick_Tminus = function (index) {
            blocks.value[index].EXPT = Number(blocks.value[index].EXPT) - 1.0
            const t = blocks.value[index].EXPT
            for (let i = index + 1; i < blocks.value.length - 1; i++) {
                blocks.value[i].EXPT = t
            }
        }

        // 与えられたエレメントとエッジから出力するAgenda文字列を生成する
        const generateAgenda = (element, edge) => {
            // 使用する値をあらかじめ取得しておく
            const edgeEnergy = selectedEdgeValue.value
            const Efinal = blocks.value[blocks.value.length - 1].BEGIN
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
            l += "  <scan type=\"step\">\r\n";
            l += "    <edge_energy unit=\"eV\">" + formatF(selectedEdgeValue.value, 10, 2).trim() + "</edge_energy>\r\n";
            l += "    <agenda final=\"" + formatF(Efinal, 10, 2).trim()
                + "\" step_for_quick=\".36384\" time_for_quick=\"120\" unit=\"eV\">\r\n";
            // blockの出力
            for (let i = 0; i < blocks.value.length - 1; i++) {
                l += "      <block id=\"" + (i + 1) + "\">\r\n";
                const block = blocks.value[i]
                l += "        <ini>" + formatF(block.BEGIN, 10, 2).trim() + "</ini>"
                if (block.TYPE_I === TYPE_I.BY_STEP) {
                    l += "<step>" + formatF(block.NUM_I, 10, 5).trim() + "</step>";
                } else {
                    l += "<div>" + block.NUM_I + "</div>";
                }
                l += "<sec>" + formatF(block.EXPT, 10, 1).trim() + "</sec>\r\n";
                l += "      </block>\r\n";
            }
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
            a.download = selectedElement.value + '-' + selectedEdge.value + '_S.agenda' // 保存時のデフォルトファイル名

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
            if (scanTypeText !== 'step') {
                throw new Error('対応していないスキャンタイプです。Stepスキャンのみ対応しています。')
            }
            // 7. monochrometerパラメータの抽出
            const dValueText = xmlDoc.querySelector('monochrometer > d_spacing')?.textContent || '3.135510'
            const xtalName = (xmlDoc.querySelector('monochrometer > name')?.textContent || 'SI(111)').toUpperCase()
            let xtal = xtals.find(x => x.name.toUpperCase() === xtalName)
            if (!xtal) {
                xtal = { name: 'Other...', d: parseFloat(dValueText) }
            }
            selectedXtal.value = xtal
            // 8. elementパラメータの取得
            selectedElement.value = xmlDoc.querySelector('element > symbol')?.textContent || 'Cu'
            selectedEdge.value = xmlDoc.querySelector('element > edge')?.textContent || 'K'
            // edgeエネルギーは設定ファイルから読み込まないでelementパラメータから再構成する。  
            await nextTick() // elementとedgeを読み込んだ段階で一度描画を待たないと以降で再描画が行われない
            // 9. scanパラメータの取得
            const agendaUnit = xmlDoc.querySelector('agenda').getAttribute('unit').toLowerCase() || 'unknown'
            if (agendaUnit === 'unknown') {
                throw new Error('対応していない測定単位です。')
            }
            // 10. block数の抽出とblockのid順でのソート処理
            let blockNodesArray = Array.from(xmlDoc.querySelectorAll('agenda > block'))
            if (blockNodesArray.length === 0) {
                throw new Error('測定ブロック（block）が見つかりません。')
            }
            blockNodesArray.sort((a, b) => {
                const idA = parseInt(a.getAttribute('id') || '0', 10)
                const idB = parseInt(b.getAttribute('id') || '0', 10)
                return idA - idB
            })
            // 12. block内容の抽出と格納および最終行の処理
            // 最初に最終エネルギーの確認
            let finalEnergy = 0;
            if (blockNodesArray.length < 13) { // 記述されているblock数が13未満の場合
                // <agenda final="">が最終エネルギーに対応
                finalEnergy = parseFloat(xmlDoc.querySelector('agenda').getAttribute('final') || '-1')
            } else {
                // <block id="13">の<ini>が最終エネルギーに対応
                finalEnergy = parseFloat(xmlDoc.querySelector('block[id="13"] > ini')?.textContent || '-1')
                // 不要な部分を削除する
                blockNodesArray = blockNodesArray.slice(0, 12);
            }
            if (finalEnergy < 0) {
                throw new Error(`最終エネルギーが定義されていないか不正な値です。`)
            }
            if (agendaUnit === 'ev') {
                finalEnergy
            } else if (agendaUnit === 'kev') {
                finalEnergy *= 1000.0
            } else if (agendaUnit === 'd' || agendaUnit === 'deg' || agendaUnit === 'degree') {
                finalEnergy = deg2eV(finalEnergy, selectedXtal.value.d)
            } else {
                throw new Error(`対応していない測定単位 "${agendaUnit}" です。`)
            }
            blocks.value = [] // まず空にしておく
            blockNodesArray.forEach((blockNode, index) => {
                const iniText = blockNode.querySelector('ini')?.textContent
                const stepText = blockNode.querySelector('step')?.textContent
                const divText = blockNode.querySelector('div')?.textContent
                const secText = blockNode.querySelector('sec')?.textContent
                // iniのチェック
                if (!iniText) {
                    throw new Error(`ブロック [ID: ${blockNode.getAttribute('id') || (index + 1)}] の ini が不足しています。`)
                }
                let iniValue = parseFloat(iniText)
                if (isNaN(iniValue) || iniValue < 0) {
                    throw new Error(`ブロック [ID: ${blockNode.getAttribute('id') || (index + 1)}] の ini が不正な値です。`)
                }
                if (agendaUnit === 'ev') {
                    iniValue
                } else if (agendaUnit === 'kev') {
                    iniValue *= 1000.0
                } else if (agendaUnit === 'd' || agendaUnit === 'deg' || agendaUnit === 'degree') {
                    iniValue = deg2eV(iniValue, selectedXtal.value.d)
                } else {
                    throw new Error(`対応していない測定単位 "${agendaUnit}" です。`)
                }
                // 露光時間のチェック
                if (!secText) {
                    throw new Error(`ブロック [ID: ${blockNode.getAttribute('id') || (index + 1)}] の sec が不足しています。`)
                }
                let secValue = parseFloat(secText)
                if (isNaN(secValue) || secValue < 0.1) {
                    throw new Error(`ブロック [ID: ${blockNode.getAttribute('id') || (index + 1)}] の sec が不正な値です。`)
                }
                secValue = (Math.round(secValue * 10) / 10)
                // 補間方法のチェック
                let typeI = TYPE_I.BY_DIVS  // デフォルトは分割指定
                let numI = 1
                if (stepText) { // stepタグが存在した場合は(divの存在によらず)stepが優先される
                    typeI = TYPE_I.BY_STEP
                    numI = parseFloat(stepText)
                } else if (divText) { // stepタグが存在しない場合はdivタグをチェックする
                    const divValue = parseFloat(divText) // divを一旦浮動小数で受ける
                    if (!isNaN(divValue) && divValue > 0) { //divValue > 0のときのみdiv指定とみなす
                        typeI = TYPE_I.BY_DIVS
                        numI = Math.trunc(divValue)
                    }
                } // stepもdivも存在しなかったらデフォルト値(BY_DIVS=1)で受ける
                // blocksへのpush
                blocks.value.push({
                    BEGIN: iniValue,
                    TYPE_I: typeI,
                    NUM_I: numI,
                    EXPT: secValue,
                })
            })
            // 13. 最終エネルギーの格納
            blocks.value.push({
                BEGIN: finalEnergy,
                TYPE_I: TYPE_I.BY_FINAL,
                NUM_I: 1,
                EXPT: 1.0
            })

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
            formatF, eV2deg, eV2k, TYPE_I,
            licenseDialog, licenseContent,
            xtals, selectedXtal, changeXtalPlane,
            elementNames, selectedElement, selectedEdge, edges,
            selectedEdge, selectedEdgeValue, availableEdges,
            blocks, activeBlockMenuIndex, toggleBlockMenu,
            editingIndex, dialogOriginalValue, dialogInputValue,
            isDialogOpen_K, openDialog_K, cancelDialog_K,
            dialog_Kprefix, dialog_Ksuffix, dialog_Kpreci, dialog_Kstep,
            dialog_Kmin, dialog_Kmax, isOKDisabled_K, isInvalid_K, onInput_K, onBlur_K, onUpdate_K, onEnter_K,
            isDialogOpen_E, openDialog_E, cancelDialog_E,
            dialog_Emin, dialog_Emax, isOKDisabled_E, isInvalid_E, onInput_E, onBlur_E, onUpdate_E, onEnter_E,
            isDialogOpen_I, openDialog_I, cancelDialog_I, onUpdate_Itype,
            dialog_Isuffix, dialog_Iprecision, dialog_Istep,
            dialog_Imin, dialog_Imax, isOKDisabled_I, isInvalid_I, onInput_I, onBlur_I, onUpdate_I, onEnter_I, dialog_Itype,
            isDialogOpen_T, openDialog_T, cancelDialog_T,
            isOKDisabled_T, isInvalid_T, onInput_T, onBlur_T, onUpdate_T, onEnter_T,
            addBlock, removeBlock, mergeBlocks, splitBlock,
            onClick_Tplus, onClick_Tminus,
            onSaveAsAgenda, onLoadFromAgenda, loadAgendaFromFile,
            isDragging, onDrop,
            snackbar, snackbarText,
        }
    }
}).use(createVuetify()).mount('#app')