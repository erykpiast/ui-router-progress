// ### event-emitter.service.js >>

angular
    .module('ui-router-progress.event-emitter', [ ])
    .factory('EventEmitter', ['$exceptionHandler', function($exceptionHandler) {
        function EventEmitter() {
            this._eventsHandlers = { };
        }


        angular.extend(EventEmitter.prototype, {
            on: function(eventName, handler) {
                if(!angular.isString(eventName)) {
                    $exceptionHandler(new Error('event name must be a string'))
                }

                if(!angular.isFunction(handler)) {
                    $exceptionHandler(Error('event handler must be a function'));
                }

                var eventHandlers = (this._eventsHandlers[eventName] || (this._eventsHandlers[eventName] = [ ]));

                eventHandlers.push(handler);
                
                var removed = false;
                return function() {
                    if(!removed) {
                        for(var i = 0, maxi = eventHandlers.length; i < maxi; i++) {
                            if(eventHandlers[i] === handler) {
                                // do not splice here to allow removing inside the handler
                                eventHandlers[i] = null;

                                removed = true;

                                break;
                            }
                        }
                    }
                };
            },
            emit: function(eventName, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                if(!angular.isString(eventName)) {
                    $exceptionHandler(new Error('event name must be a string'));
                }

                if(arguments.length > 10) {
                    $exceptionHandler(new Error('at most 9 arguments can be passed'));
                }

                var eventHandlers = this._eventsHandlers[eventName];

                if(eventHandlers) {
                    var stopped, maxi, i;
                    var evt = {
                        name: eventName,
                        defaultPrevented: false,
                        stopImmediatePropagation: function() {
                            stopped = true;
                        },
                        preventDefault: function() {
                            this.defaultPrevented = true;
                        }
                    };

                    for(i = 0, maxi = eventHandlers.length; i < maxi; i++) {
                        if(!eventHandlers[i]) {
                            // really remove removed handler
                            eventHandlers.splice(i, 1);
                            i--;
                            maxi--;
                        } else {
                            try {
                                // not like in AngularJS $emit implementation, but
                                // siginficantly faster than apply(null, arguments)
                                eventHandlers[i].call(null, evt, a1, a2, a3, a4, a5, a6, a7, a8, a9);
                            } catch(e) {
                                $exceptionHandler(e);
                            }

                            if(stopped) {
                                break;
                            }
                        }
                    }
                }
            }
        });


        return EventEmitter;
    }]);


// ### << event-emitter.service.js



// ### main.js >>

angular
	.module('ui-router-progress', [
		'ui-router-progress.state-progress-monitor',
		'ui-router-progress.state-progress-indicator'
	]);


// ### << main.js



// ### state-progress-indicator.directive.js >>

angular
    .module('ui-router-progress.state-progress-indicator', [
        'ui-router-progress.state-progress-monitor'
    ])
    .directive('uiStateProgressIndicator', ['stateProgressMonitor', function(stateProgressMonitor) {
        return {
            restrict: 'AC',
            link: function($scope, $element/*, $attrs*/) {
                var removeShowListener = stateProgressMonitor.on('loadstart', function() {
                    $element.addClass('is-loading');
                });

                var removeHideListener = stateProgressMonitor.on('loadend', function() {
                    $element.removeClass('is-loading');
                });

                $scope.$on('destroy', function() {
                    removeShowListener();
                    removeHideListener();
                });
            }
        };
    }]);


// ### << state-progress-indicator.directive.js



// ### state-progress-monitor.service.js >>

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
            $get: ['$rootScope', 'EventEmitter', function($rootScope, EventEmitter) {
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
            }],
            exclude: exclude
        };
    });


// ### << state-progress-monitor.service.js


