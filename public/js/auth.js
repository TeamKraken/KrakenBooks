angular.module('omnibooks.auth', ['firebase', 'ui.bootstrap'])

.factory('auth', function(fireBase) {
  var loggedInUser = null; // updated when user logs in
  var loggedInOrg  = null;

  var signup = function (authInfo, success) {
    if(!fireBase.getUserInfo(authInfo.org, authInfo.name)){
      console.log('Already exists');
      throw 'The username is already registered. Try another name.';
    }
    console.log('SIGNUP!');
    try {
      fireBase.createUser(authInfo, setLoggedInInfo);
    } catch (err) {
      throw err;
    }
    // login({
    //   name: newUser.name,
    //   password: password
    // });
  };


  var login = function (authInfo) {
    var existingUser = fireBase.getUserInfo(authInfo.org, authInfo.name);
    if(!existingUser) {
      console.log('User not exists');
      throw 'incorrect user name.';
    }
    try {
      fireBase.authWithPassword(authInfo, function (authInfo) {
        setLoggedInInfo(authInfo);
      });
    } catch (err) {
      throw err;
    }
  };

  var setLoggedInInfo = function (authInfo) {
    loggedInUser = fireBase.getUserInfo(authInfo.org, authInfo.name);
    loggedInOrg  = authInfo.org;
  };

  var logOut = function () {
    loggedInUser = null;
  };

  var isLoggedIn = function () {
    return !!loggedInUser;
  };

  return {
    signup: signup,
    login: login,
    loggedInUser: loggedInUser,
    loggedInOrg: loggedInOrg,
    isLoggedIn: isLoggedIn,
    logOut: logOut
  };
})


angular.module('omnibooks')
.controller('authController', ['$scope', '$state', 'auth', 'fireBase', function ($scope, $state, auth, fireBase) {
  $scope.authInfo = {org: 'purdue', name: '', email: '', password: ''};
  $scope.clickSignup = function () {
    showSignupForm();
  };
  $scope.clickLogin = function () {
    if(auth.isLoggedIn()){
      logOut();
      return;
    }
    showLoginForm();
  };
  $scope.login = function () {
    hideError();
    try {
      auth.login($scope.authInfo);
      $scope.closeAuthForm();
      $('.red').val('Log out');
      $state.go("market");
    } catch (err) {
      showError(err);
    }
  };
  $scope.signup = function () {
    hideError();
    if(!fireBase.getUserInfo($scope.authInfo.org, $scope.authInfo.name)){
      showError('The username is already registered. Try another name.');
      console.log('Already exists');
      return;
    }
    console.log('SIGNUP!');
    try {
      auth.signup($scope.authInfo);
      $state.go("market");
    } catch (err) {
      console.error(err);
      showError(err);
    }
  };
  $scope.closeAuthForm = function () {
    $('#login_form').css({visibility: 'hidden'});
    $('.login_box').css({visibility : 'hidden'});
    $('#signup_form').css({visibility: 'hidden'});
    $('.signup_box').css({visibility : 'hidden'});
    hideError();
    resetUserInfo();
  };

  var logOut = function () {
    auth.logOut();
    $('.red').val('Login');
    $state.go("home");
  };

  function showError(message) {
    $scope.erroMessage = message;
    $('.error').css({visibility: 'visible'});
  }
  function hideError() {
    $scope.erroMessage = '';
    $('.error').css({visibility: 'hidden'});
  }

  function showLoginForm() {
    $('#login_form').css({visibility: 'visible'});
    $('.login_box').css({visibility : 'visible'});
  }
  function showSignupForm() {
    $('#signup_form').css({visibility: 'visible'});
    $('.signup_box').css({visibility : 'visible'});
  }
  function resetUserInfo() {
    $scope.authInfo = {org: 'purdue', name: '', email: '', password: ''};
  }

}])
.run(['$rootScope', '$state', 'auth', function ($rootScope, $state, auth) {
  $rootScope.$on('$stateChangeStart', function (event, toState) {
    if(toState.name === "home"){
      return;
    }
    if(!auth.isLoggedIn()){
      event.preventDefault();
      $state.go("home");
    }
  });
}]);
