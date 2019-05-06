'use strict';

angular.module('appetizePages', [
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider', function($routeProvider, $locationProvider, $httpProvider, $compileProvider) {


    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|appetize\.io):/);

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

  }]);
