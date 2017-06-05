(function () {
  angular.module("app.repository.writ.profile", ["app.repository.profile.details"]);

    /* router */
  angular.module('app.repository.writ.profile')
    .config(writResultRouter);

    writResultRouter.$inject = ["$stateProvider"];

    function writResultRouter($stateProvider){
      $stateProvider
      .state("details", {
        parent: "repository",
        url: "/law/writ/profile/details/:row_key",
        templateUrl: "partials/repository/writ/details/view.html",
        controller: "DetailsController",
        controllerAs: "Details"
      })
    }
})();