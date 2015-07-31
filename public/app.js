angular.module('omnibooks', [
    'ui.router',
    'omnibooks.home',
    'omnibooks.profile',
    'omnibooks.item',
    'omnibooks.market',
    'omnibooks.database',
    'omnibooks.auth',
    'omnibooks.mail',
    'firebase',
    'ngMock'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'html/home.html',
        controller: 'HomeController'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'html/profile.html',
        controller: 'ProfileController'
      })
      .state('market', {
        url: '/market',
        templateUrl: 'html/market.html',
        controller: 'MarketController'
      })
      .state('books', {
        url: '/item/:itemId',
        templateUrl: 'html/item.html',
        controller: 'ItemController',
      });
  })
  .controller('IndexController', ['$scope', '$location', '$state', '$firebaseObject', 'fireBase',
    function($scope, $location, $state, $firebaseObject, fireBase) {
      $scope.goHome = function() {
        $location.path('/home');
      };
      $scope.goProfile = function() {
        $location.path('/profile');
      };
      $scope.goMarket = function() {
        $location.path('/market');
      };
      $scope.goItem = function() {
        $location.path('/item');
      };
    }
  ]);
