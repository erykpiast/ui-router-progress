angular
    .module('ui-router-progress.event-emitter', [ ])
    .factory('EventEmitter', function() {
        function EventEmitter() {
            this._eventsHandlers = { };
        }


        angular.extend(EventEmitter.prototype, {
            on: function(eventName, handler) {
                var eventHandlers = (this._eventsHandlers[eventName] || (this._eventsHandlers[eventName] = [ ]));

                eventHandlers.push(handler);
                
                return function() {
                    for(var i = 0, maxi = eventHandlers.length; i < maxi; i++) {
                        if(eventHandlers[i] === handler) {
                            eventHandlers.splice(i, 1);

                            break;
                        }
                    }
                };
            },
            emit: function(eventName) {
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
