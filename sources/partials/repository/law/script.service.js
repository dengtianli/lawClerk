(function () {
  /* service */
  angular
    .module("app.repository.law")
    .service("lawService", lawService);

  lawService.$inject = ["$http", "URL"];

  function lawService($http, URL) {
    var path = URL.master;
    var service = {
      filterBy: filterBy,
      searchAll: searchAll,
      getToday: getToday
    };
    return service;

    function filterBy(params) {
      return $http({
          method: "GET",
          url: path + '/keyword/auto/fill',
          params: params
        })
        .catch(function (error) {
          console.info(error);
        })

    };

    function searchAll(params) {
      return $http({
          method: "GET",
          url: path + '/kb/search/all',
          params: params
        })
        .catch(function (error) {
          console.info(error);
        })
    };

    function getToday(params) {
      return $http({
          method: "GET",
          url: path + '/kb/search/add_today',
          params: params
        })
        .catch(function (error) {
          console.info(error);
        })
    };

  };

})();