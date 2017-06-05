(function () {
  angular
    .module("app.judge")
    .factory("serviceTreeReason", serviceTreeReason);

  serviceTreeReason.$inject = ["$http", "URL"];

  function serviceTreeReason($http, URL) {
    var path = URL.master;
    return {
      getTree: function (target) {
        return $http.get(
          path + "/conditon/tree"
        ).then(function (result) {
          return result.data;
        });
      },
      getTreeInfo: function (params) {
        return $http.get(
          path + "/conditon/tree/info", {
            params: params
          }
        ).then(function (result) {
          return result.data;
        });
      },
      match: function (params) {
        return $http.get(
          path + "/conditon/tree/info", {
            params: params
          }
        ).then(function (result) {
          return result.data;
        });
      },
      update: function (data) {
        return $http.put(
          path + "/conditon/tree/info", data
        ).then(function (result) {
          return result.data;
        });
      }
    };
  };
})();