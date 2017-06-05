(function () {

  angular
    .module("app.template.judged")
    .service("judgedService", judgedService);

  judgedService.$inject = ["$http","URL"];

  function judgedService($http,URL) {
    var path = URL.master;
    var service = {
      getTemplate: getTemplate,
      saveTemplate:saveTemplate
    };
    return service;
    function getTemplate(params) {
      return $http({
          method: "GET",
          url: path + "/verdict/custom/template",
          params: params
        }).then(function (result) {
          return result.data;
        });
    };
    function saveTemplate(data) {
      return $http({
          method: "POST",
          url: path + "/verdict/custom/template/store",
          data: data
        }).then(function (result) {
          return result.data;
        });
    };
  };

})();