var app = angular.module('myApp', ['ngMaterial', 'ngResource', 'ngSanitize']);

app.directive('keepMaxDecimals', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            var maxDecimals = parseInt(attrs.keepMaxDecimals, 10) || 2;

            // 【超重要】JS側のモデル（ng-model）の値が書き換わった時、
            // 画面（DOM）に出力される直前で常にキャッチして丸める処理
            ngModelCtrl.$formatters.push(function(value) {
                if (value === undefined || value === null || isNaN(value)) {
                    return value;
                }

                // 小数点以下の桁数を確認
                var str = value.toString();
                if (str.indexOf('.') !== -1) {
                    var parts = str.split('.');
                    if (parts[1].length > maxDecimals) {
                        // 指定桁（2桁）を超えていたら、表示用だけに四捨五入（または切り捨て）した数値を返す
                        var multiplier = Math.pow(10, maxDecimals);
                        return Math.round(value * multiplier) / multiplier;
                    }
                }
                return value;
            });
        }
    };
});

app.controller('myController', function($resource, $mdDialog, numberFilter){
    var org = this;

    this.EL = 12398.4264684;

    this.xtals = [
        {name:'Si(111)', d:3.13551},
        {name:'Si(311)', d:1.63747},
        {name:'Si(220)', d:1.92010},
        {name:'Other...', d:3.13551}
    ];
    this.xtal = this.xtals[0];
    this.isNotIntrinsicPlane = false;
    this.changeXtalPlane = function() {
        this.isNotIntrinsicPlane = (this.xtal.name=="Other...");
        this.applyAbsEnergy();
    }
    this.getXtalPlaneName = function() {
        if (this.isNotIntrinsicPlane) {
            return "UNKNOWN";
        } else {
            return (this.xtal.name).toUpperCase();
        }
    }

    this.ElementNames = getElementNames();
    this.element_name = "Cu";

    this.EdgeNames = ["K", "L1", "L2", "L3"];
    this.edge = "K";
    this.applyEdges = function(name) {
        this.EdgeNames = [];
        var element = getElementByName(name);
        if (element.K > 0) this.EdgeNames.push("K");
        if (element.L1 > 0) this.EdgeNames.push("L1");
        if (element.L2 > 0) this.EdgeNames.push("L2");
        if (element.L3 > 0) this.EdgeNames.push("L3");
        if (element.M > 0) this.EdgeNames.push("M");
        else if (this.edge == "M") this.edge = "K";
        this.applyAbsEnergy();
        this.createFileName();
    }

    this.AbsEnergy = 8981.00;
    this.applyAbsEnergy = function() {
        var element = getElementByName(this.element_name);
        this.AbsEnergy = element[this.edge];
        const e0 = (getElementByName(this.element_name))[this.edge];
        this.e_begin = e0 - 330;
        this.k_end = 20.0;
        this.e_end = this.k2energy(this.k_end, e0);
        this.step_for_quick = this.calcDeltaE();
        this.total_points = this.calcTotalPoints();
        this.degpsec = this.calcDegPSec();
        this.createFileName();
    }

    this.fname_param = "Cu-K_Q.param";
    this.fname_agenda = "Cu-K_Q.agenda";
    this.createFileName = function() {
        this.fname_param = this.element_name+"-"+this.edge+"_Q.param";
        this.fname_agenda = this.element_name+"-"+this.edge+"_Q.agenda";
    }

    this.energy2theta = function(e) { return Math.toDegrees(Math.asin(this.EL/(2*this.xtal.d*e))); }
    this.theta2energy = function(t) { return this.EL/(2*this.xtal.d*Math.sin(Math.toRadians(t))); }
    this.k2energy = function(k, e0) { return e0 + k*k / 0.262467191; }
    this.energy2k = function(e, e0) { return Math.sqrt(0.262467191 * (e - e0)); }
    Math.toDegrees = function(radian){
        var toDegree = 180/Math.PI;
        if(isNaN(radian)) return NaN;
        return radian * toDegree;
    }
    Math.toRadians = function(degree){
        return isNaN(degree)?NaN:degree*Math.PI/180;
    }
    Math.formatFloat = function(f, s){
        var z = Array(s+1).join("0");
        var t = ""+f+(((""+f).indexOf('.')<0)?"."+z:z);
        return parseFloat((t.split('\.'))[0]+"."+(t.split('\.'))[1].substr(0,s));
    }
    String.formatF = function(f, w, d) {
        var z = Array(d+1).join("0");
        var y = ""+f+(((""+f).indexOf('.')<0)?"."+z:z);
        var t = "."+(y.split('\.'))[1].substr(0,d);
        if (Math.abs(f) < 1) {
            return Array(w - (y.split('\.'))[0].length - t.length + 2).join(" ")+(f<0?"-":"")+t;
        } else {
            return Array(w - (y.split('\.'))[0].length - t.length + 1).join(" ")+(y.split('\.'))[0]+t;
        }
    }
    String.formatI = function(i, w) {
        return Array(w - (""+i).length + 1).join(" ")+i;
    }

    this.updateE = function () {
        this.k_end = this.energy2k(this.e_end, this.AbsEnergy);
        this.checkStep4Q();
        this.checkDegPSec();
    }

    this.updateK = function() {
        this.e_end = this.k2energy(this.k_end, this.AbsEnergy);
        this.checkStep4Q();
        this.checkDegPSec();
    }

    this.calcDeltaE = function() {
        //const dT = (this.energy2theta(this.AbsEnergy-30) - this.energy2theta(this.k2energy(4, this.AbsEnergy))) / 250.0 ;
        //return this.theta2energy(this.energy2theta(this.AbsEnergy) - dT) - (this.AbsEnergy);
        return (this.k2energy(4, this.AbsEnergy) - (this.AbsEnergy - 30)) / 250.0 ; // これはXUIM3での定義(※角度換算はしていない)
    }

    this.calcTotalPoints = function() {
        return Math.trunc(
            (this.energy2theta(this.e_begin) - this.energy2theta(this.e_end))
            / (this.energy2theta(this.AbsEnergy) - this.energy2theta(this.AbsEnergy + this.step_for_quick))
            + 1
        );
    }

    this.checkStep4Q = function() {
        this.total_points = this.calcTotalPoints();
        this.warning_points = (this.total_points > 8190);
    }

    this.calcDegPSec = function() {
        return (this.energy2theta(this.e_begin) - this.energy2theta(this.e_end)) / this.time_for_quick;
    }

    this.checkDegPSec = function() {
        this.degpsec = this.calcDegPSec();
        this.warning_dps = (this.degpsec > 0.13888);
    }

    this.resetParams = function() {
        this.applyAbsEnergy();
    }

    // 起動時のパラメータ
    this.k_end = 20;
    this.e_begin = 8651.0; this.e_end = 10505.0;
    this.step_for_quick = this.calcDeltaE();
    this.total_points = this.calcTotalPoints();
    this.time_for_quick = 120;
    this.warning_points = false;
    this.degpsec = this.calcDegPSec();
    this.warning_dps = false;
 
    this.refresh;

    this.saveTextFile = function(txt, fname, id) {
        var blob = new Blob([ txt ], { "type" : "text/plain" });
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, fname);
            // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
            window.navigator.msSaveOrOpenBlob(blob, fname);
        } else document.getElementById(id).href = window.URL.createObjectURL(blob);
    }

    this.createText4SagaAgenda = function() {
        var l = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>\r\n";
        l += "<parameter>\r\n";
        l += "  <monochrometer>\r\n";
        l += "    <d_spacing unit=\"angstrom\">"+String.formatF(this.xtal.d, 10, 6).trim()+"</d_spacing>\r\n";
        l += "    <name>"+this.getXtalPlaneName().trim()+"</name>\r\n";
        l += "  </monochrometer>\r\n";
        l += "  <element>\r\n";
        l += "    <symbol>"+this.element_name+"</symbol>\r\n";
        l += "    <edge>"+this.edge+"</edge>\r\n";
        l += "  </element>\r\n";
        l += "  <scan type=\"quick\">\r\n";
        l += "    <edge_energy unit=\"eV\">"+String.formatF(this.AbsEnergy, 10, 2).trim()+"</edge_energy>\r\n";
        l += "    <agenda final=\""+String.formatF(this.e_end, 10, 2).trim()
                    +"\" step_for_quick=\""+String.formatF(this.step_for_quick, 10, 5).trim()
                    +"\" time_for_quick=\""+String.formatI(this.time_for_quick, 10).trim()
                    +"\" unit=\"eV\">\r\n";
        // block id="1"のみ出力
        l += "      <block id=\"1\">\r\n";
        l += "        <ini>"+String.formatF(this.e_begin, 10, 2).trim()+"</ini>"
                    + "<div>50</div>"
                    + "<sec>1</sec>\r\n";
        l += "      </block>\r\n";
        l += "    </agenda>\r\n";
        l += "  </scan>\r\n"
        l += "</parameter>\r\n";
        return l;
    }

    this.downloadAsSagaAgenda = function() {
        var txt = this.createText4SagaAgenda();
        this.saveTextFile(txt, this.element_name+"-"+this.edge+"_Q.agenda", "download_agenda");
    }

    this.fileData = null;
    this.xmlDoc = null;

    this.openDialogForAgenda = function() { document.getElementById('upload_agenda').click(); }
    this.importFromAgenda = function(event) {
        const files = event.target.files; // 選択されたファイルのリスト
        if (files.length > 0) {
            const file = files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                // DOM操作をAngularJSに通知するために $apply を使う
                // ※$scopeの代わりに $rootScope.$apply() を使用
                angular.element(document).injector().get('$rootScope').$apply(function() {
                    this.fileData = e.target.result;
                    // 読み込んだAgendaファイルをパースしてXMLドキュメントにする
                    var parser = new DOMParser();
                    this.xmlDoc = parser.parseFromString(this.fileData, "text/xml");
                    // AgendaXMLのXPathによるパース
                    var result = xmlDoc.evaluate('//scan/@type', xmlDoc, null, XPathResult.STRING_TYPE, null);
                    if (result.stringValue.toUpperCase() == 'STEP') { // StepスキャンのAgendaだったのでアラート出して終了
                        $mdDialog.show(
                            $mdDialog.alert()
                            .title("   A L E R T   ")
                            .textContent("This agenda file is for STEP !")
                            .clickOutsideToClose(true)
                            .ok('OK')
                        );
                        document.getElementById('upload_agenda').value = ''; // 読み込み履歴を空にする
                        return;
                    } // StepスキャンのAgendaだった
                    // Monochrometerタグ
                    var result = xmlDoc.evaluate('//monochrometer/name/text()', xmlDoc, null, XPathResult.STRING_TYPE, null);
                    if (result.stringValue.toUpperCase() === 'SI(111)')  org.xtal = org.xtals[0];
                    else if (result.stringValue.toUpperCase() === 'SI(311)')  org.xtal = org.xtals[1];
                    else if (result.stringValue.toUpperCase() === 'SI(220)')  org.xtal = org.xtals[2];
                    else {
                        org.xtal = org.xtals[3];
                        org.xtal.d = xmlDoc.evaluate('//monochrometer/d_spacing/text()', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue
                    }
                    org.changeXtalPlane();
                    // Elementタグ
                    var result = xmlDoc.evaluate('//element/symbol/text()', xmlDoc, null, XPathResult.STRING_TYPE, null);
                    org.element_name = (getElementByName(result.stringValue)).name;
                    org.applyEdges(org.element_name);
                    org.edge = xmlDoc.evaluate('//element/edge/text()', xmlDoc, null, XPathResult.STRING_TYPE, null).stringValue.toUpperCase();
                    // Agendaタグ
                    // final属性, step_for_quick属性, time_for_quick属性
                    org.e_end = xmlDoc.evaluate('//agenda/@final', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                    org.step_for_quick = xmlDoc.evaluate('//agenda/@step_for_quick', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                    org.time_for_quick = xmlDoc.evaluate('//agenda/@time_for_quick', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                    // id=1のblockからiniだけ読み込む
                    org.e_begin = xmlDoc.evaluate('//agenda/block[@id=\"1\"]/ini/text()', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                    // 他パラメータの補完
                    org.updateE();
                    org.checkStep4Q();
                    org.checkDegPSec();
                });
            };
            reader.readAsText(file);
        }
    }

    this.showLicenseDlg = function($event) {
        $resource('./license.html', {}, {
            'get': {
                transformResponse: function(data, headersGetter, status) {
                    return {content: data};
        }}}).get(function(d) {
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .htmlContent(d.content)
                .ok('OK')
                .targetEvent($event)
            );
        });
    }

});
app.config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider
    .theme('default')
    .primaryPalette('blue')
    .accentPalette('teal')
    .warnPalette('red')
    .backgroundPalette('grey');
});
