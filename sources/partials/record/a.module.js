(function() {
  /* module */
  angular.module("app.record", ["app.judge","app.record.show"])
        .config(recordConfig);

  /* router */
  recordConfig.$inject = ["$stateProvider"];

  function recordConfig($stateProvider) {
    $stateProvider
      .state("record", {
        parent: "layout",
        url: "/record/:court_record_flag/:verdict_flag/:case_no/:case_brief/:court_name/:accuser/:accuser_baseinfo/:defendant/:defendant_baseinfo/:third_man/:third_man_baseinfo/:hearing_procedure/:accepted_date",
        templateUrl: "partials/record/view.html",
        controller: "RecordController",
        controllerAs: "Record",
      })
      .state("record.show",{
        parent: "record",
        url:"/show:list",
        templateUrl: "partials/record/show/view.html",
        controller: "ShowController",
        controllerAs: "Show"
      })
  }

})();