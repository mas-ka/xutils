import { createApp, ref, computed, onMounted, nextTick, } from 'vue'
import { createVuetify } from 'vuetify'

import * as Victoreens from './victoreens.js'

createApp({
    setup() {
        // refの宣言
        const licenseDialog = ref(false)
        const licenseContent = ref('')
        const sampleType = ref(null)        // 試料形状の種別
        const Foil_R = ref(8.94)            // 試料がフォイルだった場合の密度(g/cm3) ※初期値は銅箔
        const Pellet_D = ref(10)            // 試料がペレットだった場合の直径[mm]
        const Pellet_Def = ref(null)        // 試料がペレットだった場合の定義[厚さ || 重量]
        const Pellet_T = ref(1)             // 試料がペレットだった場合の厚さもしくは重量[mm || mg]
        const Pellet_Medium = ref(null)     // medium = BN
        const Pellet_Medium_Z = ref([5, 7]) // BN
        const Pellet_Medium_Ratio = ref([1, 1])
        const Pellet_Medium_Weight = ref([0.435535858178888, 0.564464141821112])
        const Pellet_Medium_Z_last = ref(0) // 最後の要素の原子番号
        const Pellet_Medium_Ratio_last = ref(0) // 最後の要素の比率
        const Elements = ref(Victoreens.elements)
        const ElementNamesZ = ref(Victoreens.getElementNamesZ())

        // ローカルの宣言 & 初期値
        const TYPE_SAMPLE = Object.freeze({
            FOIL: 1,
            PELLETE: 2,
        })
        sampleType.value = TYPE_SAMPLE.PELLETE // 初期値

        const TYPE_DEF_PELLETE = [
            { Id: 0, Type: "Thickness" },
            { Id: 1, Type: "Weight" }
        ]
        Pellet_Def.value = 0 // 初期値は「Thickness」

        const TYPE_MEDIUM_PELLETE = [
            { Id: 0, Type: "-" },
            { Id: 1, Type: "BN" },
            { Id: 2, Type: "Other..." }
        ]
        Pellet_Medium.value = 2 // 初期値は「BN」

        // マウント時にlicense.htmlを読み込む
        onMounted(async () => {
            try {
                const res = await fetch('license.html')
                licenseContent.value = await res.text()
            } catch (e) {
                console.error('Failed to load license.html', e)
            }
        })

        // ユーティリティ関数

        // medium選択時の処理
        const onSelect_Medium = () => {
            if (Pellet_Medium.value === 1) {
                // BNを選択した場合にBNに再初期化する
                Pellet_Medium_Z.value = [5, 7]
                Pellet_Medium_Ratio.value = [1, 1]
                Pellet_Medium_Weight.value = [0.435535858178888, 0.564464141821112]
                Pellet_Medium_Z_last.value = 0
                Pellet_Medium_Ratio_last.value = 0
            }
        }

        // medium=Other時のテーブル各行の元素が変更された場合
        const onChange_Medium_Z = (index) => {
            if (Pellet_Medium_Z.value[index] == 0) {
                // ゼロが選択されたのでその元素を削除する
                Pellet_Medium_Z.value.splice(index, 1)
                Pellet_Medium_Ratio.value.splice(index, 1)
                // Pellet_Medium_Weight.value.splice(index, 1)
            } // ゼロ以外なら元素の変更なので、特に何もすることはない
        }

        // medium=Other時のテーブル最終行に元素が追加された場合
        const onChange_Medium_Z_last = async () => {
            if (Pellet_Medium_Z_last.value === 0) {
                // 最終行でゼロが選ばれたのでその元素を削除する
                Pellet_Medium_Z.value.pop()
                Pellet_Medium_Ratio.value.pop()
                // Pellet_Medium_Weight.value.pop()
            } else {
                // 最終行に元素が追加されたので、配列を1つ伸長する
                Pellet_Medium_Z.value.push(Pellet_Medium_Z_last.value)
                Pellet_Medium_Ratio.value.push(1)
                // Pellet_Medium_Weight.value.push(0)
            }
            await nextTick()
            Pellet_Medium_Z_last.value = 0
            Pellet_Medium_Ratio_last.value = 0
        }

        // medium=Other時のテーブル最終行の比率が変更された場合
        const onSelect_Medium_Ratio_last = () => {
            if (Pellet_Medium_Ratio_last.value === 0) {
                // 最終行でゼロが選ばれたのでその元素を削除する
                Pellet_Medium_Z.value.pop()
                Pellet_Medium_Ratio.value.pop()
                Pellet_Medium_Weight.value.pop()
            } else {
                // 最終行に元素が追加されたので、配列を1つ伸長する
                Pellet_Medium_Z.value.push(Pellet_Medium_Z_last.value)
                Pellet_Medium_Ratio.value.push(Pellet_Medium_Ratio_last.value)
                Pellet_Medium_Weight.value.push(0)
            }
        }


        return {
            licenseDialog, licenseContent,
            TYPE_SAMPLE, sampleType,
            Foil_R,
            Pellet_D, Pellet_Def, Pellet_T, Pellet_Medium, Pellet_Medium_Z, Pellet_Medium_Ratio, Pellet_Medium_Weight, Pellet_Medium_Z_last, Pellet_Medium_Ratio_last,
            TYPE_DEF_PELLETE, TYPE_MEDIUM_PELLETE,
            Elements, ElementNamesZ,
            onSelect_Medium, onChange_Medium_Z, onChange_Medium_Z_last,
        }
    }
}).use(createVuetify()).mount('#app')