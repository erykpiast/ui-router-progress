describe('stateProgressMonitor service - module test', function() {

    beforeEach(angular.mock.module('ui-router-progress.state-progress-monitor'));

    it('should have a "stateProgressMonitor" service', inject(function(stateProgressMonitor) {
        expect(stateProgressMonitor).toBeDefined();
    }));

});

describe('stateProgressMonitor service - unit tests', function() {
    var stateProgressMonitor;

    beforeEach(function() {
        angular.mock.module('ui-router-progress.state-progress-monitor');

        inject(function(_stateProgressMonitor_) {
            stateProgressMonitor = _stateProgressMonitor_;
        });
    });

    afterEach(function() {
        Date.now = Date.__now__;

        stateProgressMonitor = null;
    });


    it('should be an object', function() {
        expect(typeof stateProgressMonitor).toBe('object');
    });

    it('should expose on method', function() {
        expect(typeof stateProgressMonitor.on).toBe('function'); 
    });

});