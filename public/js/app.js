angular.module('awsApp', ['ngRoute', 'ngResource', 'ngFileUpload'])
    .config(function($routeProvider, $sceDelegateProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'partials/home.html'
        });
        $routeProvider.otherwise({ redirectTo: '/home' });
    });