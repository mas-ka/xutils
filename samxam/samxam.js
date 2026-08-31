import { createApp, ref, onMounted, nextTick, watchEffect } from 'vue'
import { createVuetify } from 'vuetify'

import * as Victoreens from './victoreens.js'

createApp({
    setup() {
        // refの宣言
        const licenseDialog = ref(false)
        const aboutTab = ref('overview')
        const appLicenseText = ref('Loading LICENSE...')
        const helpContent = ref('')
        const showHelp = ref(false)
        const hasHelp = ref(false)

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

        const Elements = ref(Victoreens.elements)
        const ElementNamesZ = ref(Victoreens.getElementNamesZ())
        const Lambda = ref(1.380840)        // Cu-K [Å]
        const sampleType = ref(null)        // 試料形状の種別
        const Foil_R = ref(8.94)            // 試料がフォイルだった場合の密度(g/cm3) ※初期値は銅箔
        const Pellet_D = ref(10)            // 試料がペレットだった場合の直径[mm]
        const Pellet_Def = ref(null)        // 試料がペレットだった場合の定義[厚さ || 重量]
        const Pellet_T = ref(1)             // 試料がペレットだった場合の厚さもしくは重量[mm || mg]
        const Pellet_Medium = ref(null)     // medium = BN
        const Pellet_Medium_Z = ref([5, 7]) // BN
        const Pellet_Medium_Ratio = ref([1, 1])
        const Pellet_Medium_Weight = ref([]) // mediumの重量分率(※動的に計算される)
        const Pellet_Medium_Z_last = ref(0)     // 最後の要素の原子番号
        const Pellet_Medium_Ratio_last = ref(0) // 最後の要素の比率
        const Pellet_Sample_TargetId = ref(0)   // 試料中のターゲット元素のインデックス
        const Pellet_Sample_Edge = ref(null)    // 試料の吸収端
        const Pellet_Sample_Z = ref([29])       // 試料の原子番号
        const Pellet_Sample_Ratio = ref([1])    // 試料の原子数もしくは重量分率
        const Pellet_Sample_Weight = ref([])    // 試料の重量分率(※動的に計算される)
        const Pellet_Sample_Z_last = ref(0)     // 最後の要素の原子番号
        const Pellet_Sample_Ratio_last = ref(0) // 最後の要素の比率
        const Pellet_Sample_RatioType = ref(0)  // 試料組成の種別、0:原子数比, 1:重量分率
        const MuT_H_4 = ref(4.000)              // μtH=4
        const MuT_L_4 = ref(1.286)              // μtH=4の時のμtL=1.286
        const dMuT_4 = ref(2.714)               // μtH=4の時のΔμt=2.714
        const Res_4 = ref(8.47)                 // μtH=4の時のWeight=8.47
        const MuT_H_2 = ref(2.500)              // μtH=2.5
        const MuT_L_2 = ref(1.098)              // μtH=2.5の時のμtL=1.098
        const dMuT_2 = ref(1.402)               // μtH=2.5の時のΔμt=1.402
        const Res_2 = ref(4.38)                 // μtH=2.5の時のWeight=4.38
        const MuT_H_1 = ref(2.041)              // Δμt=1.0の時のμtH=2.041
        const MuT_L_1 = ref(1.041)              // Δμt=1.0の時のμtL=1.041
        const dMuT_1 = ref(1.000)               // Δμt=1.0
        const Res_1 = ref(3.12)                 // Δμt=1.0の時のWeight=3.12
        const MuT_H_o = ref(1.263)              // Weight=1mgの時のμtH=1.263
        const MuT_L_o = ref(0.943)              // Weight=1mgの時のμtL=0.943
        const dMuT_o = ref(0.320)               // Weight=1mgの時のΔμt=0.320
        const Res_o = ref(1.00)                 // Weight=1mg

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
        Pellet_Medium.value = 1 // 初期値は「BN」

        const TYPE_EDGE = [
            { Id: 0, Name: "K" },
            { Id: 1, Name: "L1" },
            { Id: 2, Name: "L2" },
            { Id: 3, Name: "L3" }
        ]
        Pellet_Sample_Edge.value = 0 // 初期値は「K」

        const TYPE_RATIO = [
            { Id: 0, Type: "Atom" },
            { Id: 1, Type: "Mass" }
        ]
        Pellet_Sample_RatioType.value = TYPE_RATIO[0].Id // 初期値は「Atom」

        // マウント時にlicense.htmlおよびhelp.htmlを読み込む
        onMounted(async () => {
            try {
                const res = await fetch('license.html')
                licenseContent.value = await res.text()
            } catch (e) {
                console.error('Failed to load license.html', e)
            }
            try {
                const resHelp = await fetch('help.html')
                if (resHelp.ok) {
                    helpContent.value = await resHelp.text()
                    hasHelp.value = true
                }
            } catch (e) {
                console.error('Failed to load help.html', e)
            }
        })

        // ユーティリティ関数

        // medium選択時の処理
        const onSelect_Medium = () => {
            if (Pellet_Medium.value === 0) {
                // meiumなしを選択した場合
                Pellet_Medium_Z.value = []
                Pellet_Medium_Ratio.value = []
                Pellet_Medium_Z_last.value = 0
                Pellet_Medium_Ratio_last.value = 0
            }
            if (Pellet_Medium.value === 1) {
                // BNを選択した場合にBNに再初期化する
                Pellet_Medium_Z.value = [5, 7]
                Pellet_Medium_Ratio.value = [1, 1]
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

        // Pellete_Meduimを監視してPellet_Medium_Weightを更新する
        watchEffect(() => {
            let M_total = 0
            Pellet_Medium_Z.value.forEach((Z, index) => {
                M_total += Pellet_Medium_Ratio.value[index] * Elements.value[Z].A
            })

            const weights = []
            Pellet_Medium_Z.value.forEach((Z, index) => {
                weights.push((Pellet_Medium_Ratio.value[index] * Elements.value[Z].A) / M_total)
            })
            Pellet_Medium_Weight.value = weights
        })

        // sampleのtableの各行の元素が変更された場合
        const onChange_Sample_Z = (index) => {
            if (Pellet_Sample_Z.value[index] == 0) { // ある行の元素がゼロ番目のものに変更された
                // ゼロ番目が選択されたのでその元素を削除する
                Pellet_Sample_Z.value.splice(index, 1)
                Pellet_Sample_Ratio.value.splice(index, 1)
                if (index < Pellet_Sample_TargetId.value) {
                    // 削除した元素がターゲットより前だったらターゲットのインデックスをシフトさせる
                    Pellet_Sample_TargetId.value -= 1
                } else if (index === Pellet_Sample_TargetId.value) {
                    // 削除した元素がターゲットだった場合
                    if (index > 0) { // ゼロ番目以外ならインデックスを１つ減らす
                        Pellet_Sample_TargetId.value -= 1
                    } else { // ゼロ番目ならゼロのままにしておく
                        Pellet_Sample_TargetId.value = 0
                    }
                }
            } else if (index === Pellet_Sample_TargetId.value) {// ターゲット元素が変更された場合
                if (sampleType.value == TYPE_SAMPLE.FOIL) { // Foil
                    Foil_R.value = Victoreens.getRhoByZ(Pellet_Sample_Z.value[index])
                }
            }
        }

        // sampleのtableの最終行に元素が追加された場合
        const onChange_Sample_Z_last = async () => {
            if (Pellet_Sample_Z_last.value === 0) {
                // 最終行でゼロが選ばれたのでその元素を削除する
                Pellet_Sample_Z.value.pop()
                Pellet_Sample_Ratio.value.pop()
            } else {
                // 最終行に元素が追加されたので、配列を1つ伸長する
                Pellet_Sample_Z.value.push(Pellet_Sample_Z_last.value)
                Pellet_Sample_Ratio.value.push(1)
            }
            await nextTick()
            Pellet_Sample_Z_last.value = 0
            Pellet_Sample_Ratio_last.value = 0
        }

        const calcPelletMediumMoRG = function () {
            let G // [g]
            switch (Pellet_Medium.value) {
                case 0: // No medium
                    return 0.0;
                case 1: // BN
                    if (Pellet_Def.value == 0) { // Thickness
                        G = Pellet_T.value * 0.1735 // BN 173.5mg/mm
                    } else { // Weight
                        G = Pellet_T.value / 1000.0 // mg -> g
                    }
                    return G * (Victoreens.getMoR(5, Lambda.value) * 0.435536 + Victoreens.getMoR(7, Lambda.value) * 0.564464)
                case 2: // Other...
                    G = Pellet_T.value / 1000.0 // mg -> g
                    var MoR = 0.0
                    Pellet_Medium_Z.value.forEach((Z, index) => {
                        MoR += Victoreens.getMoR(Z, Lambda.value) * Pellet_Medium_Weight.value[index]
                    })
                    return G * MoR;
            }
        }

        // Δμtが指定値となる重量を求める
        const calcGramByDeltaMuT = function (d) {
            // ターゲット元素の指定吸収端前後の質量吸収係数を求める
            let BothMoR = Victoreens.getBothMoR(Pellet_Sample_Z.value[Pellet_Sample_TargetId.value], Pellet_Sample_Edge.value);
            return Math.PI * Math.pow(Pellet_D.value / 20.0, 2) * d / (BothMoR[0] - BothMoR[1]) / Pellet_Sample_Weight.value[Pellet_Sample_TargetId.value];
        }

        // μt_Hが指定値となる重量を求める
        const calcGramByMuTH = function (H) {
            let MoRw = 0.0
            Pellet_Sample_Weight.value.forEach((w, i) => {
                if (i != Pellet_Sample_TargetId.value) {
                    MoRw += Victoreens.getMoR(Pellet_Sample_Z.value[i], Lambda.value) * w
                }
            })
            MoRw += Victoreens.getBothMoR(Pellet_Sample_Z.value[Pellet_Sample_TargetId.value], Pellet_Sample_Edge.value)[0] * Pellet_Sample_Weight.value[Pellet_Sample_TargetId.value];
            let PRR = Math.PI * Math.pow(Pellet_D.value / 20.0, 2); // πr^2 [cm^2]
            return (PRR * H - calcPelletMediumMoRG()) / MoRw;
        }

        // 指定重量でのμt_H,μt_Lを求める
        const calcAllMuTByGram = function (g) {
            let BothMoR = Victoreens.getBothMoR(Pellet_Sample_Z.value[Pellet_Sample_TargetId.value], Pellet_Sample_Edge.value) // ターゲット元素の指定吸収端前後の質量吸収係数を求める
            let PRR = Math.PI * Math.pow(Pellet_D.value / 20.0, 2) // πr^2 [cm^2]
            let MoR = 0.0
            Pellet_Sample_Weight.value.forEach((w, i) => {
                if (i != Pellet_Sample_TargetId.value) {
                    MoR += Victoreens.getMoR(Pellet_Sample_Z.value[i], Lambda.value) * w
                }
            })
            let MoRG_M = calcPelletMediumMoRG()
            let MuT_H = (g * (MoR + BothMoR[0] * Pellet_Sample_Weight.value[Pellet_Sample_TargetId.value]) + MoRG_M) / PRR
            let MuT_L = (g * (MoR + BothMoR[1] * Pellet_Sample_Weight.value[Pellet_Sample_TargetId.value]) + MoRG_M) / PRR
            return [MuT_H, MuT_L]
        }

        // Δμtが指定値となるフォイル厚さ[cm]を求める
        const calcCMByDeltaMuT = function (d) {
            // ターゲット元素の指定吸収端前後の質量吸収係数を求める
            let BothMoR = Victoreens.getBothMoR(Pellet_Sample_Z.value[Pellet_Sample_TargetId.value], Pellet_Sample_Edge.value)
            return d / (Foil_R.value * (BothMoR[0] - BothMoR[1]) * Pellet_Sample_Weight.value[Pellet_Sample_TargetId.value])
        }

        // μt_Hが指定値となるフォイル厚さ[cm]を求める
        const calcCMByMuTH = function (H) {
            let MoRw = 0.0
            Pellet_Sample_Weight.value.forEach((w, i) => {
                if (i != Pellet_Sample_TargetId.value) {
                    MoRw += Victoreens.getMoR(Pellet_Sample_Z.value[i], Lambda.value) * w
                }
            })
            MoRw += Victoreens.getBothMoR(Pellet_Sample_Z.value[Pellet_Sample_TargetId.value], Pellet_Sample_Edge.value)[0] * Pellet_Sample_Weight.value[Pellet_Sample_TargetId.value]
            return H / MoRw / Foil_R.value
        }

        // 指定厚さでのμt_H,μt_Lを求める
        const calcAllMuTByCM = function (t) {
            // ターゲット元素の指定吸収端前後の質量吸収係数を求める
            let BothMoR = Victoreens.getBothMoR(Pellet_Sample_Z.value[Pellet_Sample_TargetId.value], Pellet_Sample_Edge.value)
            let MoRw = 0.0
            Pellet_Sample_Weight.value.forEach((w, i) => {
                if (i != Pellet_Sample_TargetId.value) {
                    MoRw += Victoreens.getMoR(Pellet_Sample_Z.value[i], Lambda.value) * w
                }
            })
            let MuT_H = t * Foil_R.value * (MoRw + BothMoR[0] * Pellet_Sample_Weight.value[Pellet_Sample_TargetId.value])
            let MuT_L = t * Foil_R.value * (MoRw + BothMoR[1] * Pellet_Sample_Weight.value[Pellet_Sample_TargetId.value])
            return [MuT_H, MuT_L]
        }


        // Pellete_Sample_Ratioを監視してPellet_Sample_Weightを更新し、さらにResultsも更新する
        watchEffect(() => {
            // Pellet_Sample_Weightを更新
            if (Pellet_Sample_RatioType.value === 0) {// Atom : 原子数
                let M_total = 0
                Pellet_Sample_Ratio.value.forEach((ratio, index) => {
                    M_total += ratio * Elements.value[Pellet_Sample_Z.value[index]].A
                })
                const weights = []
                Pellet_Sample_Ratio.value.forEach((ratio, index) => {
                    weights.push(ratio * Elements.value[Pellet_Sample_Z.value[index]].A / M_total)
                })
                Pellet_Sample_Weight.value = weights
            } else {// Mass : 重量分率
                let M_total = 0
                // Pellet_Sample_Ratio.valueの総和を求める
                Pellet_Sample_Ratio.value.forEach((ratio) => M_total += ratio)
                // Pellet_Sample_Weight.valueを計算する
                const weights = []
                Pellet_Sample_Ratio.value.forEach((ratio) => weights.push(ratio / M_total))
                Pellet_Sample_Weight.value = weights
            }
            // Resultsを更新
            // ターゲット元素のエッジ波長を再設定
            Lambda.value = Victoreens.getLambdaOfEdge(Pellet_Sample_Z.value[Pellet_Sample_TargetId.value], Pellet_Sample_Edge.value)
            if (sampleType.value === TYPE_SAMPLE.FOIL) { // フォイルの場合
                let t = 0.0
                let r = []
                // Δμt=1となる厚さを求め、そこからμt_H,μt_Lを求める
                t = calcCMByDeltaMuT(1.0)
                r = calcAllMuTByCM(t)
                MuT_H_1.value = r[0]; MuT_L_1.value = r[1]; Res_1.value = t * 10000;
                // μt_H=4となる厚さを求め、そこからμt_H,μt_Lを求める
                t = calcCMByMuTH(4.0)
                r = calcAllMuTByCM(t)
                MuT_H_4.value = r[0]; MuT_L_4.value = r[1]; dMuT_4.value = r[0] - r[1]; Res_4.value = t * 10000;
                // μt_H=2.5となる厚さを求め、そこからμt_H,μt_Lを求める
                t = calcCMByMuTH(2.5)
                r = calcAllMuTByCM(t)
                MuT_H_2.value = r[0]; MuT_L_2.value = r[1]; dMuT_2.value = r[0] - r[1]; Res_2.value = t * 10000;
                // Res_oからμt_H,μt_Lを求める
                r = calcAllMuTByCM(Res_o.value / 10000.0)
                MuT_H_o.value = r[0]; MuT_L_o.value = r[1]; dMuT_o.value = r[0] - r[1]
            } else { // ペレットの場合
                let g = 0.0
                let r = []
                // Δμt=1となるグラムを求め、そこからμt_H,μt_Lを求める
                g = calcGramByDeltaMuT(1.0);
                r = calcAllMuTByGram(g);
                MuT_H_1.value = r[0]; MuT_L_1.value = r[1]; Res_1.value = g * 1000;
                // μt_H=4となるグラムを求め、そこからμt_H,μt_Lを求める
                g = calcGramByMuTH(4.0);
                r = calcAllMuTByGram(g);
                MuT_H_4.value = r[0]; MuT_L_4.value = r[1]; dMuT_4.value = r[0] - r[1]; Res_4.value = g * 1000;
                // μt_H=2.5となるグラムを求め、そこからμt_H,μt_Lを求める
                g = calcGramByMuTH(2.5);
                r = calcAllMuTByGram(g);
                MuT_H_2.value = r[0]; MuT_L_2.value = r[1]; dMuT_2.value = r[0] - r[1]; Res_2.value = g * 1000;
                // Res_oからμt_H,μt_Lを求める
                r = calcAllMuTByGram(Res_o.value / 1000.0);
                MuT_H_o.value = r[0]; MuT_L_o.value = r[1]; dMuT_o.value = r[0] - r[1];
            }
        })


        // 各行全体の警告クラス判定
        const getRow4Class = function () {
            if (Res_4.value < 0) return 'bg-red-lighten-5 text-red-darken-4'
            if (Res_4.value >= 0 && Res_4.value < 0.1) return 'bg-amber-lighten-5 text-amber-darken-4'
            return ''
        }

        const getRow2Class = function () {
            if (Res_2.value < 0) return 'bg-red-lighten-5 text-red-darken-4'
            if (Res_2.value >= 0 && Res_2.value < 0.1) return 'bg-amber-lighten-5 text-amber-darken-4'
            return ''
        }

        const getRow1Class = function () {
            if (Res_1.value < 0 || MuT_H_1.value > 4.0) return 'bg-red-lighten-5 text-red-darken-4'
            if ((Res_1.value >= 0 && Res_1.value < 0.1) || (MuT_H_1.value > 2.5 && MuT_H_1.value <= 4.0)) return 'bg-amber-lighten-5 text-amber-darken-4'
            return ''
        }

        const getRowOClass = function () {
            if (Res_o.value < 0 || MuT_H_o.value > 4.0) return 'bg-red-lighten-5 text-red-darken-4'
            if ((Res_o.value >= 0 && Res_o.value < 0.1) || (MuT_H_o.value > 2.5 && MuT_H_o.value <= 4.0)) return 'bg-amber-lighten-5 text-amber-darken-4'
            return ''
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
            licenseDialog, aboutTab, appLicenseText, ossLicenses, helpContent, showHelp, hasHelp, openHelpInNewTab,
            getRow4Class, getRow2Class, getRow1Class, getRowOClass,
            TYPE_SAMPLE, sampleType, Lambda,
            Foil_R,
            Pellet_D, Pellet_Def, Pellet_T, Pellet_Medium, Pellet_Medium_Z, Pellet_Medium_Ratio, Pellet_Medium_Weight, Pellet_Medium_Z_last, Pellet_Medium_Ratio_last,
            TYPE_DEF_PELLETE, TYPE_MEDIUM_PELLETE,
            Elements, ElementNamesZ,
            onSelect_Medium, onChange_Medium_Z, onChange_Medium_Z_last,
            Pellet_Sample_TargetId, Pellet_Sample_Edge, Pellet_Sample_Z, Pellet_Sample_Ratio, Pellet_Sample_Weight,
            Pellet_Sample_Z_last, Pellet_Sample_Ratio_last, TYPE_EDGE, Pellet_Sample_RatioType, TYPE_RATIO,
            onChange_Sample_Z, onChange_Sample_Z_last,
            MuT_H_4, MuT_L_4, dMuT_4, Res_4,
            MuT_H_2, MuT_L_2, dMuT_2, Res_2,
            MuT_H_1, MuT_L_1, dMuT_1, Res_1,
            MuT_H_o, MuT_L_o, dMuT_o, Res_o,
        }
    }
}).use(createVuetify()).mount('#app')