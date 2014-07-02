angular
    .module('ui-router-progress.state-progress-indicator', [
        'ui-router-progress.state-progress-monitor'
    ])
    .directive('uiStateProgressIndicator', function(stateProgressMonitor) {
        return {
            restrict: 'A',
            link: function($scope, $element/*, $attrs*/) {
                var removeShowListener = stateProgressMonitor.on('show', function() {
                    $element.addClass('is-loading');
                });

                var removeHideListener = stateProgressMonitor.on('hide', function() {
                    $element.removeClass('is-loading');
                });

                $scope.$on('destroy', function() {
                    removeShowListener();
                    removeHideListener();
                });
            }
        };
    });
