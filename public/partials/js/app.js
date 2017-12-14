angular.module('awsApp', ['ngRoute'])
    .config(function($routeProvider, $sceDelegateProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'partials/home.html'
        });
        $routeProvider.otherwise({ redirectTo: '/home' });
    });

angular.module('awsApp')
    .controller('awsController', ['$scope', function($scope) {

        $scope.submit = function(file) {

            console.log(file);
            var connection = new WebSocket('wss://192.168.1.100:3000');
            var fileo = angular.toJson(file);
            console.log(fileo);
            console.log('---');
            console.log()
            connection.onopen = function() {
                console.log('connected');
                connection.send(file);
            }

            connection.onmessage = function(message) {
                console.log("got message: ", message.data);
                var data = JSON.parse(message.data);
            }
        }
    }]);



angular.module('awsApp').directive('fileUpload', ['$rootScope', function fileUpload($rootScope) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            var validFormats = ['doc', 'docx', 'txt'];
            var file = {};
            elem.bind('change', function(event) {
                file = event.target.files[0];
                // var r = new FileReader();
                // r.readAsBinaryString(file);

                validFile(false);
                scope.$apply(function() {
                    ngModel.$render();
                });
            });
            ngModel.$render = function() {
                ngModel.$setViewValue(elem.val());
            };

            function validFile(bool) {
                ngModel.$setValidity('extension', bool);
            }

            ngModel.$parsers.push(function(value) {
                var ext = value.substr(value.lastIndexOf('.') + 1);
                if (ext == '') {
                    ngModel.$setValidity('required', false);
                    return;
                }
                if (validFormats.indexOf(ext) == -1) {
                    //ngModel.$validators.extension(false);
                    return file;
                    //return false;
                }
                validFile(true);
                //ngModel.$validators.extension(true);
                return file;
                //return true;
            });
        }
    };
}]);