var app = angular.module('myApp', ['ngMaterial']);
app.controller('myController', function(numberFilter){
    this.EL = 12398.4264684;

    this.xtals = [
        {name:'Si(111)', d:3.13551},
        {name:'Si(311)', d:1.63747},
        {name:'Si(220)', d:1.92010}
    ];
    this.xtal = this.xtals[0];

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
        this.createParamFileName();
    }

    this.AbsEnergy = 8981.00;
    this.applyAbsEnergy = function() {
        var element = getElementByName(this.element_name);
        this.AbsEnergy = element[this.edge];
        this.createParamFileName();
        this.updateAllThetas();
    }

    this.fname = "Cu-K.param";
    this.createParamFileName = function() {
        this.fname = this.element_name+"-"+this.edge+".param";
    }

    this.blocks = [1,2,3,4,5,6,7,8,9,10]; this.block = this.blocks[9]; this.block_prev = this.block;
    this.block_shows = [true,true,true,true,true,true,true,true,true,true];
    this.ks = [0, 0, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    this.energies = [8651,8951,9041.96,9118.16,9224.84,9362,9529.64,9727.76,9956.36,10215.44,10505];
    this.thetas = [13.21113,12.76074,12.63024,12.52296,12.37583,12.19171,11.97403,11.72666,11.45373,11.15946,10.84808];
    this.steps = [0.00901,0.00052,0.00268,0.00368,0.00460,0.00544,0.00618,0.00682,0.00736,0.00778];
    this.divs = [ 50, 250,  40,  40,  40,  40,  40,  40,  40,  41];
    this.exps = [  1,   1,   1,   1,   1,   1,   1,   1,   1,   1];

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

    this.changeBlock = function() {
        this.divs[this.block_prev-1]--;
        this.divs[this.block-1]++;
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

    this.saveTextFile = function(txt, fname) {
        var blob = new Blob([ txt ], { "type" : "text/plain" });
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, fname);
            // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
            window.navigator.msSaveOrOpenBlob(blob, fname);
        } else document.getElementById("download").href = window.URL.createObjectURL(blob);
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

    this.downloadAsPFOld = function() {
        var txt = this.createText4PFOld();
        this.saveTextFile(txt, this.element_name+"-"+this.edge+".param");
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
