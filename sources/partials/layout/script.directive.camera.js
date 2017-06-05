(function () {
  angular
    .module("app.layout")
    .directive("wiservCamera", wiservCamera);

  wiservCamera.$inject = [];

  function wiservCamera() {
    return {
      priority: 999,
      restrict: 'ACE',
      link: function link(scope, element, attrs) {
        element.photobooth().on("image",function( event, dataUrl ){
          $( ".target" ).html( '<img src="' + dataUrl + '" >');
        });
      }
    };
  };
})();