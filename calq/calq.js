var app = angular.module('myApp', ['ngMaterial', 'ngResource', 'ngSanitize']);
app.controller('myController', function($resource, $mdDialog, numberFilter){
    this.Lambda = 1.5498;
    this.Radius = 80;
    this.Lengths = [250, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000];
    this.Diameters = [2, 3, 5, 8];
    this.Modes = [
        {name:"2θ [°]", value:0},
        {name:"d [nm]", value:1},
        {name:"q [/nm]", value:2},

    ];
    this.Mode = this.Modes[2];
    this.Ranges = [
        ["0 .16 - 12.50","0 .24 - 12.50","0 .40 - 12.50","0 .64 - 12.50"],
        ["0 .08 - 6.42","0 .12 - 6.42","0 .20 - 6.42","0 .32 - 6.42"],
        ["0 .05 - 4.30","0 .08 - 4.30","0 .13 - 4.30","0 .21 - 4.30"],
        ["0 .04 - 3.23","0 .06 - 3.23","0 .10 - 3.23","0 .16 - 3.23"],
        ["0 .02 - 2.15","0 .04 - 2.15","0 .06 - 2.15","0 .10 - 2.15"],
        ["0 .02 - 1.62","0 .03 - 1.62","0 .05 - 1.62","0 .08 - 1.62"],
        ["0 .01 - 1.29","0 .02 - 1.29","0 .04 - 1.29","0 .06 - 1.29"],
        ["0 .01 - 1.08","0 .02 - 1.08","0 .03 - 1.08","0 .05 - 1.08"],
        ["0 .01 - 0 .81","0 .01 - 0 .81","0 .02 - 0 .81","0 .04 - 0 .81"],
        ["0 .00 - 0 .64","0 .01 - 0 .64","0 .02 - 0 .64","0 .03 - 0 .64"]
    ];

    Math.toDegrees = function(radian){
        var toDegree = 180/Math.PI;
        if(isNaN(radian)) return NaN;
        return radian * toDegree;
    };
    String.formatF = function(f, w, d) {
        var z = Array(d+1).join("0");
        var y = ""+f+(((""+f).indexOf('.')<0)?"."+z:z);
        var t = "."+(y.split('\.'))[1].substr(0,d);
        if (Math.abs(f) < 1) {
            return '0'+Array(w - (y.split('\.'))[0].length - t.length + 2).join(" ")+(f<0?"-":"")+t;
        } else {
            return Array(w - (y.split('\.'))[0].length - t.length + 1).join(" ")+(y.split('\.'))[0]+t;
        }
    }

    this.calcTheta = function(R, L) {
        return 0.5 * Math.atan2(R, L);
    };

    this.calcRange = function(D, L) {
        var Tin  = this.calcTheta(D/2, L);
        var Tout = this.calcTheta(this.Radius, L);
        var Qin  = 4 * Math.PI * Math.sin(Tin) / this.Lambda * 10;
        var Qout = 4 * Math.PI * Math.sin(Tout) / this.Lambda * 10;
        var Din  = 2 * Math.PI / Qin;
        var Dout = 2 * Math.PI / Qout;
        switch (this.Mode.value) {
            case 0: // 2θ
                return String.formatF(Math.toDegrees(2*Tin), 5, 2)+" - "+String.formatF(Math.toDegrees(2*Tout), 5, 2);
            case 1: // d
                return String.formatF(Din, 5, 2)+" - "+String.formatF(Dout, 5, 2);
            case 2: // q
            default:
                return String.formatF(Qin, 5, 2)+" - "+String.formatF(Qout, 5, 2);
        }
    };

    this.updateAll = function() {
        for (var y = 0 ; y < 10 ; y++) {
            for (var x = 0 ; x < 4 ; x++) {
                var r = this.calcRange(this.Diameters[x], this.Lengths[y]);
                console.log(r);
                this.Ranges[y][x] = r;
            }
        }
    };


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
