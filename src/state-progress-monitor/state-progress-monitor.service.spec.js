describe('stateProgressMonitor service - module test', function() {
    var stateProgressMonitor;

    beforeEach(angular.mock.module('ui-router-progress.state-progress-monitor'));

    it('should have a "stateProgressMonitor" service', function() {
        expect(function() {
            inject(function(_stateProgressMonitor_) {
                stateProgressMonitor = _stateProgressMonitor_;

                expect(stateProgressMonitor).toBeDefined();
            });
        }).not.toThrow();
    });

    it('should be an object', function() {
        expect(typeof stateProgressMonitor).toBe('object');
    });

});


describe('stateProgressMonitor service - provider', function() {
    var stateProgressMonitor;
    var stateProgressMonitorProvider;

    beforeEach(function() {
        angular.mock.module('ui-router-progress.state-progress-monitor');

        module(function(_stateProgressMonitorProvider_) {
            stateProgressMonitorProvider = _stateProgressMonitorProvider_;

            expect(stateProgressMonitorProvider).toBeDefined();
        });

        inject(function(_stateProgressMonitor_) {
            stateProgressMonitor = _stateProgressMonitor_;
        });
    });

    afterEach(function() {
        stateProgressMonitor = null;
        stateProgressMonitorProvider = null;
    });


    it('should expose "watch" method which let to specify states for watching on', function() {
        expect(typeof stateProgressMonitorProvider.watch).toBe('function');

        expect(function() {
            stateProgressMonitorProvider.watch('state1');
        }).not.toThrow();

        expect(function() {
            stateProgressMonitorProvider.watch('state1', 'state2');
        }).not.toThrow();

        expect(function() {
            stateProgressMonitorProvider.watch('state1', 'state2', { name: 'state3' });
        }).not.toThrow();
    });

    it('should expose "watch" method which throws if states to watch are not state objects or strings', function() {
        expect(typeof stateProgressMonitorProvider.watch).toBe('function');

        expect(function() {
            stateProgressMonitorProvider.watch();
        }).toThrow();

        expect(function() {
            stateProgressMonitorProvider.watch(1);
        }).toThrow();

        expect(function() {
            stateProgressMonitorProvider.watch({ surname: 'state1' });
        }).toThrow();
    });

    it('should expose "watch" method which returns function which let turn off watching for passed states', function() {
        var unwatch = stateProgressMonitorProvider.watch('state1', 'state2', { name: 'state3' });

        expect(typeof unwatch).toBe('function');

        expect(function() {
            unwatch();
        }).not.toThrow();
    });

});


describe('stateProgressMonitor service - registering handlers for events', function() {
    var stateProgressMonitor;


    beforeEach(function() {
        angular.mock.module('ui-router-progress.state-progress-monitor');

        inject(function(_stateProgressMonitor_) {
            stateProgressMonitor = _stateProgressMonitor_;
        });
    });

    afterEach(function() {
        stateProgressMonitor = null;
    });

    it('should expose "on" method which lets registering handlers for events', function() {
        expect(typeof stateProgressMonitor.on).toBe('function');

        expect(function() {
            stateProgressMonitor.on('show', function() { });
        }).not.toThrow();
    });

});

describe('stateProgressMonitor service - firing events', function() {
    var stateProgressMonitor;
    var $rootScope;


    beforeEach(function() {
        angular.mock.module('ui-router-progress.state-progress-monitor');

        inject(function(_stateProgressMonitor_, _$rootScope_) {
            stateProgressMonitor = _stateProgressMonitor_;

            $rootScope = _$rootScope_;
        });
    });

    afterEach(function() {
        stateProgressMonitor = null;
    });

    it('should fire events handler on watched state change', function() {
        // expect(typeof stateProgressMonitor.on).toBe('function');

        // expect(function() {
        //     stateProgressMonitor.on('show', function() { });
        // }).not.toThrow();
    });

});