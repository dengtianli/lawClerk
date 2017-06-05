(function(){
  angular
    .module("app.repository.writ")
    .service("writService", writService);

  writService.$inject = ["$http", "URL"];

  function writService($http, URL) {
    var path = URL.master;
    var service = {
      getByCondition: getByCondition
    };
    return service;

    function getByCondition(data) {
      return $http({
        method:"POST",
        url: path + '/verdict/search/by/category',
        data:data
      })
      .catch(function(error){
        console.info(error);
      })
    };
  };

})();