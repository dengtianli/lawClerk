(function () {

  angular.module("app.common")
    .directive("wiservSubmenuEnable", wiservSubmenuEnable);

  wiservSubmenuEnable.$inject = [];

  function wiservSubmenuEnable() {
    return {
      restrict: 'ACE',
      link: function link(scope, element, attrs) {
        $('[data-submenu]').submenupicker();
      }
    };
  };

})();