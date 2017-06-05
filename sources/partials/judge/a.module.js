(function () {
  angular.module("app.judge", [])
    .config(editorConfig);

  editorConfig.$inject = ["$stateProvider"];

  function editorConfig($stateProvider) {
    $stateProvider
      .state("judge", {
        parent: "layout",
        url: "/judge/:istemple/:operation/:title/:case_no/:category/:doc_type/:write_type/:hearing_procedure/:case_brief/:court_name/:accuser/:accuser_baseinfo/:defendant/:defendant_baseinfo/:third_man/:third_man_baseinfo/:accepted_date/:closure_flag/:creater",
        templateUrl: "partials/judge/view.html",
        controller: "JudgeController",
        controllerAs: "Judge",
      })
  }
  
})();