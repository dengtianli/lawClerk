(function () {
  /* module */
  angular
    .module("app.template", [])

  /* router */
  angular
    .module("app.template")
    .config(templateConfig);

  templateConfig.$inject = ["$stateProvider"];

  function templateConfig($stateProvider) {
    $stateProvider
      .state("template", {
        parent: "layout",
        abstract: true,
        url: "/template",
        template: "<ui-view/>"  
      })
      .state("template.judged", {
        parent: "template",
        url: "/judged",
        templateUrl: "partials/template/judged/view.html",
        controller: "JudgedController",
        controllerAs: "Judged"
      })
      .state("template.helper", {
        parent: "template",
        url: "/helper",
        templateUrl: "partials/template/helper/view.html",
        controller: "HelperController",
        controllerAs: "Helper"
      });
  }

})();