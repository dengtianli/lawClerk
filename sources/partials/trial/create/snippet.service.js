(function () {
  angular
    .module("app.trial")
    .factory("trialCreateService", trialCreateService);

  trialCreateService.$inject = ["$http", "URL"];

  function trialCreateService($http, URL) {
    var path = URL.master;
    return {
      create: function (data) {
        return $http({
          url: path + "/trial_record/store",
          method: "POST",
          data: data
        }).then(function (result) {
          return result.data;
        });
      },
    }
  };
})();