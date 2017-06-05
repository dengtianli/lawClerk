(function () {
  angular.module("app.cases", ["cgBusy"])
    .config(casesConfig);

  casesConfig.$inject = ["$stateProvider"];

  function casesConfig($stateProvider) {
    $stateProvider
      .state("cases", {
        parent: "layout",
        url: "/cases",
        templateUrl: "partials/cases/view.html",
        controller: "CasesController",
        controllerAs: "Cases",
      })
  }

})();