(function () {

  angular
    .module("app.login")
    .service("loginService", loginService);

  loginService.$inject = ["$http", "URL"];

  function loginService($http, URL) {
    var service = {
      auth: auth
    };
    return service;

    function auth(data) {
      var path = URL.master;
      return $http.post(
          path + '/login', data
        )
        .catch(function (error) {
          console.info(error);
        })
    };
  };

})();