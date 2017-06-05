(function () {
  angular
    .module("app.record")
    .service("recordService", recordService);

  recordService.$inject = ["$http", "URL", "$httpParamSerializerJQLike"];


  function recordService($http, URL, $httpParamSerializerJQLike) {
    var path = URL.master;
    var data;
    var service = {
      TreeList: {
        get: function (params) {
          // return $http.get(           
          //   path + "/trial_record/tree?write_type=section"
          // )
          return $http({
            method: "GET",
            url: path + "/trial_record/tree?write_type=section",
            params: params
          })
          .catch(function (error) {
            console.info(error);
          })
        }
      },
      recordList: {
        get: function (params) {
          return $http({
            method: "GET",
            url: path + "/trial_record/list",
            params: params
          })
          .catch(function (error) {
            console.info(error);
          })
        }
      },
      recordStore: {
        save: function (data) {
          return $http({
              url: path + "/trial_record/store",
              method: "POST",
              data: data
            })
            .catch(function (error) {
              console.info(error);
            })
        }
      },
      deleteRecord: {
        delete: function(data) {
          return $http({
            url: path + "/trial_record/delete",
            method: "POST",
            data: data
          }).then(function(result){
            return result.data
          })
          .catch(function(error) {
            console.info(error);
          })
        }
      },
      getElements: {
        get: function (params) {
          return $http({
            method: "GET",
            url: path + "/trial_record/elements/name",
            params: params
          })
          .catch(function (error) {
            console.info(error);
          })
        }
      },
      getElementsById: {
        get: function (params) {
          return $http({
            method: "GET",
            url: path + "/trial_record/elements/info",
            params: params
          })
          .catch(function (error) {
            console.info(error);
          })
        }
      },
      setRecordData:function(obj){
          data = angular.copy(obj.body);
      },
      getRecordData:function(id){
        for(var i = 0,len = data.length; i < len; i++){
          if(data[i].record_id === id){
            return data[i];
          }
        }
      }
    };
    return service;
  };
})();