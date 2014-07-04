angular
    .module('ui-router-progress.state-progress-indicator', [
        'ui-router-progress.state-progress-monitor'
    ])
    .directive('uiStateProgressIndicator', function(stateProgressMonitor) {
        return {
            restrict: 'AC',
            link: function($scope, $element/*, $attrs*/) {
                var removeShowListener = stateProgressMonitor.on('loadstart', function() {
                    $element.addClass('is-loading');
                });

                var removeHideListener = stateProgressMonitor.on('loadend', function() {
                    $element.removeClass('is-loading');
                });

                $scope.$on('$destroy', function() {
                    removeShowListener();
                    removeHideListener();
                });
            }
        };
    });
