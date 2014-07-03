describe('EventEmitter service - module test', function() {
    var EventEmitter;
    var eventEmitter;

    beforeEach(angular.mock.module('ui-router-progress.event-emitter'));

    it('should have a "EventEmitter" service', inject(function(_EventEmitter_) {
        EventEmitter = _EventEmitter_;

        expect(EventEmitter).toBeDefined();
    }));

    it('should be a function', function() {
        expect(typeof EventEmitter).toBe('function');
    });

    it('should let create an instance', function() {
        expect(function() { eventEmitter = new EventEmitter(); }).not.toThrow();
    });

    it('should instance has a on method on', function() {
        expect(typeof eventEmitter.on).toBe('function');
    });

    it('should instance has a on method emit', function() {
        expect(typeof eventEmitter.emit).toBe('function');
    });

});

describe('EventEmitter service - handlers registration', function() {
    var EventEmitter;
    var eventEmitter;

    beforeEach(function() {
        angular.mock.module('ui-router-progress.event-emitter');

        inject(function(_EventEmitter_) {
            EventEmitter = _EventEmitter_;
            eventEmitter = new EventEmitter();
        });
    });

    afterEach(function() {
        EventEmitter = null;
        eventEmitter = null;
    });


    it('should let register handler for an event by "on" method', function() {
        expect(function() { 
            eventEmitter.on('event', function() { });
        }).not.toThrow();
    });

    it('should throw an error if less than two arguments were passed to "on" method', function() {
        expect(function() { 
            eventEmitter.on();
        }).toThrow();

        expect(function() { 
            eventEmitter.on('event');
        }).toThrow();
    });

    it('should throw an error if the first argument is not a string', function() {
        expect(function() { 
            eventEmitter.on();
        }).toThrow();

        expect(function() { 
            eventEmitter.on({ });
        }).toThrow();

        expect(function() { 
            eventEmitter.on(function() { });
        }).toThrow();

        expect(function() { 
            eventEmitter.on(2);
        }).toThrow();
    });

    it('should throw an error if second argument is not a function', function() {
        expect(function() { 
            eventEmitter.on('event');
        }).toThrow();

        expect(function() { 
            eventEmitter.on('event', { });
        }).toThrow();

        expect(function() { 
            eventEmitter.on('event', 'function');
        }).toThrow();

        expect(function() { 
            eventEmitter.on('event', 2);
        }).toThrow();
    });

    it('should let register multiple handlers for the same event by "on" method', function() {
        eventEmitter.on('event', function() { });

        expect(function() { 
            eventEmitter.on('event', function() { });
        }).not.toThrow();

        expect(function() { 
            eventEmitter.on('event', function() { });
        }).not.toThrow();

        expect(function() { 
            eventEmitter.on('event', function() { });
        }).not.toThrow();
    });

    it('should on method return a function', function() {
        var removeHandler = eventEmitter.on('event', function() { });

        expect(typeof removeHandler).toBe('function');
    });

    it('should on method return a function', function() {
        var removeHandler = eventEmitter.on('event', function() { });

        expect(typeof removeHandler).toBe('function');
    });

});


describe('EventEmitter service - events emitting', function() {
    var EventEmitter;
    var eventEmitter;
    var eventHandler1;
    var eventHandler2;
    var handlersCalls;

    beforeEach(function() {
        angular.mock.module('ui-router-progress.event-emitter');

        inject(function(_EventEmitter_) {
            EventEmitter = _EventEmitter_;
            eventEmitter = new EventEmitter();
            handlersCalls = [ ];

            eventEmitter.on('event', eventHandler1 = jasmine.createSpy('eventHandler1').and.callFake(function() {
                handlersCalls.push(eventHandler1);
            }));
            eventEmitter.on('event', eventHandler2 = jasmine.createSpy('eventHandler2').and.callFake(function() {
                handlersCalls.push(eventHandler2);
            }));
        });
    });

    afterEach(function() {
        EventEmitter = null;
        eventEmitter = null;
        eventHandler1 = null;
        eventHandler2 = null;
        handlersCalls = null;
    });


    it('should let emit an event by "emit" function', function() {
        expect(function() { 
            eventEmitter.emit('event');
        }).not.toThrow();
    });

    it('should let pass multiple arguments of variouse types to "emit" function', function() {
        expect(function() { 
            eventEmitter.emit('event', 'arg', 1, { }, function() { });
        }).not.toThrow();
    });

    it('should throw an error if event name is not a string', function() {
        expect(function() { 
            eventEmitter.emit();
        }).toThrow();

        expect(function() { 
            eventEmitter.emit({ });
        }).toThrow();

        expect(function() { 
            eventEmitter.emit(function() { });
        }).toThrow();

        expect(function() { 
            eventEmitter.emit(2);
        }).toThrow();
    });

    it('should call event handlers when "emit" method is called', function() {
        eventEmitter.emit('event');

        expect(eventHandler1).toHaveBeenCalled();
        expect(eventHandler2).toHaveBeenCalled();
    });

    it('should call event handlers with arguments it any was passed to "emit" method', function() {
        eventEmitter.emit('event', 'arg', 1, { }, function() { });

        expect(eventHandler1).toHaveBeenCalledWith(jasmine.any(Object), 'arg', 1, jasmine.any(Object), jasmine.any(Function),
            undefined, undefined, undefined, undefined, undefined);
        expect(eventHandler2).toHaveBeenCalledWith(jasmine.any(Object), 'arg', 1, jasmine.any(Object), jasmine.any(Function),
            undefined, undefined, undefined, undefined, undefined);
    });

    it('should let to pass at most 9 arguments', function() {
        expect(function() {
            eventEmitter.emit('event', 1, 2, 3, 4, 5, 6, 7, 8, 9);
        }).not.toThrow();

        expect(function() {
            eventEmitter.emit('event', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        }).toThrow();
    });

    it('should call event handlers every time when "emit" method is called and do it one time per handler', function() {
        eventEmitter.emit('event');

        expect(eventHandler1.calls.count()).toBe(1);


        eventEmitter.emit('event');

        expect(eventHandler1.calls.count()).toBe(2);
    });

    it('should call event handlers in order they were attached to event when "emit" method is called', function() {
        eventEmitter.emit('event');

        expect(handlersCalls.indexOf(eventHandler1)).toBeLessThan(handlersCalls.indexOf(eventHandler2));
    });
});


describe('EventEmitter service - handlers removing', function() {
    var EventEmitter;
    var eventEmitter;
    var eventHandler1;
    var eventHandler2;
    var removeHandler1;
    var removeHandler2;

    beforeEach(function() {
        angular.mock.module('ui-router-progress.event-emitter');

        inject(function(_EventEmitter_) {
            EventEmitter = _EventEmitter_;
            eventEmitter = new EventEmitter();

            removeHandler1 = eventEmitter.on('event', eventHandler1 = jasmine.createSpy('eventHandler1'));
            removeHandler2 = eventEmitter.on('event', eventHandler2 = jasmine.createSpy('eventHandler2'));
        });
    });

    afterEach(function() {
        EventEmitter = null;
        eventEmitter = null;
        eventHandler1 = null;
        eventHandler2 = null;
        removeHandler1 = null;
        removeHandler2 = null;
    });


    it('should let remove event handler by function returned by "on" method', function() {
        expect(function() { 
            removeHandler1();
        }).not.toThrow();

        expect(function() { 
            removeHandler2();
        }).not.toThrow();
    });

    it('should let to call function returned by "on" method multiple times', function() {
        removeHandler1();

        expect(function() { 
            removeHandler1();
        }).not.toThrow();

        expect(function() { 
            removeHandler1();
        }).not.toThrow();

        expect(function() { 
            removeHandler1();
        }).not.toThrow();
    });

    it('should not to call removed event handler when "emit" method is called', function() {
        removeHandler1();

        eventEmitter.emit('event');

        expect(eventHandler1).not.toHaveBeenCalled();
    });

    it('should allow to remove handler inside another handler', function() {
        var eventHandler4 = jasmine.createSpy('eventHandler4');
        var eventHandler3 = jasmine.createSpy('eventHandler3').and.callFake(function() {
            removeHandler1();
            removeHandler2();
            removeHandler3();
            removeHandler4();
        });
        
        var removeHandler3 = eventEmitter.on('event', eventHandler3);
        var removeHandler4 = eventEmitter.on('event', eventHandler4);

        eventHandler1.calls.reset();
        eventHandler2.calls.reset();

        eventEmitter.emit('event');

        expect(eventHandler1).toHaveBeenCalled();
        expect(eventHandler2).toHaveBeenCalled();
        expect(eventHandler3).toHaveBeenCalled();
        expect(eventHandler4).not.toHaveBeenCalled();
    });

});


describe('EventEmitter service - event object', function() {
    var EventEmitter;
    var eventEmitter;
    var eventHandler1;
    var eventHandler2;
    var e1;
    var e2;

    beforeEach(function() {
        angular.mock.module('ui-router-progress.event-emitter');

        inject(function(_EventEmitter_) {
            EventEmitter = _EventEmitter_;
            eventEmitter = new EventEmitter();

            eventEmitter.on('event', eventHandler1 = jasmine.createSpy('eventHandler1'));
            eventEmitter.on('event', eventHandler2 = jasmine.createSpy('eventHandler2'));

            eventEmitter.emit('event');

            e1 = eventHandler1.calls.mostRecent().args[0];
            e2 = eventHandler2.calls.mostRecent().args[0];
        });
    });

    afterEach(function() {
        EventEmitter = null;
        eventEmitter = null;
        eventHandler1 = null;
        eventHandler2 = null;
    });


    it('should event object be passed to event handler when it is called', function() {
        expect(e1).toBeDefined();
        expect(typeof e1).toBe('object');
    });

    it('should event object be the same for all handlers', function() {
        expect(e1).toBe(e2);
    });

    it('should event object has event name in name property', function() {
       expect(e1.name).toBe('event'); 
    });

    it('should event object has "preventDefault" method which set "defaultPrevented" flag to true', function() {
        expect(e1.defaultPrevented).toBe(false);

        expect(typeof e1.preventDefault).toBe('function'); 

        e1.preventDefault();

        expect(e1.defaultPrevented).toBe(true);
    });

    it('should event object has "stopImmediatePropagation" method which breaks handlers call loop', function() {
        var eventHandler3 = jasmine.createSpy('eventHandler3').and.callFake(function(e) {
            e.stopImmediatePropagation();
        });
        var eventHandler4 = jasmine.createSpy('eventHandler4');
        var eventHandler5 = jasmine.createSpy('eventHandler5');

        eventEmitter.on('event', eventHandler3);
        eventEmitter.on('event', eventHandler4);

        eventHandler1.calls.reset();
        eventHandler2.calls.reset();
        eventEmitter.emit('event');

        expect(eventHandler1).toHaveBeenCalled();
        expect(eventHandler2).toHaveBeenCalled();
        expect(eventHandler3).toHaveBeenCalled();
        expect(eventHandler4).not.toHaveBeenCalled();
        expect(eventHandler5).not.toHaveBeenCalled();
    });

});