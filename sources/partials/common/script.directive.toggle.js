(function () {

  /**
   * @module common.toggle
   * @type directive
   * @name   wiser-toggle
   * @param offset
   * @description auto resize base on scroll
   */
  angular.module("app.common")
    .directive("wiservToggle", wiservToggle);

  wiservToggle.$inject = ["$window", "$document"];

  function wiservToggle($window, $document) {
    return {
      restrict: "ACE",
      scope: {
        selector: "@wiservToggleSelector"
      },
      link: function link(scope, element, attrs) {
        var _window = $($window);
        var _document = $($document);
        var _selector = scope.selector.toString();
        element.click(function () {
          _document.find(_selector).toggle({
            "display": "none",
          });
        })
      }
    };
  };

})();