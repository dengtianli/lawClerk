(function () {
  angular
    .module("app.judge")
    .factory("serviceMaterial", serviceMaterial);

  serviceMaterial.$inject = ["$http", "URL", "FileUploader"];

  function serviceMaterial($http, URL, FileUploader) {
    var path = URL.master;
    var ocrPath = URL.ocr;
    return {
      downloader: function (params) {
        return $http({
          method: "GET",
          url: path + "/legal_case/uploadCaseFiles",
          params: params
        }).then(function (result) {
          return result.data;
        });
      },
      deletePicture: function (data) {
        return $http({
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          url: path + "/legal_case/uploadCaseFiles",
          data: data
        }).then(function (result) {
          return result.data;
        });
      },
      ocr: function (data) {
        return $http({
          method: "POST",
          url: ocrPath + "/api/ocr_rec_url",
          data: data
        }).then(function (result) {
          return result.data;
        });
      },
      uploader: new FileUploader({
        url: path + "/legal_case/uploadCaseFiles",
        method: "POST",
        withCredentials: true,
        formData: [{
          case_no: "$stateParams.case_no"
        }],
        queueLimit: 100,
        onSuccessItem: function (item, response, status, headers) {
          vm.material.image = response.body[0].url;
          console.log(response.body[0].url);
          console.log(vm.material.image)
          layer.msg(response.head.message);
        }
      }),
    };
  };
})();