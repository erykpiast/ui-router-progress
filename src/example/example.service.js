angular
    .module('ui-router-progress.example', [ ])
    .factory('example', function($rootScope) {
        return function() {
            $rootScope.example = true;

            return true;
        };
    });
