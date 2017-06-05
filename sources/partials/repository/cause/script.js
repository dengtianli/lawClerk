(function () {
  /* module */
  angular.module("app.repository.cause", ["app.repository.cause.content"]);

  /*router */
   angular
    .module('app.repository.cause')
    .config(causeRouter);

    causeRouter.$inject = ["$stateProvider"];

    function causeRouter($stateProvider){
      $stateProvider
      .state("cause.content", {
        parent: "repository",
        url: "/law/cause/content/:sort/:case_part/:case_district/:case_cause",
        templateUrl: "partials/repository/cause/content/view.html",
        controller: "CauseResultController",
        controllerAs: "CauseResult",
      })
    }

  /* controller */
  angular
    .module("app.repository.cause")
    .controller("CauseController", CauseController);

  CauseController.$inject = ["$scope", "$state", "causeService", "$stateParams"];

  function CauseController($scope, $state, causeService, $stateParams) {
    var vm = this;   
    
    vm.total = $stateParams.total
    // //level_1 change
    // vm.levelChange = levelChange

    vm.inquire = function(valid){
      if(vm.keyword && valid){
         $state.go("extend",{
          type: 'cause',
          keyword: vm.keyword
        });
      }else{
        layer.msg('请正确输入您要查询的关键字')
      }
    }
    vm.prev = function(){
      $state.go("repository.law");
    }
    vm.search = function(){
      $(".box").css({"display":"block"});
      $(".tips").css({"display":"none"});
      $(".summary").css({"display":"none"})
    }
    vm.cancel = function(part){
      $(".box").css({"display":"none"});
      $(".tips").css({"display":"block"});
      $(".summary").css({"display":"flex"})
      console.log($scope.level_2_part)
      $state.go("cause.content",{
        case_part: $scope.level_1_part,
        case_district: $scope.level_2_part,
        case_cause: $scope.level_3_part
      })
    }

    vm.levelChange = function(part) {
      causeService.findByParent({
        case_brief: part,
        type: "level_2"
      }).then(function(results){
        vm.level_2 = results.data.body;
        $scope.level_2_part = results.data.body[0].case_district;
        vm.levelChildChange($scope.level_2_part);
      })
    }
    vm.levelChildChange = function(part) {
      causeService.findByParent({
        case_brief: part,
        type: "level_3"
      }).then(function(results){
        vm.level_3 = results.data.body;
        $scope.level_3_part = results.data.body[0].case_cause;
      })
    }

    var findByParent = function(){
      causeService.findByParent({
        case_brief:'民事案由',
        type: 'level_1'
      }).then(function(results){
        vm.level_1 = results.data.body;
        $scope.level_1_part = results.data.body[0].case_part;
        vm.levelChange($scope.level_1_part);
      })
    }
    activate();
    function activate() {
      findByParent();
    };
  };

  /* service */
  angular
    .module("app.repository.cause")
    .service("causeService", causeService);

  causeService.$inject = ["$http", "URL"];

  function causeService($http, URL) {
    var path = URL.master
    var service = {
      findByParent: findByParent
    };
    return service;

    function findByParent(params){   
      // return $http.get(
      //   path + '/case_brief/find/byParent',{
      //     params: params
      //   }  
      // )
    return $http({
            method: "GET",
            url: path + "/case_brief/find/byParent",
            params: params
          })
          .catch(function (error) {
            console.info(error);
          })   
    }
  };

})();