(function(){
/* module */
  angular.module("app.repository.law", ['app.repository.law.lawLibrary', "app.repository.extend", "app.judge","app.repository"]);

/* router */

  angular
    .module('app.repository.law')
    .config(lawRouter);

    lawRouter.$inject = ["$stateProvider"];

    function lawRouter($stateProvider){
      $stateProvider
      .state("extend", {
        parent: "repository",
        url: "/law/extend/:keyword/:type",
        templateUrl: "partials/repository/extend/view.html",
        controller: "ExtendController",
        controllerAs: "Extend",
      })
      .state("lawLibrary", {
        parent: "repository",
        url: "/law/lawLibrary/:total",
        templateUrl: "partials/repository/lawLibrary/view.html",
        controller: "LawLibraryController",
        controllerAs: "lawLibrary",
      })
      .state("cause", {
        parent: "repository",
        url: "/law/cause/:total",
        templateUrl: "partials/repository/cause/view.html",
        controller: "CauseController",
        controllerAs: "Cause",
      })
      .state("writ", {
        parent: "repository",
        url:"law/writ/:total",
        templateUrl: "partials/repository/writ/view.html",
        controller: "WritController",
        controllerAs: "Writ"
      });
    }
})();