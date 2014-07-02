describe('stateProgressMonitor service - module test', function() {

    beforeEach(angular.mock.module('ui-router-progress.state-progress-monitor'));

    it('should have a "stateProgressMonitor" service', inject(function($injector) {
        expect(function() { $injector.get('stateProgressMonitor'); }).not.toThrow();
    }));

});

describe('stateProgressMonitor service - unit tests', function() {
    var stateProgressMonitor;
    var $rootScope;

    beforeEach(function() {
        angular.mock.module('ui-router-progress.state-progress-monitor');

        inject(function(_stateProgress_, _$rootScope_) {
            stateProgressMonitor = _stateProgress_;
            $rootScope = _$rootScope_;
        });
    });

    afterEach(function() {
        stateProgressMonitor = null;
    });


    it('should be an object', function() {
        expect(typeof stateProgressMonitor).toBe('object');
    });

    it('should expose watch method', function() {
        expect(typeof stateProgressMonitor.watch).toBe('function'); 
    });

});