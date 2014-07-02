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
