(function () {
  angular
    .module("app.trial")
    .controller("TrialPreviewController", TrialPreviewController);

  TrialPreviewController.$inject = [
    "$sce",
    "$scope",
    "$window",
    "$stateParams",
    "$state",
    "serviceTrial",
    "serviceCreateTrial"
  ];

  function TrialPreviewController(
    $sce,
    $scope,
    $window,
    $stateParams,
    $state,
    serviceTrial,
    serviceCreateTrial
  ) {
    var vm = this;

    /** Case */
    vm.case = $stateParams;

    /** Init */
    function activate() {
      vm.http.get()
    };
    
    /** Http */
    vm.http = {
      get: function(){
        serviceCreateTrial.get({
          record_id: $stateParams.record_id
        })
        .then(function(result){
          vm.allContent = result.body[0];
          var showContent = JSON.parse(result.body[0].record_content);
          var _array = [];
          console.log(result.body[0])
          dataConversion(showContent)
          function dataConversion(array) {
            array.forEach(function(item) {
              _array.push({
                id: item.id,
                value: item.content.replace(/\n/g, "<br/>")
              });
              if ('child' in item && item.child.length) {
                dataConversion(item.child);
              }
            });
            vm.info = _array;
            if(!$scope.$$phase){
               $scope.$digest();
            }
          }
        })
      }
    };

    vm.operation = {
      export: function () {
        var article = $(".preview").html().trim();
        $window.saveAs(htmlDocx.asBlob(article), "庭审笔录" + ".docx");
      },
      print: function () {
        $window.document.body.innerHTML = $(".preview").html();
        $window.print();
        $window.location.reload();
      },
    }
    activate();
  };
})();