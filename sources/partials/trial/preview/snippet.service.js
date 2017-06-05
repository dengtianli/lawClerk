(function () {
  angular
    .module("app.trial")
    .factory("serviceCreateTrial", serviceCreateTrial);

  serviceCreateTrial.$inject = ["$http", "URL"];

  function serviceCreateTrial($http, URL) {
    var path = URL.master;
    return {
      get: function (params) {
        return $http.get(path + "/trial_record/search", {
          params: params
        }).then(function (result) {
          return result.data;
        });
      }
    }
  };
})();