// ### event-emitter.service.js >>

angular
    .module('ui-router-progress.event-emitter', [ ])
    .factory('EventEmitter', function() {
        function EventEmitter() {
            this._eventsHandlers = { };
        }


        angular.extend(EventEmitter.prototype, {
            on: function(eventName, handler) {
                if(!angular.isString(eventName)) {
                    throw new Error('event name must be a string');
                }

                if(!angular.isFunction(handler)) {
                    throw new Error('event handler must be a function');   
                }

                var eventHandlers = (this._eventsHandlers[eventName] || (this._eventsHandlers[eventName] = [ ]));

                eventHandlers.push(handler);
                
                var removed = false;
                return function() {
                    if(!removed) {
                        for(var i = 0, maxi = eventHandlers.length; i < maxi; i++) {
                            if(eventHandlers[i] === handler) {
                                eventHandlers.splice(i, 1);

                                removed = true;

                                break;
                            }
                        }
                    }
                };
            },
            emit: function(eventName) {
                if(!angular.isString(eventName)) {
                    throw new Error('event name must be a string');
                }

                var eventHandlers = this._eventsHandlers[eventName];

                if(eventHandlers) {
                    var stopped, maxi, i;
                    var args = [{
                        name: eventName,
                        defaultPrevented: false,
                        stopPropagation: function() {
                            stopped = true;
                        },
                        preventDefault: function() {
                            this.defaultPrevented = true;
                        }
                    }];

                    for(i = 1, maxi = arguments.length; i < maxi; i++) {
                        args.push(arguments[i]);
                    }

                    for(i = 0, maxi = eventHandlers.length; i < maxi; i++) {
                        eventHandlers[i].apply(null, args);

                        if(stopped) {
                            break;
                        }
                    }
                }
            }
        });


        return EventEmitter;
    });


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


