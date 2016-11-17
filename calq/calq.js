var app = angular.module('myApp', ['ngMaterial', 'ngResource', 'ngSanitize']);
app.controller('myController', function($resource, $mdDialog, numberFilter){
    this.Lambda = 1.5415;
    this.Radius = 80;
    this.Lengths = [250, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000];
    this.Diameters = [2, 3, 5, 8];

    this.calcRange = function(L) {

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
