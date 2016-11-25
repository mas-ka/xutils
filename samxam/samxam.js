var app = angular.module('myApp', ['ngMaterial', 'ngResource', 'ngSanitize']);
app.controller('myController', function($resource, $mdDialog, numberFilter){
    // for pulldownMenu
    this.ElementNamesZ = getElementNamesZ();
    this.Edges = [{Id: 0, Name:"K"}, {Id: 1, Name:"L1"}, {Id: 2, Name:"L2"}, {Id: 3, Name:"L3"}];
    this.RatioTypes = [{Id: 0, Type:"Atom"}, {Id: 1, Type:"Mass"}];








    // for Component parameters
    this.Lambda = 1.380840; // Cu-K
    this.ratio = 0; // Atom
    this.targetId = 0;
    this.Z = [29,0,0,0,0,0,0,0,0,0];
    this.Ratio = [1,0,0,0,0,0,0,0,0,0];
    this.Weight = [1,0,0,0,0,0,0,0,0,0];

    // for Sample Edge
    this.edge = 0; // K

    // for Sample size
    this.Pellet_D = 10; // [mm]
    this.Pellet_T = 1; // [mm]

    // functions
    this.updateWeightRatio = function() {
        // 念のためエッジ波長を再設定しておく
        this.Lambda = getLambdaOfEdge(this.Z[this.targetId], this.edge);
        // 重量分率を再計算する
        if (this.ratio == 0) { // Atom
            var M_total = 0;
            for (var i = 0 ; i < 10 ; i++) M_total += this.Ratio[i]*this.Z[i] / elements[this.Z[i]].ZoA;
            for (var i = 0 ; i < 10 ; i++) this.Weight[i] = this.Ratio[i]*this.Z[i] / elements[this.Z[i]].ZoA / M_total;
        } else { // Mass
            var M_total = 0;
            for (var i = 0 ; i < 10 ; i++) M_total += this.Ratio[i];
            for (var i = 0 ; i < 10 ; i++) this.Weight[i] = this.Ratio[i] / M_total;
        }
        // 新しい重量分率でμtを再計算する
        this.calcWeightByDeltaMuT(1);
        this.calcBothMuTByWeight(this.MG_dMuT);
    }

    this.MG_dMuT = 0;
    // Δμtが指定値となる重量を求める
    this.calcWeightByDeltaMuT = function(d) {
        var Z = this.Z[this.targetId];
        var BothMoR = getBothMoR(Z, this.edge); // ターゲット元素の指定吸収端前後の質量吸収係数を求める
        this.MG_dMuT = 1000 * Math.PI*Math.pow(this.Pellet_D/20.0, 2)*d/(BothMoR[0]-BothMoR[1]) / this.Weight[this.targetId];

    }

    this.MuT_H_dMuT = 0;
    this.MuT_L_dMuT = 0;
    // ある重量におけるμt_Hとμt_Lの両方を求める
    this.calcBothMuTByWeight = function(mg) {
        var G = mg / 1000.0; // [g]
        var PRR = Math.PI*Math.pow(this.Pellet_D/20.0, 2); // πr^2 [cm^2]
        var MoR = 0.0;
        for (var i = 0 ; i < 10 ; i++) {
            if (i == this.targetId) continue;
            var Z = this.Z[i];
            MoR += getMoR(Z, this.Lambda) * G * this.Weight[i] / PRR;
        }
        var BothMoR = getBothMoR(this.Z[this.targetId], this.edge); // ターゲット元素の指定吸収端前後の質量吸収係数を求める
        this.MuT_H_dMuT = BothMoR[0] * G * this.Weight[this.targetId] / PRR + MoR;
        this.MuT_L_dMuT = BothMoR[1] * G * this.Weight[this.targetId] / PRR + MoR;
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
