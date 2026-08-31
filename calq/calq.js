import { createApp, ref, computed, watch, onMounted, nextTick, } from 'vue'
import { createVuetify } from 'vuetify'

createApp({
    setup() {
        // refの宣言
        const licenseDialog = ref(false)
        const aboutTab = ref('overview')
        const helpContent = ref('')
        const showHelp = ref(false)
        const hasHelp = ref(false)
        const lambda = ref('1.5498')        // 初期波長は1.5498Å(=8keV)
        const Unit_lambda = ref('Å')        // 単位
        const radius = ref(80.0)          // 検出器の測定領域半径[mm]
        const Modes = ref([
            { name: "2θ [°]", value: 0 },
            { name: "d [nm]", value: 1 },
            { name: "d [Å]", value: 6 },
            { name: "q [/nm]", value: 2 },
            { name: "q [/Å]", value: 4 },
            { name: "s [/nm]", value: 3 },
            { name: "s [/Å]", value: 5 },
        ])
        const Mode = ref(Modes.value[3]) // 初期値: q [/nm]
        const lengths = ref([250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500])  // パス長[mm]の配列
        const BSdiameters = ref([2, 3, 5, 8])   // ビームストップ直径[mm]の配列

        // 本アプリ自身のライセンス条文（LICENSEファイルから動的読込）
        const appLicenseText = ref('Loading LICENSE...')

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
                name: 'sprintf-js',
                version: '1.1.3',
                license: 'BSD 3-Clause License',
                copyright: 'Copyright (c) 2007-present, Alexandru Mărășteanu <hello@alexei.ro>',
                text: `Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`
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

        // ヘルプを別タブで開く
        const openHelpInNewTab = function () {
            window.open('./help.html', '_blank')
        }

        // 初期化関数

        // 初期値の宣言
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
                const resHelp = await fetch('help.html')
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
                case 0: // 2θ [°]
                    return formatF(toDegrees(2 * Tin), 5, 2) + " - " + formatF(toDegrees(2 * Tout), 5, 2);
                case 4: // q [/Å]
                    return sprintf("%7.4f - %7.4f", Qin / 10, Qout / 10);
                case 3: // s [/nm]
                    return formatF(Sin, 7, 4) + " - " + formatF(Sout, 7, 4);
                case 5: // s [/Å]
                    return formatF(Sin / 10, 7, 4) + " - " + formatF(Sout / 10, 7, 4);
                case 1: // d [nm]
                    return formatF(Din, 5, 2) + " - " + formatF(Dout, 5, 2);
                case 6: // d [Å]
                    return formatF(Din * 10, 6, 2) + " - " + formatF(Dout * 10, 6, 2);
                case 2: // q [/nm]
                default:
                    // return formatF(Qin, 7, 4) + " - " + formatF(Qout, 7, 4);
                    return sprintf("%7.4f - %7.4f", Qin, Qout);
            }
        }


        return {
            licenseDialog, aboutTab, appLicenseText, ossLicenses,
            helpContent, showHelp, hasHelp, openHelpInNewTab,
            lambda, Unit_lambda, xrayValue,
            radius, Modes, Mode, lengths, BSdiameters,
            calcRanges,
        }
    }
}).use(createVuetify()).mount('#app')