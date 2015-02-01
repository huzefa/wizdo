'use strict';

/**
 * @ngdoc overview
 * @name wizdoFrontendApp
 * @description
 * # wizdoFrontendApp
 *
 * Main module of the application.
 */
 var app = angular.module('wizdoFrontendApp', 
  [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ]);

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }
      })
      .when('/ask', {
        templateUrl: 'views/ask.html',
        controller: 'AskCtrl'
      })
      .when('/answer', {
        templateUrl: 'views/answer.html',
        controller: 'AnswerCtrl'
      })
      .when('/askhist', {
        templateUrl: 'views/askhistory.html',
        controller: 'AskHistCtrl'
      })
      .when('/answerhist', {
        templateUrl: 'views/answerhistory.html',
        controller: 'AnswerHistCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .otherwise({
        redirectTo: '/welcome'
      });
  });

app.run(["$rootScope", "$location", function ($rootScope, $location) {

    $rootScope.$on("$routeChangeSuccess", function (userInfo) {
        console.log(userInfo);
    });

    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            $location.path("/login");
        }
    });
}]);

app.factory("authenticationSvc", ["$http","$q","$window",function ($http, $q, $window) {
    var userInfo;

    function login(username, password) {
        var deferred = $q.defer();

        $http.post("http://104.236.223.210:3000/login", { username: username, password: password })
         success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("HELL YEA");
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
            // .then(function (result) {
            //     userInfo = {
            //         accessToken: result.data.access_token,
            //         username: result.data.username
            //     };
            //     $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
            //     deferred.resolve(userInfo);
            // }, function (error) {
            //     deferred.reject(error);
            // });

        return deferred.promise;
    }

    function logout() {
        var deferred = $q.defer();

        $http({
            method: "POST",
            url: "/api/logout",
            headers: {
                "access_token": userInfo.accessToken
            }
        }).then(function (result) {
            userInfo = null;
            $window.sessionStorage["userInfo"] = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function getUserInfo() {
        return userInfo;
    }

    function init() {
        if ($window.sessionStorage["userInfo"]) {
            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        }
    }
    init();

    return {
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
}]);