describe('EventEmitter service - module test', function() {
	var EventEmitter;
	var eventEmitter;

    beforeEach(angular.mock.module('ui-router-progress.event-emitter'));

    it('should exist "EventEmitter" service', inject(function($injector) {
        expect(function() { EventEmitter = $injector.get('EventEmitter'); }).not.toThrow();
    }));

    it('should be a function', function() {
        expect(typeof EventEmitter).toBe('function');
    });

    it('should let create an instance', function() {
    	expect(function() { eventEmitter = new EventEmitter() }).not.toThrow();
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

    it('should let register multiple handlers for the same event by "on" method', function() {
    	eventEmitter.on('event', function() { return true; });

    	expect(function() { 
        	eventEmitter.on('event', function() { return false; });
        }).not.toThrow();
    });

    it('should on method return function', function() {
    	var removeHandler = eventEmitter.on('event', function() { });

    	expect(typeof removeHandler).toBe('function');
    });

});