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
			'phone' : '1zxhwvectp4t7qu16tq56f8q4w',
			'tablet' : '2ubbzdjm1jm5ugc75w79h0kj44'
		},
		'android' : {
			'phone' : 'ackad5u6f0b7db48jjvwygxdnr',
			'tablet' : 'ackad5u6f0b7db48jjvwygxdnr'
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
	$scope.currentVersion = 'iOS vXXXX.X.X'
	$scope.deviceType = 'phone';
	$scope.platform = 'ios';
	$scope.sessionActive;
	$scope.currentDevice = 'iPhone 8 Plus';
	$scope.currentLangauge = 'en';

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
			if ($scope.platform == 'ios') {
				$scope.currentVersion = 'iOS v2019.6.0'
			} else {
				$scope.currentVersion = 'Android v2019.5.0'
			}
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

	$scope.changeLanguage = function() {
		if (!$scope.sessionActive || confirm('This will restart your session. Do you want to continue?')) {
			if (document && document.querySelector('iframe') && document.querySelector('iframe').contentWindow) {
				var iframe = document.querySelector('iframe');
				console.log('language change requested');
				$scope.currentLangauge = ''+document.getElementsByName('language_code')[0].value;
				console.log($scope.currentLangauge)
				iframe.contentWindow.postMessage('restartApp', '*');
			}
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
