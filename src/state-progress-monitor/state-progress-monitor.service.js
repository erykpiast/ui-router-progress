angular
    .module('ui-router-progress.state-progress-monitor', [
        'ui-router-progress.event-emitter'
    ])
    .provider('stateProgressMonitor', function() {
        var excluded = [ ];

        function exclude(/*states*/) {
            if(arguments.length) {
                var args = [ ];

                for(var i = 0, maxi = arguments.length; i < maxi; i++) {
                    var state = arguments[i];
                
                    if(angular.isDefined(state)) {
                        if(angular.isString(state.name)) {
                            state = state.name;
                        } else if(!angular.isString(state)) {
                            // exception handler not available...
                            throw new Error('arguments have to be state objects or state names');
                        }

                        if(excluded.indexOf(state) === -1) {
                            args.push(state);

                            excluded.push(state);
                        }
                    }
                }


                var removed = false;
                return function() {
                    if(!removed) {
                        for(var i = 0, maxi = arguments.length; i < maxi; i++) {
                            var index = excluded.indexOf(arguments[i]);
                        
                            if(index !== -1) {
                                excluded.splice(index, 1);
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


                function _emitStart(e, toState/*, toParams, fromState, fromParams, err*/) {
                    if(excluded.indexOf(toState.name) === -1) {
                        eventEmitter.emit('loadstart');
                    }
                }


                function _emitEnd(e, toState/*, toParams, fromState, fromParams, err*/) {
                    if(excluded.indexOf(toState.name) === -1) {
                        eventEmitter.emit('loadend');
                    }
                }


                $rootScope.$on('$stateChangeStart', _emitStart);
                $rootScope.$on('$stateChangeSuccess', _emitEnd);
                $rootScope.$on('$stateChangeError', _emitEnd);
                $rootScope.$on('$stateNotFound', function(e, unfoundState/*, fromState, fromParams*/) {
                    _emitEnd(e, { name: unfoundState.to });
                });

                return {
                    on: eventEmitter.on.bind(eventEmitter)
                };
            },
            exclude: exclude
        };
    });
