(function() {
  angular.module('app.trial')
    .filter('replaceTrim', replaceTrim);

    function replaceTrim(){
      return function(text){
      return text.replace(/\s/g,'');
      }
    }

    return replaceTrim;

})();
