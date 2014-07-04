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

        angular.mock.module(function(_stateProgressMonitorProvider_) {
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


    it('should expose "exclude" method which let to specify states that should not be excludeed', function() {
        expect(typeof stateProgressMonitorProvider.exclude).toBe('function');

        expect(function() {
            stateProgressMonitorProvider.exclude('state1');
        }).not.toThrow();

        expect(function() {
            stateProgressMonitorProvider.exclude('state1', 'state2');
        }).not.toThrow();

        expect(function() {
            stateProgressMonitorProvider.exclude('state1', 'state2', { name: 'state3' });
        }).not.toThrow();
    });

    it('should expose "exclude" method which throws if states to exclude are not state objects or strings', function() {
        expect(typeof stateProgressMonitorProvider.exclude).toBe('function');

        expect(function() {
            stateProgressMonitorProvider.exclude();
        }).toThrow();

        expect(function() {
            stateProgressMonitorProvider.exclude(1);
        }).toThrow();

        expect(function() {
            stateProgressMonitorProvider.exclude({ surname: 'state1' });
        }).toThrow();
    });

    it('should expose "exclude" method which returns function which let turn off exlcuding for passed states', function() {
        var include = stateProgressMonitorProvider.exclude('state1', 'state2', { name: 'state3' });

        expect(typeof include).toBe('function');

        expect(function() {
            include();
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
    var stateProgressMonitorProvider;
    var stateProgressMonitor;
    var $rootScope;
    var startHandler;
    var endHandler;


    beforeEach(function() {
        angular.mock.module('ui-router-progress.state-progress-monitor');

        angular.mock.module(function(_stateProgressMonitorProvider_) {
            stateProgressMonitorProvider = _stateProgressMonitorProvider_;

            stateProgressMonitorProvider.exclude('excluded1', { name: 'excluded2' });
        });

        inject(function(_stateProgressMonitor_, _$rootScope_) {
            stateProgressMonitor = _stateProgressMonitor_;
            $rootScope = _$rootScope_;

            stateProgressMonitor.on('loadstart', startHandler = jasmine.createSpy('startHandler'));
            stateProgressMonitor.on('loadend', endHandler = jasmine.createSpy('endHandler'));
        });
    });

    afterEach(function() {
        stateProgressMonitorProvider = null;
        stateProgressMonitor = null;
        $rootScope = null;
        startHandler = null;
        endHandler = null;
    });


    it('should fire events handler on state change start', function() {
        $rootScope.$emit('$stateChangeStart', { name: 'included' });

        expect(startHandler).toHaveBeenCalled();
    });

    it('should not fire events handler on excluded state change start', function() {
        $rootScope.$emit('$stateChangeStart', { name: 'excluded1' });

        expect(startHandler).not.toHaveBeenCalled();

        $rootScope.$emit('$stateChangeStart', { name: 'excluded2' });

        expect(startHandler).not.toHaveBeenCalled();
    });


    it('should fire events handler on state change end', function() {
        $rootScope.$emit('$stateChangeSuccess', { name: 'included' });

        expect(endHandler).toHaveBeenCalled();
    });

    it('should not fire events handler on excluded state change end', function() {
        $rootScope.$emit('$stateChangeSuccess', { name: 'excluded1' });

        expect(endHandler).not.toHaveBeenCalled();


        $rootScope.$emit('$stateChangeSuccess', { name: 'excluded2' });

        expect(endHandler).not.toHaveBeenCalled();
    });


    it('should fire events handler on state change error', function() {
        $rootScope.$emit('$stateChangeError', { name: 'included' });
        
        expect(endHandler).toHaveBeenCalled();


        endHandler.calls.reset();
        $rootScope.$emit('$stateNotFound', { to: 'included' });

        expect(endHandler).toHaveBeenCalled();
    });

    it('should not fire events handler on excluded state change end', function() {
        $rootScope.$emit('$stateChangeError', { name: 'excluded1' });

        expect(endHandler).not.toHaveBeenCalled();


        $rootScope.$emit('$stateChangeError', { name: 'excluded2' });

        expect(endHandler).not.toHaveBeenCalled();


        $rootScope.$emit('$stateNotFound', { to: 'excluded1' });

        expect(endHandler).not.toHaveBeenCalled();


        $rootScope.$emit('$stateNotFound', { to: 'excluded2' });

        expect(endHandler).not.toHaveBeenCalled();
    });

});