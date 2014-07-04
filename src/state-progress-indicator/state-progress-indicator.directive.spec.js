describe('stateProgressIndicator service - markup', function() {
    var $compile;
    var $rootScope;


    beforeEach(function() {
        inject(function(_$compile_, _$rootScope_){
          // The injector unwraps the underscores (_) from around the parameter names when matching
          $compile = _$compile_;
          $rootScope = _$rootScope_;
        });
    });

    afterEach(function() {
        $compile = null;
        $rootScope = null;
    });


    it('Should do not modify HTML of element', function() {
        var element = $compile('<div>' +
            '<div class="ui-state-progress-indicator">' +
                '<span>Test</span>' +
            '</div>' +
        '</div>')($rootScope);

        $rootScope.$digest();

        expect(element[0].innerHTML).toBe(
            '<div class="ui-state-progress-indicator">' +
                '<span>Test</span>' +
            '</div>'
        );


        element = $compile('<div>' +
            '<div ui-state-progress-indicator="">' +
                '<span>Test</span>' +
            '</div>' +
        '</div>')($rootScope);

        $rootScope.$digest();

        expect(element[0].innerHTML).toBe(
            '<div ui-state-progress-indicator="">' +
                '<span>Test</span>' +
            '</div>'
        );
    });

});


describe('stateProgressIndicator service - cooperation with stateProgresMonitor', function() {
    var monitorOn;
    var monitorOff;
    var element;


    beforeEach(function() {
        angular.mock.module('ui-router-progress.state-progress-indicator', function($provide) {
            $provide.value('stateProgressMonitor', {
                on: monitorOn = jasmine.createSpy('monitorOn').and.returnValue(monitorOff = jasmine.createSpy('monitorOff'))
            });
        });

        inject(function($compile, $rootScope) {
            element = $compile('<div>' +
                '<div class="ui-state-progress-indicator">' +
                    '<span>Test</span>' +
                '</div>' +
            '</div>')($rootScope);

            $rootScope.$digest();
        });
    });

    afterEach(function() {
        monitorOn = null;
        monitorOff = null;
        element = null;
    });

    it('Should call stateProgresMonitor.on method on start to register "loadstart" and "loadend" handlers', function() {
        expect(monitorOn).toHaveBeenCalled();
        expect(monitorOn.calls.count()).toBe(2);

        expect(monitorOn.calls.first().args[0]).toBe('loadstart');
        expect(monitorOn.calls.mostRecent().args[0]).toBe('loadend');
    });


    it('Should register "loadstart" and "loadend" handlers', function() {
        var startHandler = monitorOn.calls.first().args[1];
        var endHandler = monitorOn.calls.mostRecent().args[1];

        expect(typeof startHandler).toBe('function');
        expect(typeof endHandler).toBe('function');
    });

    it('Should add "is-loading" class to element when startHandler is called', function() {
        var startHandler = monitorOn.calls.first().args[1];

        startHandler();

        expect(element.find(':first-child').hasClass('is-loading')).toBeTruthy();
    });

    it('Should remove "is-loading" class to element when startHandler is called', function() {
        var startHandler = monitorOn.calls.first().args[1];
        var endHandler = monitorOn.calls.mostRecent().args[1];

        startHandler();
        endHandler();
        
        expect(element.find(':first-child').hasClass('is-loading')).toBeFalsy();
    });

});