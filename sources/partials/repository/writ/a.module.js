(function(){
/* module */
    angular.module("app.repository.writ", ["app.repository.writ.profile"]);

/* router */
    angular.module("app.repository.writ")
    .config(writeRouter);

    writeRouter.$inject = ["$stateProvider"];

    function writeRouter($stateProvider){
      $stateProvider
      .state("profile", {
        parent: "repository",
        url: "law/writ/profile/:court_place/:court_level/:case_brief/:doc_type/:keyword/:judge_date_start/:judge_date_end",
        templateUrl: "partials/repository/writ/profile/view.html",
        controller: "WritProfileController",
        controllerAs: "WritProfile",
      })
    }

})();