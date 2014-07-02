describe('stateProgressIndicator directive - module test', function() {

    beforeEach(angular.mock.module('ui-router-progress.state-progress-indicator'));

    it('should have a "stateProgressIndicator" directive', inject(function($injector) {
        expect(function() { $injector.get('stateProgressIndicator'); }).not.toThrow();
    }));

});

describe('stateProgressIndicator directive - unit tests', function() {
    var stateProgressIndicator;
    var $rootScope;

    beforeEach(function() {
        angular.mock.module('ui-router-progress.state-progress-indicator');

        inject(function(_stateProgressIndicator_, _$rootScope_) {
            stateProgressIndicator = _stateProgressIndicator_;
            $rootScope = _$rootScope_;
        });
    });

    afterEach(function() {
        Date.now = Date.__now__;

        stateProgressIndicator = null;
    });


    it('should be a function', function() {
        expect(typeof stateProgressIndicator).toBe('function');
    });

    it('should return true', function() {
        expect(stateProgressIndicator()).toBe(true);
    });

});