angular.module('appetizePages')
.controller('SampleCtrl', function($scope, $rootScope, $http, $location, $sce, $window) {
	
	const IOS_VERSION = 'iOS v2020.3.0';
	const ANDROID_VERSION = 'Android v2020.3.1';

	toastr.options.timeOut = 5000;
    	toastr.options.positionClass = 'toast-top-center';

	$scope.device = 'iphone8plus';
	$scope.publicKey = '84ajz70da0ggqma2q3mxreugfm';

	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	};

	$scope.apps = {
		'ios' : {
			'phone' : '84ajz70da0ggqma2q3mxreugfm',
			'tablet' : 'ex4uuvfpj0g8rd0t0b2pyfdezr'
		},
		'android' : {
			'phone' : 'r01rg30mrygv288drvrw23fcfr',
			'tablet' : 'r01rg30mrygv288drvrw23fcfr'
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
	$scope.currentVersion = IOS_VERSION;
	$scope.deviceType = 'phone';
	$scope.platform = 'ios';
	$scope.sessionActive;
	$scope.currentDevice = 'iPhone 8 Plus';
	$scope.currentLangauge = 'en';
	
	$scope.logSrc = 
		$scope.apps[$scope.platform][$scope.deviceType] + 
		'?device=' + 
		$scope.devices[$scope.platform][$scope.deviceType] + 
		'&scale=75&deviceColor=white&screenOnly=false&centered=true&xdocMsg=true&osVersion=13.3&debug=true&proxy=intercept&language=' + 
		$scope.currentLangauge;

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
				$scope.currentVersion = IOS_VERSION;
			} else {
				$scope.currentVersion = ANDROID_VERSION;
			}
			$scope.logSrc = $scope.apps[$scope.platform][$scope.deviceType] + '?device=' + $scope.devices[$scope.platform][$scope.deviceType] + '&scale=75&deviceColor=white&screenOnly=false&centered=true&xdocMsg=true&osVersion=13.3&debug=true&proxy=intercept&language=' + $scope.currentLangauge;
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
