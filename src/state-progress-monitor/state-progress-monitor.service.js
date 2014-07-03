angular
    .module('ui-router-progress.state-progress-monitor', [
        'ui-router-progress.event-emitter'
    ])
    .provider('stateProgressMonitor', function() {
        var included = [ ];

        function watch(/*states*/) {
            if(arguments.length) {
                var args = [ ];

                for(var i = 0, maxi = arguments.length; i < maxi; i++) {
                    var state = arguments[i];
                
                    if(angular.isDefined(state)) {
                        if(angular.isString(state)) {
                            args.push(state);

                            included.push(state);

                            continue;
                        } else if(angular.isString(state.name)) {
                            args.push(state.name);

                            included.push(state.name);

                            continue;
                        }
                    }

                    // exception handler not available...
                    throw new Error('arguments have to be state objects or state names');
                }


                var removed = false;
                return function() {
                    if(!removed) {
                        for(var i = 0, maxi = arguments.length; i < maxi; i++) {
                            var index = included.indexOf(arguments[i]);
                        
                            if(index !== -1) {
                                included.splice(index, 1);
                            }
                        }

                        removed = true;
                    }
                };
            }

            // exception handler not available...
            throw new Error('arguments have to be state objects or state names');
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
