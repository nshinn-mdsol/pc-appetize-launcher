angular.module('appetizePages')
.controller('SampleCtrl', function($scope, $rootScope, $http, $location, $sce, $window) {

	toastr.options.timeOut = 5000;
    toastr.options.positionClass = 'toast-top-center';

	$scope.device = 'iphone8plus';
	$scope.publicKey = 'cuy1xcdtdupmmyn67uvvm8mb70';

	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	};

	$scope.apps = {
		'ios' : {
			'phone' : 'cuy1xcdtdupmmyn67uvvm8mb70',
			'tablet' : '867ndx6fnc16hee6te2e0y1430'
		},
		'android' : {
			'phone' : 'mev1azmjrdpagnu5zz89n9vyx0',
			'tablet' : 'mev1azmjrdpagnu5zz89n9vyx0'
		}
	};

	$scope.devices = {
		'ios' : {
			'phone' : 'iphone8plus',
			'tablet' : 'ipadair2'
		},
		'android' : {
			'phone' : 'nexus5',
			'tablet' : 'nexus9'
		}
	};

	$scope.deviceNames = {
		'ios' : {
			'phone' : 'iPhone 8 Plus',
			'tablet' : 'iPad Air 2'
		},
		'android' : {
			'phone' : 'Nexus 5',
			'tablet' : 'Nexus 9'
		}
	};

	$scope.appName = 'PatientCloud';
	$scope.deviceType = 'phone';
	$scope.platform = 'ios';
	$scope.sessionActive;
	$scope.currentDevice = 'iPhone 8 Plus';

	$scope.$watch("scale", function(newValue, oldValue) {
		if(newValue === oldValue)
			return;
		if (document && document.querySelector('iframe') && document.querySelector('iframe').contentWindow){
			var iframe = document.querySelector('iframe');
			iframe.contentWindow.postMessage({type: 'setScale', value: newValue * 100}, '*');
		}

	}, false);

	$scope.updateField = function(field, newValue) {
		if ($scope[field] === newValue) return;
		if (!$scope.sessionActive || confirm('This will restart your session. Do you want to continue?')) {
			$scope[field] = newValue;
			$scope.sessionActive = false;
			$scope.currentDevice = $scope.deviceNames[$scope.platform][$scope.deviceType]
		}
		toastr.remove();
	}

	$scope.endSession = function() {
		if (!$scope.sessionActive || confirm('This will restart your session. Do you want to continue?')) {
			if (document && document.querySelector('iframe') && document.querySelector('iframe').contentWindow) {
				var iframe = document.querySelector('iframe');
				iframe.contentWindow.postMessage('endSession', '*');
			}
		}
	}

	$scope.saveScreenshot = function() {
		if (document && document.querySelector('iframe') && document.querySelector('iframe').contentWindow) {
			var iframe = document.querySelector('iframe');
			console.log('screenshot requested');
			iframe.contentWindow.postMessage('getScreenshot', '*');
	    iframe.contentWindow.postMessage('saveScreenshot', '*');
		}
	}

	var messageEventHandler = function(event) {
		if (event.data == 'appLaunch') {
			$scope.sessionActive = true;
			$rootScope.$apply(function() {
				// do nothing
			});
		} else if (event.data == 'sessionEnded') {
			$scope.sessionActive = false;
			$rootScope.$apply(function() {
				// do nothing
			});
		} else if (event.data == 'screenshot') {
			$scope.sessionActive = true;
			$rootScope.$apply(function() {
				// do nothing
			});
		} else if (event.data && event.data.type == 'userErrorMessage' && event.data.message) {
			toastr.error(event.data.message);
		}
	};

	$window.addEventListener('message', messageEventHandler, false);
});
