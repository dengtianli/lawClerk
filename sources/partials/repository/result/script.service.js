(function () {
  angular
    .module("app.repository.law.result")
    .service("resultService", resultService);

  resultService.$inject = ["$http", "URL"];

  function resultService($http, URL) {
    var path = URL.master;
    var service = {
      findByAccurate: findByAccurate
    };
    return service;

    function findByAccurate(params) {
      return $http({
        method: "GET",
        url: path + '/law/find/findAccurate',
        params: params
      }).catch(function (error) {
        console.info(error)
      })
    };
  };
})();