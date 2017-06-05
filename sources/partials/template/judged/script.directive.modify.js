(function () {

  angular.module('app.template.judged')
    .directive('wiservModify', wiservModify);

  function wiservModify() {
    return {
      restrict: 'ACE',
      require: '?ngModel',
      priority: 1,
      link: link
    }

    function link(scope, element, attrs, ngModel) {
      if (!ngModel) return;
      //
      element.attr({
        contenteditable: "true"
      });
      ngModel.$render = function () {
        element.html(ngModel.$viewValue || '');
      };
      // element.on('focus', function () {
      //   if (element.text() == attrs.placeholder) {
      //     element.html("");
      //   }
      // });
      //
      element.on('blur change', function () {
        scope.$evalAsync(read);
      });
      read();
      //
      function read() {
        var html = element.html();
        ngModel.$setViewValue(html);
      };
    }
  };

})();