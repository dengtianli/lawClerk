(function () {
  angular
    .module("app.judge")
    .factory("serviceTreeResult", serviceTreeResult);

  serviceTreeResult.$inject = ["$http", "URL"];

  function serviceTreeResult($http, URL) {
    var path = URL.master;
    return {
      getTree: function (target) {
        return $http.get(
          path + "/case/main"
        ).then(function (result) {
          return result.data;
        });
      },
      getTreeInfo: function (params) {
        return $http.get(
          path + "/case/main/info", {
            params: params
          }
        ).then(function (result) {
          return result.data;
        });
      },
    };
  };
})();