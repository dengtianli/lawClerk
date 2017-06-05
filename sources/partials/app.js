"use strict";

(function () {

  angular.module("app", [
      // library
      "ngAnimate",
      "ngSanitize",
      "ui.router",
      "ui.bootstrap",
      "treeControl",
      "xeditable",
      "angularFileUpload",
      "ui.select",
      // artifact
      "app.common",
      "app.login",
      "app.layout",
      "app.cases",
      "app.judge",
      "app.template",
      "app.template.helper",
      "app.template.judged",
      "app.repository",
      "app.repository.cause",
      "app.repository.law",
      "app.repository.writ",
      "app.trial",
      "app.record"
    ])
    .config(config)
    .run(run)

  config.$inject = ["$qProvider", "$stateProvider", "$urlRouterProvider", "$httpProvider"];

  function config($qProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $urlRouterProvider.otherwise("/login");
    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "partials/login/view.html",
        controller: "LoginController",
        controllerAs: "Login"
      })
      .state("layout", {
        url: "/layout",
        templateUrl: "partials/layout/view.html",
        controller: "LayoutController",
        controllerAs: "Layout"
      })

    /** HTTP Interceptor */
    $httpProvider.interceptors.push(interceptor);
    interceptor.$inject = ["$q", "$location"];

    function interceptor($q, $location) {
      return {
        "request": function (config) {
          var token = sessionStorage.token;
          if (token) {
            config.headers = _.assign({}, {
              "Authorization": "Wiserv " + token
            }, config.headers)
          };
          return config;
        },
        "response": function (response) {
          $q.when(response, function (result) {
            if (response.data && response.data.head && typeof response.data === "object") {
              if (result.data.head.status === 202) {
                sessionStorage.message = "登录超时，请重新登录！";
                $location.url("/wiserv");
              };
            };
          });
          return response;
        }
      };
    };

  };

  run.$inject = ["$rootScope", "editableOptions"];

  function run($rootScope, editableOptions) {
    // Xeditable config
    editableOptions.theme = "bs3";
    // router listener
    $rootScope.$on("$stateChangeStart",
      function (event, toState, toParams, fromState, fromParams) {
        if (toState.name !== "login") {
          if (!sessionStorage.token) {
            window.location.href = "/wiserv";
          };
        };
      });
  }

})();