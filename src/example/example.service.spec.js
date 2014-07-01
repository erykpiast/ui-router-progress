describe('stateProgress service - module test', function() {

    beforeEach(angular.mock.module('ui-router-progress.stateProgress'));

    it('should have a "stateProgress" service', inject(function($injector) {
        expect(function() { $injector.get('stateProgress'); }).not.toThrow();
    }));

});

describe('stateProgress service - unit tests', function() {
    var stateProgress;
    var $rootScope;

    beforeEach(function() {
        // mock some basic stuff
        Date.__now__ = Date.now;
        Date.now = function() {
            return 1368817912431;
        };

        angular.mock.module('ui-router-progress.stateProgress');

        inject(function(_stateProgress_, _$rootScope_) {
            stateProgress = _stateProgress_;
            $rootScope = _$rootScope_;
        });
    });

    afterEach(function() {
        Date.now = Date.__now__;

        stateProgress = null;
    });


    it('should be a function', function() {
        expect(typeof stateProgress).toBe('function');
    });

    it('should return true', function() {
        expect(stateProgress()).toBe(true);
    });

});