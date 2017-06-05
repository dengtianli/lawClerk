
  angular
    .module("app.repository.writ.profile")
    .service("writProfileService", writProfileService);

  writProfileService.$inject = ["$http", "URL"];

  function writProfileService($http, URL) {
    var path = URL.master;
    var service = {
      getByCategory: getByCategory
    };
    return service;

    function getByCategory(data) {
      return $http({
        method:"POST",
        url:path +'/verdict/search/by/category',
        data:data
      }).catch(function(error){
       console.info(error)
      })
    };

  };