(function () {
    /* module */
    angular.module("app.repository.profile.details", []);

    /* controller */
    angular
      .module("app.repository.profile.details")
      .controller("DetailsController", DetailsController);

    DetailsController.$inject = ["$scope", "$state", "detailsService", "$stateParams"];

    function DetailsController($scope, $state, detailsService, $stateParams) {
      var vm = this;

      var getByRowkey = function () {
        console.log($stateParams.row_key);
        detailsService.getByRowkey({
          row_key: $stateParams.row_key
        }).then(function (results) {
          results.data.body[0].ori_text = results.data.body[0].ori_text.replace(/\n/g, "<br/>");
          vm.data = results.data.body[0];
          console.log(results)
        })
      }
      vm.prev = function () {
        history.go(-1)
      }

      activate();

      function activate() {
        getByRowkey();
      };
    };

    /* service */
    angular
      .module("app.repository.profile.details")
      .service("detailsService", detailsService);

    detailsService.$inject = ["$http", "URL"];

    function detailsService($http, URL) {
      var path = URL.master;
      var service = {
        getByRowkey: getByRowkey
      };
      return service;

      function getByRowkey(params) {
        return $http({
          method: "GET",
          url: path + '/legal/find',
          params: params
        }).catch(function (error) {
          console.info(error)
        })
      };
    }
    })();