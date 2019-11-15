var app = angular.module('myApp', ['ngMaterial', 'ngResource', 'ngSanitize']);
app.controller('myController', function($resource, $mdDialog, numberFilter){
    // for pulldownMenu
    this.ElementNamesZ = getElementNamesZ();
    this.Edges = [{Id: 0, Name:"K"}, {Id: 1, Name:"L1"}, {Id: 2, Name:"L2"}, {Id: 3, Name:"L3"}];
    this.RatioTypes = [{Id: 0, Type:"Atom"}, {Id: 1, Type:"Mass"}];
    this.SampleType = [{Id: 0, Type: "Pellet"}, {Id: 1, Type: "Foil"}];
    this.PelletMediumType = [{Id: 0, Type: "-"}, {Id: 1, Type: "BN"}, {Id: 2, Type: "Other..."}];
    this.PelletMediumValueType = [{Id: 0, Type: "Thickness"}, {Id: 1, Type: "Weight"}];

    // for Component parameters
    this.sample = 0; // Pellet
    this.Lambda = 1.380840; // Cu-K
    this.ratio = 0; // Atom
    this.ratio_step = 0.01; // for Atom
    this.targetId = 0;
    this.Z = [29,0,0,0,0,0,0,0,0,0];
    this.Ratio = [1,0,0,0,0,0,0,0,0,0];
    this.Weight = [1,0,0,0,0,0,0,0,0,0];

    // for Sample Edge
    this.edge = 0; // K

    // for Sample as Pellet
    this.Pellet_D = 10; // [mm]
    this.Pellet_T = 1; // [mm || mg]
    this.Pellet_Medium = 1; // medium = BN
    this.Pellet_Medium_unit = 0; //Thickness
    this.Pellet_Medium_Z = [5,7,0,0,0,0,0,0,0,0]; // BN
    this.Pellet_Medium_Ratio = [1,1,0,0,0,0,0,0,0,0];
    this.Pellet_Medium_Weight = [0.435535858178888,0.564464141821112,0,0,0,0,0,0,0,0];

    // for Sample as Foil
    this.Foil_R = 8.94; // [g/cm^-3] Rho of Cu (Metal)

    // for Result of Pellet & Foil
    this.MuT_H_4 = 4.000; this.MuT_L_4 = 1.286; this.dMuT_4 = 2.714; this.Res_4 = 8.47;
    this.MuT_H_2 = 2.500; this.MuT_L_2 = 1.098; this.dMuT_2 = 1.402; this.Res_2 = 4.38;
    this.MuT_H_1 = 2.041; this.MuT_L_1 = 1.041; this.dMuT_1 = 1.000; this.Res_1 = 3.12;
    this.MuT_H_o = 1.263; this.MuT_L_o = 0.943; this.dMuT_o = 0.320; this.Res_o = 1.00;

    // functions
    this.changeComponentsElement = function(i) { // i番目の元素が変更された
        if (i == 0) {
            // 特にすることも現状ないが、なんとなく残しておくｗ
            if (this.sample == 1) { // Foil
                this.Foil_R = getRhoByZ(this.Z[0]);
            }
        } else {
            if (this.Z[i] == 0) { // i番目の元素が「なし」に変更された
                for (var j = i+1 ; j < 10 ; j++) {
                    this.Z[j-1] = this.Z[j]; // (i+1)番目以降を１つ前にズラす
                    this.Ratio[j-1] = this.Ratio[j];
                }
                this.Z[9] = 0; this.Ratio[9] = 0; // 最後の元素を「なし」にする
                if (this.targetId >= i) this.targetId = i-1; // ターゲットが削除された元素より後だったら、ターゲットを(i-1)番目に戻す
            }
        }
        this.calcResult();
    }


    this.changePelletMedium = function() {
        if (this.Pellet_Medium == 1) { // BN
            this.Pellet_T = 1;
            this.Pellet_Medium_unit = 0; // Thickness
            this.Pellet_Medium_Z = [5,7,0,0,0,0,0,0,0,0]; // BN
            this.Pellet_Medium_Ratio = [1,1,0,0,0,0,0,0,0,0];
            this.Pellet_Medium_Weight = [0.435535858178888,0.564464141821112,0,0,0,0,0,0,0,0];
        } else if (this.Pellet_Medium == 2) { // Other...
            this.Pellet_Medium_unit = 1; // Weight
        }
        this.calcResult();
    }

    this.calcResult = function() {
        this.ratio_step = (this.ratio==0)?0.01:0.001; // ここでやっとく
        switch (this.sample) {
            case 0: // Pellet
                this.calc4Pellet();
                break;
            case 1: // Foil
                this.calc4Foil();
                break;
            default: this.calc4Pellet();
        }
    }

    this.calc4Foil = function() {
        var t = 0.0; var r = [];
        // 念のためエッジ波長を再設定しておく
        this.Lambda = getLambdaOfEdge(this.Z[this.targetId], this.edge);
        // 重量分率を再計算する
        this.updateWeightRatio();
        // Δμt=1となる厚さを求め、そこからμt_H,μt_Lを求める
        t = this.calcCMByDeltaMuT(1.0);
        r = this.calcAllMuTByCM(t);
        this.MuT_H_1 = r[0]; this.MuT_L_1 = r[1]; this.Res_1 = t*10000;
        // μt_H=4となる厚さを求め、そこからμt_H,μt_Lを求める
        t = this.calcCMByMuTH(4.0);
        r = this.calcAllMuTByCM(t);
        this.MuT_H_4 = r[0]; this.MuT_L_4 = r[1]; this.dMuT_4 = r[0]-r[1]; this.Res_4 = t*10000;
        // μt_H=2.5となる厚さを求め、そこからμt_H,μt_Lを求める
        t = this.calcCMByMuTH(2.5);
        r = this.calcAllMuTByCM(t);
        this.MuT_H_2 = r[0]; this.MuT_L_2 = r[1]; this.dMuT_2 = r[0]-r[1]; this.Res_2 = t*10000;
        // Res_oからμt_H,μt_Lを求める
        r = this.calcAllMuTByCM(this.Res_o / 10000.0);
        this.MuT_H_o = r[0]; this.MuT_L_o = r[1]; this.dMuT_o = r[0]-r[1];
    }

    this.calc4Pellet = function() {
        var g = 0.0; var r = [];
        // 念のためエッジ波長を再設定しておく
        this.Lambda = getLambdaOfEdge(this.Z[this.targetId], this.edge);
        // 重量分率を再計算する
        this.updateWeightRatio();
        this.updatePelletMediumWeightRatio();
        // Δμt=1となるグラムを求め、そこからμt_H,μt_Lを求める
        g = this.calcGramByDeltaMuT(1.0);
        r = this.calcAllMuTByGram(g);
        this.MuT_H_1 = r[0]; this.MuT_L_1 = r[1]; this.Res_1 = g*1000;
        // μt_H=4となるグラムを求め、そこからμt_H,μt_Lを求める
        g = this.calcGramByMuTH(4.0);
        r = this.calcAllMuTByGram(g);
        this.MuT_H_4 = r[0]; this.MuT_L_4 = r[1]; this.dMuT_4 = r[0]-r[1]; this.Res_4 = g*1000;
        // μt_H=2.5となるグラムを求め、そこからμt_H,μt_Lを求める
        g = this.calcGramByMuTH(2.5);
        r = this.calcAllMuTByGram(g);
        this.MuT_H_2 = r[0]; this.MuT_L_2 = r[1]; this.dMuT_2 = r[0]-r[1]; this.Res_2 = g*1000;
        // Res_oからμt_H,μt_Lを求める
        r = this.calcAllMuTByGram(this.Res_o / 1000.0);
        this.MuT_H_o = r[0]; this.MuT_L_o = r[1]; this.dMuT_o = r[0]-r[1];
    }

    this.updateWeightRatio = function() { // 重量分率を再計算する
        if (this.ratio == 0) { // Atom
            var M_total = 0;
            for (var i = 0 ; i < 10 ; i++) M_total += this.Ratio[i]*elements[this.Z[i]].A;
            for (var i = 0 ; i < 10 ; i++) this.Weight[i] = this.Ratio[i]*elements[this.Z[i]].A / M_total;
        } else { // Mass
            var M_total = 0;
            for (var i = 0 ; i < 10 ; i++) M_total += this.Ratio[i];
            for (var i = 0 ; i < 10 ; i++) this.Weight[i] = this.Ratio[i] / M_total;
        }
    }

    this.updatePelletMediumWeightRatio = function() { // 重量分率を再計算する
        var M_total = 0;
        for (var i = 0 ; i < 10 ; i++) M_total += this.Pellet_Medium_Ratio[i]*elements[this.Pellet_Medium_Z[i]].A;
        for (var i = 0 ; i < 10 ; i++) this.Pellet_Medium_Weight[i] = this.Pellet_Medium_Ratio[i]*elements[this.Pellet_Medium_Z[i]].A / M_total;
    }

    this.calcGramByDeltaMuT = function(d) { // Δμtが指定値となる重量を求める
        var BothMoR = getBothMoR(this.Z[this.targetId], this.edge); // ターゲット元素の指定吸収端前後の質量吸収係数を求める
        return Math.PI*Math.pow(this.Pellet_D/20.0, 2)*d/(BothMoR[0]-BothMoR[1]) / this.Weight[this.targetId];
    }

    this.calcGramByMuTH = function(H) {
        var MoRw = 0.0;
        for (var i = 0 ; i < 10 ; i++) {
            if (i == this.targetId) continue;
            MoRw += getMoR(this.Z[i], this.Lambda) * this.Weight[i];
        }
        MoRw += getBothMoR(this.Z[this.targetId], this.edge)[0]*this.Weight[this.targetId];
        var PRR = Math.PI*Math.pow(this.Pellet_D/20.0, 2); // πr^2 [cm^2]
        return (PRR*H-this.calcPelletMediumMoRG())/MoRw;

    }

    this.calcAllMuTByGram = function(g) { // 指定重量でのμt_H,μt_Lを求める
        var BothMoR = getBothMoR(this.Z[this.targetId], this.edge); // ターゲット元素の指定吸収端前後の質量吸収係数を求める
        var PRR = Math.PI*Math.pow(this.Pellet_D/20.0, 2); // πr^2 [cm^2]
        var MoR = 0.0;
        for (var i = 0 ; i < 10 ; i++) {
            if (i == this.targetId) continue;
            MoR += getMoR(this.Z[i], this.Lambda) * this.Weight[i];
        }
        var MoRG_M = this.calcPelletMediumMoRG();
        var MuT_H = (g*(MoR + BothMoR[0]*this.Weight[this.targetId]) + MoRG_M) / PRR;
        var MuT_L = (g*(MoR + BothMoR[1]*this.Weight[this.targetId]) + MoRG_M) / PRR;
        return [MuT_H, MuT_L];
    }

    this.calcPelletMediumMoRG = function() {
        var G; // [g]
        switch (this.Pellet_Medium) {
            case 0: // No medium
                return 0.0;
            case 1: // BN
                if (this.Pellet_Medium_unit == 0) G = this.Pellet_T * 0.1735; // BN 173.5mg/mm
                else G = this.Pellet_T / 1000.0; // mg -> g
                return G*(getMoR(5, this.Lambda)*0.435536 + getMoR(7, this.Lambda)*0.564464);
            case 2: // Other...
                G = this.Pellet_T / 1000.0; // mg -> g
                var MoR = 0.0;
                for (var i = 0 ; i < 10 ; i++) MoR += getMoR(this.Pellet_Medium_Z[i], this.Lambda) * this.Pellet_Medium_Weight[i];
                return G*MoR;
        }
    }

    this.calcCMByDeltaMuT = function(d) { // Δμtが指定値となるフォイル厚さ[cm]を求める
        var BothMoR = getBothMoR(this.Z[this.targetId], this.edge); // ターゲット元素の指定吸収端前後の質量吸収係数を求める
        return d / (this.Foil_R * (BothMoR[0]-BothMoR[1]) * this.Weight[this.targetId]);
    }

    this.calcCMByMuTH = function(H) { // μt_Hが指定値となるフォイル厚さ[cm]を求める
        var MoRw = 0.0;
        for (var i = 0 ; i < 10 ; i++) {
            if (i == this.targetId) continue;
            MoRw += getMoR(this.Z[i], this.Lambda) * this.Weight[i];
        }
        MoRw += getBothMoR(this.Z[this.targetId], this.edge)[0]*this.Weight[this.targetId];
        return H / MoRw / this.Foil_R;
    }

    this.calcAllMuTByCM = function(t) { // 指定厚さでのμt_H,μt_Lを求める
        var BothMoR = getBothMoR(this.Z[this.targetId], this.edge); // ターゲット元素の指定吸収端前後の質量吸収係数を求める
        var MoRw = 0.0;
        for (var i = 0 ; i < 10 ; i++) {
            if (i == this.targetId) continue;
            MoRw += getMoR(this.Z[i], this.Lambda) * this.Weight[i];
        }
        var MuT_H = t * this.Foil_R * (MoRw + BothMoR[0]*this.Weight[this.targetId]);
        var MuT_L = t * this.Foil_R * (MoRw + BothMoR[1]*this.Weight[this.targetId]);
        return [MuT_H, MuT_L];
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
