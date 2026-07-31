import { createApp, ref, computed, watch, onMounted, nextTick, } from 'vue'
import { createVuetify } from 'vuetify'

createApp({
    setup() {
        // refの宣言
        const licenseDialog = ref(false)
        const licenseContent = ref('')
        const lambda = ref('1.5498')        // 初期波長は1.5498Å(=8keV)
        const Unit_lambda = ref('Å')        // 単位
        const radius = ref(80.0)          // 検出器の測定領域半径[mm]
        const lengths = ref([250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000])  // パス長[mm]の配列
        const BSdiameters = ref([2, 3, 5, 8])   // ビームストップ直径[mm]の配列

        const xrayValue = computed({
            get() {
                if (!lambda.value) return ''
                if (Unit_lambda.value === 'eV') {
                    const ev = 12398.4264684 / Number(lambda.value)
                    return Number(ev.toFixed(2))
                }
                return Number(Number(lambda.value).toFixed(4))
            },
            set(val) {
                if (!val) {
                    lambda.value = ''
                    return
                }
                if (Unit_lambda.value === 'eV') {
                    lambda.value = String(12398.4264684 / Number(val))
                } else {
                    lambda.value = String(val)
                }
            }
        })

        // ローカルの宣言

        // ユーティリティ関数

        // 初期化関数

        // 初期値の宣言
        onMounted(async () => {
            try {
                const res = await fetch('license.html')
                licenseContent.value = await res.text()
            } catch (e) {
                console.error('Failed to load license.html', e)
            }
        })



        return {
            licenseDialog, licenseContent,
            lambda, Unit_lambda, xrayValue,
            radius, lengths, BSdiameters,
        }
    }
}).use(createVuetify()).mount('#app')