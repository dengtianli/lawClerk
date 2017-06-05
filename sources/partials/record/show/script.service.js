(function () {
  angular
    .module("app.record.show")
    .service("showService", showService);

  showService.$inject = ["$http", "URL"];

  function showService($http, URL) {
    var path = URL.testYangDong;
    var service = {
      recordList: {
        get: function () {
          return $http.get(
            path + "/trial_record/list"
          )
        }
      }
    };
    return service;
  };
})();