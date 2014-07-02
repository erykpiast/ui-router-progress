angular
    .module('ui-router-progress.state-progress-monitor', [
        'ui-router-progress.event-emitter'
    ])
    .provider('stateProgressMonitor', function() {
        var included = [ ];

        function watch(state) {
            if(angular.isDefined(state)) {
                if(angular.isString(state)) {
                    included.push(state);

                    return;
                } else if(angular.isString(state.name)) {
                    included.push(state.name);

                    return;
                }
            }

            throw new Error('argument have to be state object or state name');
        }


        return {
            $get: function($rootScope, EventEmitter) {
                var eventEmitter = new EventEmitter();


                function _showLoader(e, toState/*, toParams, fromState, fromParams, err*/) {
                    if(included.indexOf(toState.name) !== -1) {
                        eventEmitter.emit('show');
                    }
                }


                function _hideLoader() {
                    eventEmitter.emit('hide');
                }


                $rootScope.$on('$stateChangeStart', _showLoader);
                $rootScope.$on('$stateChangeSuccess', _hideLoader);
                $rootScope.$on('$stateChangeError', _hideLoader);
                $rootScope.$on('$stateNotFound', _hideLoader);        

                return {
                    on: eventEmitter.on.bind(eventEmitter)
                };
            },
            watch: watch
        };
    });
