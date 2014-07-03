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

    beforeEach(function() {
        angular.mock.module('ui-router-progress.event-emitter');

        inject(function(_EventEmitter_) {
            EventEmitter = _EventEmitter_;
            eventEmitter = new EventEmitter();

            eventEmitter.on('event', eventHandler1 = jasmine.createSpy());
            eventEmitter.on('event', eventHandler2 = jasmine.createSpy());
        });
    });

    afterEach(function() {
        EventEmitter = null;
        eventEmitter = null;
        eventHandler1 = null;
        eventHandler2 = null;
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

    it('should call event handlers after when "emit" method is called', function() {
        eventEmitter.emit('event');

        expect(eventHandler1).toHaveBeenCalled();
        expect(eventHandler2).toHaveBeenCalled();
    });

    it('should call event handlers with arguments it any was passed to "emit" method', function() {
        eventEmitter.emit('event', 'arg', 1, { }, function() { });

        expect(eventHandler1).toHaveBeenCalledWith(jasmine.any(Object), 'arg', 1, jasmine.any(Object), jasmine.any(Function));
        expect(eventHandler2).toHaveBeenCalledWith(jasmine.any(Object), 'arg', 1, jasmine.any(Object), jasmine.any(Function));
    });

    it('should call event handlers every time when "emit" method is called and do it one time per handler', function() {
        eventEmitter.emit('event');

        expect(eventHandler1.callCount).toBe(1);


        eventEmitter.emit('event');

        expect(eventHandler1.callCount).toBe(2);
    });

    it('should call event handlers after when "emit" method is called', function() {
        eventEmitter.emit('event');

        expect(eventHandler1).toHaveBeenCalled();
        expect(eventHandler2).toHaveBeenCalled();
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

            removeHandler1 = eventEmitter.on('event', eventHandler1 = jasmine.createSpy());
            removeHandler2 = eventEmitter.on('event', eventHandler2 = jasmine.createSpy());
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

});