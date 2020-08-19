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
        ["0.1621 - 12.5058","0.2432 - 12.5058","0.4054 - 12.5058","0.6486 - 12.5058"],
        ["0.0810 - 6.4254","0.1216 - 6.4254","0.2027 - 6.4254","0.3243 - 6.4254"],
        ["0.0540 - 4.3061","0.0810 - 4.3061","0.1351 - 4.3061","0.2162 - 4.3061"],
        ["0.0405 - 3.2356","0.0608 - 3.2356","0.1013 - 3.2356","0.1621 - 3.2356"],
        ["0.0270 - 2.1599","0.0405 - 2.1599","0.0675 - 2.1599","0.1081 - 2.1599"],
        ["0.0202 - 1.6207","0.0304 - 1.6207","0.0506 - 1.6207","0.0810 - 1.6207"],
        ["0.0162 - 1.2968","0.0243 - 1.2968","0.0405 - 1.2968","0.0648 - 1.2968"],
        ["0.0135 - 1.0808","0.0202 - 1.0808","0.0337 - 1.0808","0.0540 - 1.0808"],
        ["0.0101 - 0.8107","0.0152 - 0.8107","0.0253 - 0.8107","0.0405 - 0.8107"],
        ["0.0081 - 0.6486","0.0121 - 0.6486","0.0202 - 0.6486","0.0324 - 0.6486"]
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
                return String.formatF(Qin, 7, 4)+" - "+String.formatF(Qout, 7, 4);
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
