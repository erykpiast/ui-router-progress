angular
    .module('ui-router-progress-example', [
        'ui.router',
        'ui-router-progress.state-progress-monitor',
        'ui-router-progress.state-progress-indicator'
    ])
    .config(function($stateProvider, stateProgressMonitorProvider) {
        var defaultState = 'home';

        stateProgressMonitorProvider.watch(defaultState);

        $stateProvider
            .state(defaultState, {
                url: '',
                controller: 'exampleCtrl',
                template: '{{ example }}',
                resolve: {
                    wait: function($q, $timeout) {
                        var deferred = $q.defer();

                        $timeout(function() {
                            deferred.resolve('2000 ms');
                        }, 2000);

                        return deferred.promise;
                    }
                }
            });
    })
    .controller('exampleCtrl', function($scope, wait) {
        $scope.example = 'Example state which was waiting ' + wait;
    });
