(function () {
  angular
    .module("app.judge")
    .factory("serviceTemplate", serviceTemplate);

  serviceTemplate.$inject = ["$http", "URL"];

  function serviceTemplate($http, URL) {
    var path = URL.master;
    return {
      getTemplate: function (params) {
        return $http({
          method: "GET",
          url: path + "/verdict/template",
          params: params
        }).then(function (result) {
          return result.data;
        });
      },
      getUpdatedTemplate: function (params) {
        return $http({
          method: "GET",
          url: path + "/verdict/writ",
          params: params
        }).then(function (result) {
          return result.data;
        });
      },
      updateArticle: function (data) {
        return $http({
          method: "PUT",
          url: path + "/verdict/writ",
          data: data
        }).then(function (result) {
          return result.data;
        });
      },
      saveArticle: function (data) {
        return $http({
          method: "POST",
          url: path + "/verdict/writ",
          data: data
        })
      },
      serialNumber: function (number) {
        return [
          "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九", "三十", "三十一", "三十二"
        ][number - 1];
      }
    };
  };

})();