'use strict';


// Declare app level module which depends on filters, and services
angular.module('quotingTool', ['quotingTool.filters', 'quotingTool.services', 'quotingTool.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/quote', {templateUrl: 'partials/quote.html', controller: Quote});
    $routeProvider.when('/forms/:taxPayorIndex', {templateUrl: 'partials/forms.html', controller: Forms});
    $routeProvider.when('/summary', {templateUrl: 'partials/summary.html', controller: Summary});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: Login});
    $routeProvider.otherwise({redirectTo: '/quote'});
  }]);