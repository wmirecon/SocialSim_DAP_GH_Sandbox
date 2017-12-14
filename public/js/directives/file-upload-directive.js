angular.module('awsApp').directive('fileUpload', ['$rootScope', function fileUpload($rootScope) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            var validFormats = ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx'];
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