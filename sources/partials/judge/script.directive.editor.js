(function () {

  angular.module('app.judge')
    .directive('wiservEdit', wiservEdit);
  wiservEdit.$inject = ["$sce"];

  function wiservEdit($sce) {
    return {
      restrict: 'ACE',
      require: '?ngModel',
      priority: 1,
      link: link
    }

    function link(scope, element, attrs, ngModel) {
      if (!ngModel) return;
      // Add attribute "contenteditable = true"
      element.attr({
        contenteditable: "true"
      });
      // Specify how UI should be updated
      ngModel.$render = function () {
        element.html($sce.getTrustedHtml(ngModel.$viewValue));
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function () {
        scope.$evalAsync(read);
      });
      element.ready(function(){
        scope.$evalAsync(read);
      });
      // // element.ready(function () {
      // //     scope.$evalAsync(read);
      // // });
      // read();
      // //
      function read() {
        var html = element.html();
        if (html) {
          ngModel.$setViewValue(html);
        }
      };
    }
  };

})();