(function () {

  /* service */
  angular
    .module("app.cases")
    .service("casesService", casesService);

  casesService.$inject = ["$http", "URL"];

  function casesService($http, URL) {
    var path = URL.master;
    return {
      cases: {
        get: function (params) {
          return $http({
              method: "GET",
              url: path + '/legal_case/list',
              params: params
            }).then(function (result) {
              return result.data
            })
            .catch(function (error) {
              console.info(error);
            })
        },
        add: function (data) {
          return $http({
              method: "POST",
              url: path + '/legal_case/store',
              data: data
            }).then(function (result) {
              return result.data
            })
            .catch(function (error) {
              console.info(error);
            })
        },
        update: function (data) {
          return $http({
              method: "POST",
              url: path + '/legal_case/update',
              data: data
            }).then(function (result) {
              return result.data
            })
            .catch(function (error) {
              console.info(error);
            })
        },
        delete: function (data) {
          return $http({
              method: "POST",
              url: path + '/legal_case/delete',
              data: data
            }).then(function (result) {
              return result.data
            })
            .catch(function (error) {
              console.info(error);
            })
        }

      },
      opinion: {
        get: function (params) {
          return $http({
              method: "GET",
              url: path + '/opinions/list',
              params: params
            }).then(function (result) {
              return result.data
            })
            .catch(function (error) {
              console.info(error);
            })
        },
        find: function (params) {
          return $http({
              method: "GET",
              url: path + '/opinions/find',
              params: params
            }).then(function (result) {
              return result.data
            })
            .catch(function (error) {
              console.info(error);
            })
        }
      },
      writer: {
        get: function (params) {
          return $http({
              method: "GET",
              url: path + '/verdict/writ',
              params: params
            }).then(function (result) {
              return result.data
            })
            .catch(function (error) {
              console.info(error);
            })
        },
      }
    };
  };

})();