(function () {

  /**
   * @type directive
   * @name wiserv-scroll
   * @param wiserv-scroll-offset
   * @description auto resize base on overflow-y
   */
  angular.module("app.common")
    .directive("wiservScroll", wiservScroll);

  wiservScroll.$inject = ["$window", "$document"];

  function wiservScroll($window, $document) {
    return {
      restrict: "ACE",
      scope: {
        offset: "@wiservScrollOffset"
      },
      link: function link(scope, element, attrs) {
        var _window = $($window);
        var _document = $($document);
        var _offset = $window.parseInt(scope.offset);

        format();

        _window.resize(function () {
          format();
        })

        function format() {
          // scroll
          element.css({
            "overflow-y": "scroll"
          });
          // size
          var contentHeight = _window.height() || 0;
          var navbarHeight = _document.find(".main-header").outerHeight() || 0;
          var boxheaderHeight = _document.find(".box-header").outerHeight() || 0;
          // calculate
          element.outerHeight((contentHeight - navbarHeight - boxheaderHeight) - _offset);
        }
      }
    };
  };

  /**
   * @type directive
   * @name slim-scroll
   * @param slim-scroll-offset slim-scroll-width slim-scroll-color slim-scroll-edge
   * @description auto resize base on slimscroll
   */
  angular.module("app.common")
    .directive("slimScroll", slimScroll);

  slimScroll.$inject = ["$window", "$document"];

  function slimScroll($window, $document) {
    return {
      restrict: "ACE",
      scope: {
        height: "@slimScrollOffset",
        size: "@slimScrollWidth",
        color: "@slimScrollColor",
        distance: "@slimScrollEdge"
      },
      link: function link(scope, element, attrs) {
        var _window = $($window);
        var _document = $($document);
        // property
        var _height = $window.parseInt(scope.height);
        var _size = scope.size ? (scope.size + "px") : ("6px");
        var _color = scope.color ? (scope.color + "") : ("red");
        var _distance = scope.distance ? (scope.distance + "px") : ("0px");

        format();

        _window.resize(function () {
          format();
        });

        function format() {
          // size
          var contentHeight = _window.height() || 0;
          var navbarHeight = _document.find(".main-header").outerHeight() || 0;
          var boxheaderHeight = _document.find(".box-header").outerHeight() || 0;
          // calculate
          element.slimScroll({
            height: ((contentHeight - navbarHeight - boxheaderHeight) - _height) + "px",
            color: _color,
            size: _size,
            distance: _distance,
            alwaysVisible: true
          });
        };

      }
    };
  };
})();