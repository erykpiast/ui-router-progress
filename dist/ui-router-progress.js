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
            restrict: 'A',
            link: function($scope, $element/*, $attrs*/) {
                $element.addClass('ui-state-progress-indicator');

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
    }]);


// ### << state-progress-indicator.directive.js



// ### state-progress-monitor.service.js >>

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
            $get: ['$rootScope', 'EventEmitter', function($rootScope, EventEmitter) {
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
            }],
            watch: watch
        };
    });


// ### << state-progress-monitor.service.js


