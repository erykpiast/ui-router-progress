// ### example.service.js >>

angular
    .module('ui-router-progress.example', [ ])
    .factory('example', function($rootScope) {
        return function() {
            $rootScope.example = true;

            return true;
        };
    });


// ### << example.service.js



// ### main.js >>

angular
	.module('ui-router-progress', [
		'ui-router-progress.submodule'
	]);


// ### << main.js


