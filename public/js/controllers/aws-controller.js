angular.module('awsApp')
    .controller('awsController', ['$scope', 'Upload', '$timeout', '$resource', function($scope, Upload, $timeout, $resource) {

        $scope.arrayBufferToBase64 = function(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }

        $scope.submit = function(file) {

            file.upload = Upload.upload({
                url: 'https://server.brandonb.tk:3000',
                data: { name: file.name, type: file.type, file: file }
            });

            file.upload.then(function(response) {
                $timeout(function() {
                    $scope.fileType = response.data.type;
                    $scope.fileExists = response.data.type == 'image/png' || response.data.type == 'image/jpeg';
                    $scope.serverFile = response.data.file;
                    $scope.loadTable();
                }, 50);
            });
        }

        $scope.clear = function() {
            $timeout(function() {
                $scope.serverFile = {};
                $scope.fileExists = false;
            }, 50);

        }

        $scope.loadTable = function() {
            var Table = $resource('https://server.brandonb.tk:3000/data');
            var tableString = Table.get(function() {
                $scope.table = tableString.Items;
            });
        }

        var init = function() {
            $scope.forms = {};
            $scope.fileExists = false;
        }

        init();

    }]);