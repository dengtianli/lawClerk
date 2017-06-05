  (function () {
    angular
      .module("app.judge")
      .factory("serviceOperation", serviceOperation);

    serviceOperation.$inject = ["$http", "URL"];

    function serviceOperation($http, URL) {
      var path = URL.ai;
      return {
        getSimilarCase: function (data) {
          return $http({
            method: "POST",
            url: path + "/similar",
            data: data
          }).then(function (result) {
            return result.data;
          });
        },
        getlaws: function (data) {
          return $http({
            method: "POST",
            url: path + "/laws",
            data: data
          }).then(function (result) {
            return result.data;
          });
        },
        getCorrection: function(data){
          return $http({
            method: "POST",
            url: path + "/revise",
            data: data
          }).then(function (result) {
            return result.data;
          });
        }

      };
    };
  })();