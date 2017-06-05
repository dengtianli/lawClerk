(function () {
    angular.module("app.repository", [])
        .config(repositoryConfig);

    repositoryConfig.$inject = ["$stateProvider"];

    function repositoryConfig($stateProvider) {
        $stateProvider
            .state("repository", {
                parent: "layout",
                abstract: true,
                url: "/repository",
                template: "<ui-view/>"
            })
            .state("repository.cause", {
                parent: "repository",
                url: "/cause",
                templateUrl: "partials/repository/cause/view.html",
                controller: "CauseController",
                controllerAs: "Cause"
            })
            .state("repository.law", {
                parent: "repository",
                url: "/law",
                templateUrl: "partials/repository/law/view.html",
                controller: "LawController",
                controllerAs: "Law"
            })
            .state("repository.writ", {
                parent: "repository",
                url: "/writ",
                templateUrl: "partials/repository/writ/view.html",
                controller: "WritController",
                controllerAs: "Writ"
            });
    }

    angular
    .module("app.repository")
    .service("repositoryService", repositoryService);

    function repositoryService(){
        var type = '';
        var service = {
            setType:function(vv){
               switch(vv){
                case 'law' :
                    type = '1';
                    break;
                case 'cause' :
                    type = '2';
                    break;
                case 'writ' :
                    type = '3';
                    break;
                default:
                    type = '4';
                    break;
               } 
            },
            getType:function(){
                return type;
            }
        }
        return service;
    }
})();