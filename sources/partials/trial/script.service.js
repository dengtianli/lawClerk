(function () {
  angular
    .module("app.trial")
    .factory("serviceTrial", serviceTrial);

  serviceTrial.$inject = ["$http", "URL"];

  function serviceTrial($http, URL) {
    var path = URL.master;
    return {
      getList: function (params) {
        return $http.get(path + "/trial_record/list", {
          params: params
        }).then(function (result) {
          return result.data;
        });
      },
      delete: function (data) {
        return $http({
            url: path + "/trial_record/delete",
            method: "POST",
            data: data
          })
          .then(function (result) {
            return result.data;
          });
      },
      getListByElement: function(params) {
        return $http.get(path + "/trial_record/elements/name", {
          params: params
        }).then(function (result) {
          return result.data;
        });
      },
      getElementsById: function(params) {
        return $http.get(path + "/trial_record/elements/info", {
          params: params
        }).then(function (result) {
          return result.data;
        });
      },
      get: function (params) {
        return $http.get(path + "/trial_record/search", {
          params: params
        }).then(function (result) {
          return result.data;
        });
      }
    };
  };
})();