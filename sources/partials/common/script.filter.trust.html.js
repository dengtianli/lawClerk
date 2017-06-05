(function () {

  angular.module("app.common")
    .filter("wiservTrustHtml", wiservTrustHtml);

  wiservTrustHtml.$inject = ["$sce"];

  function wiservTrustHtml($sce) {
    return function (val) {
      return $sce.trustAsHtml(val);
    };
  };

})();