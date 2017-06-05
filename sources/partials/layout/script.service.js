(function () {
  angular
    .module("app.layout")
    .service("layoutService", layoutService);

  layoutService.$inject = ["$http","URL"];

  function layoutService($http, URL) {
    var path = URL.master;
    return {
      user: {
        updatePassword: function (data) {
          return $http({
              method: "POST",
              url: path + '/sys/account/password',
              data: data
            }).then(function (result) {
              return result.data
            })
            .catch(function (error) {
              console.info(error);
            })
        },
        loginout: function () {
           return $http({
              method: "POST",
              url: path + '/logout',
            }).then(function (result) {
              return result.data
            })
            .catch(function (error) {
              console.info(error);
            })
        },
        feedBack: function (data) {
          return $http({
              method: "POST",
              url: path + '/feedback/store',
              data: data
            }).then(function (result) {
              return result.data
            })
            .catch(function (error) {
              console.info(error);
            })
        }
      },
      writer:{
         searchWriter: function (params) {
          return $http({
              method: "GET",
              url: path + '/kb/search/find',
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