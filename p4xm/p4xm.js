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
    }

    this.AbsEnergy = 8981.00;
    this.applyAbsEnergy = function() {
        var element = getElementByName(this.element_name);
        this.AbsEnergy = element[this.edge];
        this.updateAllThetas();
    }

    this.ks = [0, 0, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    this.energies = [8651,8951,9041.96,9118.16,9224.84,9362,9529.64,9727.76,9956.36,10215.44,10505];
    this.thetas = [13.21113,12.76074,12.63024,12.52296,12.37583,12.19171,11.97403,11.72666,11.45373,11.15946,10.84808];
    this.steps = [0.00901,0.00052,0.00268,0.00368,0.00460,0.00544,0.00618,0.00682,0.00736,0.00778];
    this.divs = [ 50, 250,  40,  40,  40,  40,  40,  40,  40,  40];
    this.exps = [  1,   1,   1,   1,   1,   1,   1,   1,   1,   1];

    Math.toDegrees = function(radian){
        var toDegree = 180/Math.PI;
        if(isNaN(radian)) return NaN;
        return radian * toDegree;
    };
    Math.toRadians = function(degree){
        return isNaN(degree)?NaN:degree*Math.PI/180;
    }

    this.energy2theta = function(e) { return 0.00001*Math.round(100000*Math.toDegrees(Math.asin(this.EL/(2*this.xtal.d*e)))); }
    this.theta2energy = function(t) { return this.EL/(2*this.xtal.d*Math.sin(Math.toRadians(t))); }
    this.k2energy = function(k, e0) { return e0 + k*k / 0.262467191; }
    this.energy2k = function(e, e0) { return Math.sqrt(0.262467191 * (e - e0)); }



    this.updateAllThetas = function() {
        var E0 = this.AbsEnergy;
        this.thetas[0] = this.energy2theta(E0-330); // Measure Start
        this.thetas[1] = this.energy2theta(E0- 30); // XANES Start
        for (i = 2, k = 4 ; i <= 10 ; i++, k+=2)
            this.thetas[i] = this.energy2theta(this.k2energy(k, E0));
        this.divs = [ 50, 250,  40,  40,  40,  40,  40,  40,  40,  40];
        for (i = 0 ; i < 10 ; i++) {
            var be = this.thetas[i] - this.thetas[i+1];
            var n = this.divs[i];
            this.steps[i] = 0.00001*Math.round(100000*be/n)||0.00001;
            this.divs[i] = parseInt(Math.round(be/this.steps[i]));
        }
        for (i = 0 ; i <= 10 ; i++)
            this.energies[i] = Math.round(100*this.theta2energy(this.thetas[i]))/100.0;
    }

    this.updateEnergy = function(idx) {
        this.thetas[idx] = this.energy2theta(this.energies[idx]);
        if (idx == 0) this.divs[0] = parseInt(Math.round((this.thetas[0]-this.thetas[1])/this.steps[0]));
        else if (idx == 10) this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
        else {
            this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
            this.divs[idx] = parseInt(Math.round((this.thetas[idx]-this.thetas[idx+1])/this.steps[idx]));
        }
        if (idx > 1) this.ks[idx] = this.energy2k(this.energies[idx], this.AbsEnergy);
    }

    this.updateTheta = function(idx) {
        this.energies[idx] = 0.01 * Math.round(100 * this.theta2energy(this.thetas[idx]));
        if (idx == 0) this.divs[0] = parseInt(Math.round((this.thetas[0]-this.thetas[1])/this.steps[0]));
        else if (idx == 10) this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
        else {
            this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
            this.divs[idx] = parseInt(Math.round((this.thetas[idx]-this.thetas[idx+1])/this.steps[idx]));
        }
        if (idx > 1) this.ks[idx] = this.energy2k(this.energies[idx], this.AbsEnergy);
    }

    this.updateK = function(idx) {
        this.energies[idx] = this.k2energy(this.ks[idx], this.AbsEnergy);
        this.thetas[idx] = this.energy2theta(this.energies[idx]);
        if (idx == 0) this.divs[0] = parseInt(Math.round((this.thetas[0]-this.thetas[1])/this.steps[0]));
        else if (idx == 10) this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
        else {
            this.divs[idx-1] = parseInt(Math.round((this.thetas[idx-1]-this.thetas[idx])/this.steps[idx-1]));
            this.divs[idx] = parseInt(Math.round((this.thetas[idx]-this.thetas[idx+1])/this.steps[idx]));
        }
    }

    this.updateDiv = function(idx) {
        var be = this.thetas[idx] - this.thetas[idx+1];
        var n = this.divs[idx];
        this.steps[idx] = 0.00001*Math.round(100000*be/n)||0.00001;
        this.divs[idx] = parseInt(Math.round(be/this.steps[idx]));
    }

    this.updateStep = function(idx) {
        var be = this.thetas[idx] - this.thetas[idx+1];
        this.divs[idx] = parseInt(Math.round(be/this.steps[idx]));
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
