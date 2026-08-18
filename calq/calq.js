import { createApp, ref, computed, watch, onMounted, nextTick, } from 'vue'
import { createVuetify } from 'vuetify'

createApp({
    setup() {
        // refの宣言
        const licenseDialog = ref(false)
        const licenseContent = ref('')
        const helpContent = ref('')
        const showHelp = ref(false)
        const lambda = ref('1.5498')        // 初期波長は1.5498Å(=8keV)
        const Unit_lambda = ref('Å')        // 単位
        const radius = ref(80.0)          // 検出器の測定領域半径[mm]
        const Modes = ref([
            { name: "2θ [°]", value: 0 },
            { name: "d [nm]", value: 1 },
            { name: "q [/nm]", value: 2 },
            { name: "s [/nm]", value: 3 },
        ])
        const Mode = ref(Modes.value[2])
        const lengths = ref([250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500])  // パス長[mm]の配列
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
        const formatF = function (f, w, d) {
            var z = Array(d + 1).join("0");
            var y = "" + f + ((("" + f).indexOf('.') < 0) ? "." + z : z);
            var t = "." + (y.split('\.'))[1].substr(0, d);
            if (Math.abs(f) < 1) {
                return '0' + Array(w - (y.split('\.'))[0].length - t.length + 2).join(" ") + (f < 0 ? "-" : "") + t;
            } else {
                return Array(w - (y.split('\.'))[0].length - t.length + 1).join(" ") + (y.split('\.'))[0] + t;
            }
        }

        const toDegrees = function (radian) {
            var toDegree = 180 / Math.PI;
            if (isNaN(radian)) return NaN;
            return radian * toDegree;
        }

        const calcTheta = function (R, L) {
            return 0.5 * Math.atan2(R, L);
        }

        // 初期化関数

        // 初期値の宣言
        onMounted(async () => {
            try {
                const res = await fetch('license.html')
                licenseContent.value = await res.text()
            } catch (e) {
                console.error('Failed to load license.html', e)
            }
            try {
                const resHelp = await fetch('help.html')
                helpContent.value = await resHelp.text()
            } catch (e) {
                console.error('Failed to load help.html', e)
            }
        })

        const calcRanges = function (mode, diameter, length) {
            let Tin = calcTheta(diameter / 2, length);
            let Tout = calcTheta(radius.value, length);
            let Qin = 4 * Math.PI * Math.sin(Tin) / lambda.value * 10;
            let Qout = 4 * Math.PI * Math.sin(Tout) / lambda.value * 10;
            let Din = 2 * Math.PI / Qin;
            let Dout = 2 * Math.PI / Qout;
            let Sin = 2 * Math.sin(Tin) / lambda.value * 10;
            let Sout = 2 * Math.sin(Tout) / lambda.value * 10;
            switch (mode) {
                case 0: // 2θ
                    return formatF(toDegrees(2 * Tin), 5, 2) + " - " + formatF(toDegrees(2 * Tout), 5, 2);
                case 1: // d
                    return formatF(Din, 5, 2) + " - " + formatF(Dout, 5, 2);
                case 3: // s
                    return formatF(Sin, 7, 4) + " - " + formatF(Sout, 7, 4);
                case 2: // q
                default:
                    // return formatF(Qin, 7, 4) + " - " + formatF(Qout, 7, 4);
                    return sprintf("%7.4f - %7.4f", Qin, Qout);
            }
        }


        return {
            licenseDialog, licenseContent, helpContent, showHelp,
            lambda, Unit_lambda, xrayValue,
            radius, Modes, Mode, lengths, BSdiameters,
            calcRanges,
        }
    }
}).use(createVuetify()).mount('#app')