(function () {

  angular.module('app.cases')
    .directive('wiservProgram', wiservProgram);

  function wiservProgram() {
    return {
      restrict: 'ACE',
      require: '?ngModel',
      priority: 1,
      link: link
    }
    function link(scope, element, attrs, ngModel) {
      if (!ngModel) return;
      ngModel.$render = function () {
        element.html(ngModel.$viewValue || '');
      };
    }
  };

})();