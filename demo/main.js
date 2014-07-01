angular
    .module('ui-router-progress-example', [
        'ui-router-progress.example'
    ])
    .controller('exampleCtrl', function($scope, example) {
        $scope.exampleResult = example();
    });