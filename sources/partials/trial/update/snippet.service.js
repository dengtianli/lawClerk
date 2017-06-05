(function () {
  angular
    .module("app.trial")
    .factory("trialUpdateService", trialUpdateService);

  trialUpdateService.$inject = ["$http", "URL"];

  function trialUpdateService($http, URL) {
    var path = URL.master;
    return {
      update: function (data) {
        return $http({
          url: path + "/trial_record/update",
          method: "POST",
          data: data
        }).then(function (result) {
          return result.data;
        });
      },
      query: function (params) {
        return $http({
            url: path + "/trial_record/search",
            method: "GET",
            params: params
          })
          .then(function (result) {
            return result.data;
          });
      },
    }
  };
})();