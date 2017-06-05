(function () {
  angular
    .module("app.layout")
    .directive("wiservCalculator", wiservCalculator);

  wiservCalculator.$inject = [];

  function wiservCalculator() {
    return {
      priority: 999,
      restrict: 'ACE',
      link: function link(scope, element, attrs) {
        element.calculator({
          theme: "material"
        });
      }
    };
  };
})();