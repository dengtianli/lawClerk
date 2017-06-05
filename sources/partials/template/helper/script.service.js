(function () {

  angular
    .module("app.template.helper")
    .service("helperService", helperService);

  helperService.$inject = ["$http", "URL"];

  function helperService($http, URL) {
    var path = URL.master;
    var service = {
      getTree: getTree,
      getTreeInfo: getTreeInfo,
      saveTreeInfo: saveTreeInfo,
      getResultTree: getResultTree,
      getResultTreeInfo: getResultTreeInfo,
      saveResultTreeInfo:saveResultTreeInfo
    };
    return service;

    function getTree(params) {
      return $http({
        method: "GET",
        url: path + "/conditon/tree",
        params: params
      }).then(function (result) {
        return result.data;
      });
    };

    function getTreeInfo(params) {
      return $http({
        method: "GET",
        url: path + "/conditon/tree/info",
        params: params
      }).then(function (result) {
        return result.data;
      });
    };

    function saveTreeInfo(data) {
      return $http({
        method: "POST",
        url: path + "/conditon/tree/info",
        data: data
      }).then(function (result) {
        return  result.data;
      });
    };
    function getResultTree(params) {
      return $http({
        method: "GET",
        url: path + "/case/main",
        params: params
      }).then(function (result) {
        return result.data;
      });
    };

    function getResultTreeInfo(params) {
      return $http({
        method: "GET",
        url: path + "/case/main/info",
        params: params
      }).then(function (result) {
        return result.data;
      });
    }
     function saveResultTreeInfo(data) {
      return $http({
        method: "POST",
        url: path + "/case/main/info",
        data: data
      }).then(function (result) {
        return result.data;
      });
    }

  };

})();