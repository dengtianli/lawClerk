(function () {

  angular.module("app.trial")
    .directive("wiservTrialCompiler", wiservTrialCompiler);

  wiservTrialCompiler.$inject = ["$sce", "$compile", "serviceTrial"];

  function wiservTrialCompiler($sce, $compile, serviceTrial) {
    return {
      restrict: "ACE",
      link: function (scope, element, attrs) {
        scope.$watch(
          function (scope) {
            return scope.$eval(attrs.wiservTrialCompiler);
          },
          function (value) {
            element.html(value);
            $compile(element.contents())(scope);
          }
        );
      }
    };
  };

})();