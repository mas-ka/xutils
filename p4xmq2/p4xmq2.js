import { createApp, ref, computed, watch, onMounted, nextTick } from 'vue'
import { createVuetify } from 'vuetify'

import { elements, edges, getElementNames, getElementByName } from './elements.js'

createApp({
    setup() {
        // refの宣言
        const licenseDialog = ref(false)
        const licenseContent = ref('')
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

        onMounted(async () => {
            try {
                const res = await fetch('license.html')
                licenseContent.value = await res.text()
            } catch (e) {
                console.error('Failed to load license.html', e)
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
        const eV2deg = function (e, d) { return Math.toDegrees(Math.asin(12398.4264684 / (2 * d * e))); }
        const deg2eV = function (t, d) { return 12398.4264684 / (2 * d * Math.sin(Math.toRadians(t))); }
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



        const changeXtalPlane = function () {
            console.log('changeXtalPlane called')
        }

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
            console.log(list)
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

        return {
            formatF, eV2deg, eV2k,
            licenseDialog,
            licenseContent,
            xtals,
            selectedXtal,
            changeXtalPlane,
            elementNames,
            selectedElement, selectedEdge,
            edges,
            selectedEdge,
            selectedEdgeValue,
            availableEdges,
            Ebegin, Eend, Estep,
            beginDelta, Kend, expTime,
            onChange_Ebegin, onChange_beginDelta,
            onChange_Eend, onChange_Kend,
            onChange_expTime,
        }
    }
}).use(createVuetify()).mount('#app')