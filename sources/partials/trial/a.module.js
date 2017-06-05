(function () {
  /* module */
  angular.module("app.trial", [])
    .config(recordConfig);

  /* router */
  recordConfig.$inject = ["$stateProvider"];

  function recordConfig($stateProvider) {
    $stateProvider
      .state("trial", {
        parent: "layout",
        url: "/trial/:verdict_flag/:case_no/:case_brief/:court_name/:accuser/:accuser_baseinfo/:defendant/:defendant_baseinfo/:third_man/:third_man_baseinfo/:hearing_procedure/:accepted_date",
        templateUrl: "partials/trial/view.html",
        controller: "TrialController",
        controllerAs: "Trial"
      })
      .state("trial.create", {
        parent: "trial",
        url: "/create",
        templateUrl: "partials/trial/create/snippet.view.html",
        controller: "TrialCreateController",
        controllerAs: "TrialCreate"
      })
      .state("trial.update", {
        parent: "trial",
        url: "/update/:record_id",
        templateUrl: "partials/trial/update/snippet.view.html",
        controller: "TrialUpdateController",
        controllerAs: "TrialUpdate"
      })
      .state("trial.preview", {
        parent: "trial",
        url: "/preview/:record_id",
        templateUrl: "partials/trial/preview/snippet.view.html",
        controller: "TrialPreviewController",
        controllerAs: "TrialPreview"
      })
  }

})();