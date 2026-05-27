var app = angular.module('myApp', ['ngMaterial', 'ngResource', 'ngSanitize']);
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
        this.createFileName();
        this.updateAllThetas();
    }

    this.fname_param = "Cu-K_Q.param";
    this.fname_agenda = "Cu-K_Q.agenda";
    this.createFileName = function() {
        this.fname_param = this.element_name+"-"+this.edge+"_Q.param";
        this.fname_agenda = this.element_name+"-"+this.edge+"_Q.agenda";
    }

    this.blocks = [1,2,3,4,5,6,7,8,9,10]; this.block = this.blocks[9]; this.block_prev = this.block;
    this.block_shows = [true,true,true,true,true,true,true,true,true,true];
    this.ks = [0, 0, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    this.energies = [8651,8951,9041.96,9118.16,9224.84,9362,9529.64,9727.76,9956.36,10215.44,10505];
    this.thetas = [13.21113,12.76074,12.63024,12.52296,12.37583,12.19171,11.97403,11.72666,11.45373,11.15946,10.84808];
    this.steps = [0.00901,0.00052,0.00268,0.00368,0.00460,0.00544,0.00618,0.00682,0.00736,0.00778];
    this.divs = [ 50, 250,  40,  40,  40,  40,  40,  40,  40,  41];
    this.exps = [  1,   1,   1,   1,   1,   1,   1,   1,   1,   1];

    this.step_for_quick = 0.36384;
    this.time_for_quick = 120;

    Math.toDegrees = function(radian){
        var toDegree = 180/Math.PI;
        if(isNaN(radian)) return NaN;
        return radian * toDegree;
    };
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

    this.energy2theta = function(e) { return Math.toDegrees(Math.asin(this.EL/(2*this.xtal.d*e))); }
    this.theta2energy = function(t) { return this.EL/(2*this.xtal.d*Math.sin(Math.toRadians(t))); }
    this.k2energy = function(k, e0) { return e0 + k*k / 0.262467191; }
    this.energy2k = function(e, e0) { return Math.sqrt(0.262467191 * (e - e0)); }

    this.minStep = function() {return Math.min(...this.steps);}
    this.calcTotalPoints = function() {
        var dT = this.energy2theta(this.AbsEnergy) - this.energy2theta(this.AbsEnergy + this.step_for_quick);
        return Math.trunc(1 + (this.thetas[0] - this.thetas[this.block]) / dT);
    }
    this.calcDegPSec = function() {
        return (this.thetas[0] - this.thetas[this.block]) / this.time_for_quick;
    }
 
    this.refresh;
    this.refreshDivs = function() {
        this.divs = [ 50, 250,  40,  40,  40,  40,  40,  40,  40,  40];
        for (i = 0 ; i < 10 ; i++) {
            var be = this.thetas[i] - this.thetas[i+1];
            var n = this.divs[i];
            this.steps[i] = Math.formatFloat((0.00001 * Math.round(100000 * be/n))||0.00001, 5);
            this.divs[i] = parseInt(Math.round(be/this.steps[i]));
        }
        this.divs[this.block-1]++;
    }

    this.changeBlock = function() { // プルダウンでBlock数が変更されたら全てのパラメータを初期値に戻す
        this.ks = [0, 0, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        this.divs = [ 50, 250,  40,  40,  40,  40,  40,  40,  40,  41];
        this.exps = [  1,   1,   1,   1,   1,   1,   1,   1,   1,   1];
        this.updateAllThetas();
        this.block_prev = this.block;
        for (i = 0 ; i < this.block ; i++) this.block_shows[i] = true;
        for (i = this.block ; i < 10 ; i++) this.block_shows[i] = false;
    }

    this.updateAllThetas = function() {
        var E0 = this.AbsEnergy;
        this.thetas[0] = Math.formatFloat(this.energy2theta(E0-330), 5); // Measure Start
        this.thetas[1] = Math.formatFloat(this.energy2theta(E0- 30), 5); // XANES Start
        for (i = 2, k = 4 ; i <= 10 ; i++, k+=2)
            this.thetas[i] = Math.formatFloat(this.energy2theta(this.k2energy(k, E0)), 5);
        this.divs[this.block-1]--;
        for (i = 0 ; i < 10 ; i++) {
            var be = this.thetas[i] - this.thetas[i+1];
            var n = this.divs[i];
            this.steps[i] = Math.formatFloat((0.00001*Math.round(100000*be/n))||0.00001, 5);
            this.divs[i] = parseInt(Math.round(be/this.steps[i]));
        }
        this.divs[this.block-1]++;
        for (i = 0 ; i <= 10 ; i++)
            this.energies[i] = Math.formatFloat(this.theta2energy(this.thetas[i]), 2);
    }

    this.updateEnergy = function(idx) {
        this.divs[this.block-1]--;
        this.thetas[idx] = Math.formatFloat(this.energy2theta(this.energies[idx]), 5);
        if (idx == 0) this.divs[0] = parseInt(Math.round((this.thetas[0]-this.thetas[1])/this.steps[0]));
        else if (idx == 10) this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
        else {
            this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
            this.divs[idx] = parseInt(Math.round((this.thetas[idx]-this.thetas[idx+1])/this.steps[idx]));
        }
        if (idx > 1) this.ks[idx] = Math.formatFloat(this.energy2k(this.energies[idx], this.AbsEnergy), 5);
        this.divs[this.block-1]++;
    }

    this.updateTheta = function(idx) {
        this.divs[this.block-1]--;
        this.energies[idx] = Math.formatFloat(this.theta2energy(this.thetas[idx]), 2);
        if (idx == 0) this.divs[0] = parseInt(Math.round((this.thetas[0]-this.thetas[1])/this.steps[0]));
        else if (idx == 10) this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
        else {
            this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
            this.divs[idx] = parseInt(Math.round((this.thetas[idx]-this.thetas[idx+1])/this.steps[idx]));
        }
        if (idx > 1) this.ks[idx] = Math.formatFloat(this.energy2k(this.energies[idx], this.AbsEnergy), 5);
        this.divs[this.block-1]++;
    }

    this.updateK = function(idx) {
        this.divs[this.block-1]--;
        this.energies[idx] = Math.formatFloat(this.k2energy(this.ks[idx], this.AbsEnergy), 2);
        this.thetas[idx] = Math.formatFloat(this.energy2theta(this.energies[idx]), 5);
        if (idx == 0) this.divs[0] = parseInt(Math.round((this.thetas[0]-this.thetas[1])/this.steps[0]));
        else if (idx == 10) this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
        else {
            this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
            this.divs[idx] = parseInt(Math.round((this.thetas[idx]-this.thetas[idx+1])/this.steps[idx]));
        }
        this.divs[this.block-1]++;
    }

    this.updateDiv = function(idx) {
        this.divs[this.block-1]--;
        var be = this.thetas[idx] - this.thetas[idx+1];
        var n = this.divs[idx];
        this.steps[idx] = Math.formatFloat((0.00001 * Math.round(100000 * be/n))||0.00001, 5);
        this.divs[idx] = parseInt(Math.round(be/this.steps[idx]));
        this.divs[this.block-1]++;
    }

    this.updateStep = function(idx) {
        this.divs[this.block-1]--;
        var be = this.thetas[idx] - this.thetas[idx+1];
        this.divs[idx] = parseInt(Math.round(be/this.steps[idx]));
        this.divs[this.block-1]++;
    }

    this.checkStep4Q = function($event) {
        if (this.calcTotalPoints() > 8190) {
            $mdDialog.show(
                $mdDialog.alert()
                .title("   A L E R T   ")
                .textContent("  Number of points must be < 8191 !  ")
                .clickOutsideToClose(true)
                .ok('OK')
                .targetEvent($event)
            );
            this.step_for_quick = 0.36384;
        }
    }

    this.checkDegPSec = function($event) {
        if (this.calcDegPSec() > 0.13888) { // 36000 pulse/deg. & MAX 5000 pulse/sec.
            $mdDialog.show(
                $mdDialog.alert()
                .title("   A L E R T   ")
                .textContent("  Speed must be < 0.1388 [°/sec.] !  ")
                .clickOutsideToClose(true)
                .ok('OK')
                .targetEvent($event)
            );
            this.time_for_quick = 120;
        }
    }

    this.saveTextFile = function(txt, fname, id) {
        var blob = new Blob([ txt ], { "type" : "text/plain" });
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, fname);
            // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
            window.navigator.msSaveOrOpenBlob(blob, fname);
        } else document.getElementById(id).href = window.URL.createObjectURL(blob);
    }

    this.createText4PFOld = function() {
        var l = String.formatF(this.xtal.d, 10, 5) + String.formatI(this.divs.length, 8);
        for (i = 0 ; i < 10 ; i++) l += String.formatI(this.divs[i], 8); l+="\r\n";
        for (i = 0 ; i < 11 ; i++) l += String.formatF(this.thetas[i], 10, 6); l+="\r\n";
        for (i = 0 ; i < 10 ; i++) l += String.formatF(-1*this.steps[i], 10, 6); l+="\r\n";
        for (i = 0 ; i < 10 ; i++) l += String.formatF(this.exps[i], 10, 6); l+="\r\n";
        l += String.formatF(Math.formatFloat(this.energy2theta(this.AbsEnergy), 5), 10, 6); l+="\r\n";
        return l;
    }

    this.createText4PFNew = function(bl_name, angle_ini, loop, mode, axis) {
        var l = " Mono :"+String.formatI(this.xtal.name.toUpperCase(), 10);
        l += "       D="+String.formatF(this.xtal.d, 9, 5)+" A";
        l += "    Initial angle="+String.formatF(angle_ini, 9, 5)+" deg\r\n";
        l += " "+(bl_name+"     ").substr(0, 5);
        var mode_txt = ["", "", "Transmission", "Fluorescence", "E-yield"][mode];
        l += "    "+("             "+mode_txt).split("").reverse().join("").substr(0, 13).split("").reverse().join("");
        l += "("+String.formatI(mode, 2)+")   Repetition="+String.formatI(loop, 3);
        l += "     Points="+String.formatI(this.divs.reduce(function(p,c,i,a){return p+c;}), 5)+"\r\n";
        l += " Param file : "+(this.element_name+"-"+this.edge+".param                ").substr(0, 15);
        if (axis == 1) l += " angle axis (1)";
        else l += " energy axis(2)";
        l += "     Block ="+String.formatI(this.block, 5)+"\r\n\r\n";
        l += " Block      Init-ang  final-ang     Step/deg     Time/s       Num\r\n";
        for (var i = 1 ; i <= this.block ; i++) {
            l += " "+String.formatI(i, 5)+"     ";
            if (axis == 1) {
                l += String.formatF(this.thetas[i-1], 10, 5)+String.formatF(this.thetas[i], 10, 5);
                l += " "+(new Number(-1*this.steps[i-1])).toExponential(6).toUpperCase();
            } else {
                l += String.formatF(this.energies[i-1], 10, 2)+String.formatF(this.energies[i], 10, 2);
                l += String.formatF((this.energies[i]-this.energies[i-1])/(this.divs[i-1]-(i<this.block?0:1)), 13, 2);
            }
            l += " "+String.formatF(this.exps[i-1], 11, 2)+String.formatI(this.divs[i-1], 10)+"\r\n";
        }
        if (axis == 1) l += " Edge angle "+String.formatF(this.energy2theta(this.AbsEnergy), 10, 5)+" deg\r\n";
        else l += " Edge energy "+String.formatF(this.AbsEnergy, 10, 2)+" eV\r\n";
        return l;
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
        l += "    <agenda final=\""+String.formatF(this.energies[this.block], 10, 2).trim()
                    +"\" step_for_quick=\""+String.formatF(this.step_for_quick, 10, 5).trim()
                    +"\" time_for_quick=\""+String.formatI(this.time_for_quick, 10).trim()
                    +"\" unit=\"eV\">\r\n";
        for (var i = 1 ; i <= this.block ; i++) {
            l += "      <block id=\""+i+"\">\r\n";
            l += "        <ini>"+String.formatF(this.energies[i-1], 10, 2).trim()+"</ini>"
                       + "<div>"+this.divs[i-1]+"</div>"
                       + "<sec>"+this.exps[i-1]+"</sec>\r\n";
            l += "      </block>\r\n";
        }
        l += "    </agenda>\r\n";
        l += "  </scan>\r\n"
        l += "</parameter>\r\n";
        return l;
    }

    this.downloadAsPFOld = function() {
        var txt = this.createText4PFOld();
        this.saveTextFile(txt, this.element_name+"-"+this.edge+".param", "download_old");
    }

    this.status = "null";
    this.openDialogForPFNew = function($event) {
        var globals = this;
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            locals: {
                globals: this,
                bl_name: "BL7C",
                angle_ini: Math.formatFloat(this.energy2theta(this.AbsEnergy), 5),
                loop: 1,
                mode: 2,
                axis: 1
            },
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose:true,
            templateUrl: 'dlg_pfnew.html',
            bindToController: true,
            controllerAs: 'dialogCtrl',
            controller: function($mdDialog) {
                this.closeDialog = function() {
                    $mdDialog.hide();
                }
                this.downloadAsPFNew = function() {
                    var txt = globals.createText4PFNew(this.bl_name, this.angle_ini, this.loop, this.mode, this.axis);
                    globals.saveTextFile(txt, this.element_name+"-"+this.edge+".param", "download_new");
                    $mdDialog.hide();
                }
            }
        });
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
                    // xx_for_quickはStepスキャンのAgendaでは読み飛ばして構わない
                    block_shows = [false,false,false,false,false,false,false,false,false,false];
                    // block数を取得
                    const block_num = xmlDoc.evaluate('//agenda/block', xmlDoc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    // id=1のblockだけ特殊処理をおこなう
                    org.energies[0] = xmlDoc.evaluate('//agenda/block[@id=\"1\"]/ini/text()', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                    org.thetas[0] = Math.formatFloat(org.energy2theta(org.energies[0]), 5);
                    org.divs[0] = xmlDoc.evaluate('//agenda/block[@id=\"1\"]/div/text()', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                    org.exps[0] = xmlDoc.evaluate('//agenda/block[@id=\"1\"]/sec/text()', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                    // 残りの各blockを走査
                    org.block_shows = [false,false,false,false,false,false,false,false,false,false]; // 一旦すべて非表示にする
                    for (var i = 2 ; i <= block_num ; i++) {
                        org.block_shows[i-2] = true;
                        org.energies[i-1] = xmlDoc.evaluate('//agenda/block[@id=\"'+i+'\"]/ini/text()', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                        org.thetas[i-1] = Math.formatFloat(org.energy2theta(org.energies[i-1]), 5);
                        if (i > 2) org.ks[i-1] = Math.round(Math.formatFloat(org.energy2k(org.energies[i-1], org.AbsEnergy), 5)*100)/100;
                        org.divs[i-1] = xmlDoc.evaluate('//agenda/block[@id=\"'+i+'\"]/div/text()', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                        org.steps[i-2] = Math.formatFloat((0.00001 * Math.round(100000 * (org.thetas[i-2] - org.thetas[i-1]) / org.divs[i-2]))||0.00001, 5);
                        org.exps[i-1] = xmlDoc.evaluate('//agenda/block[@id=\"'+i+'\"]/sec/text()', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                    }
                    // 最終blockの処理
                    org.block_shows[i-2] = true;
                    org.energies[i-1] = xmlDoc.evaluate('//agenda/@final', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                    org.thetas[i-1] = Math.formatFloat(org.energy2theta(org.energies[i-2]), 5);
                    org.ks[i-1] = Math.round(Math.formatFloat(org.energy2k(org.energies[i-1], org.AbsEnergy), 5)*100)/100;
                    org.block = block_num;
                    // xx_for_quickの処理
                    org.step_for_quick = xmlDoc.evaluate('//agenda/@step_for_quick', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
                    org.time_for_quick = xmlDoc.evaluate('//agenda/@time_for_quick', xmlDoc, null, XPathResult.NUMBER_TYPE, null).numberValue;
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
