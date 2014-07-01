angular
    .module('ui-router-progress.stateProgress', [ ])
    .factory('stateProgress', function($rootScope) {
        $rootScope.$on('$stateChangeStart', _showLoader);
        $rootScope.$on('$stateChangeSuccess', _hideLoader);
        $rootScope.$on('$stateChangeError', _hideLoader);
        $rootScope.$on('$stateNotFound', _hideLoader);


        function _showLoader() {

        }


        function _hideLoader() {

        }


        return {

        };
    });
