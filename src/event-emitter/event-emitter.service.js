angular
    .module('ui-router-progress.event-emitter', [ ])
    .factory('EventEmitter', function($exceptionHandler) {
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
    });
