/**
 * Created by user on 2015/8/5.
 */
var backendApp = angular.module("backendApp", ["pascalprecht.translate","ui.bootstrap","ui.grid","ngRoute","requestFactory","localeFactory"]);
backendApp.constant("HostUrl","http://localhost:8080/Backend");
backendApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.
        when("/A1",{
            templateUrl:"permissionManage/permission/Permission.html"
        }).
        when("/A2",{
            templateUrl:"permissionManage/role/Role.html"
        }).
        when("/C1",{
            templateUrl:"userManage/user/User.html"
        }).
        otherwise({redirectTo: '/'})
}]);
backendApp.config(function ($translateProvider,$translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('main');
    $translatePartialLoaderProvider.addPart('common');
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'i18n/{part}/{lang}.json'
    });
    $translateProvider.preferredLanguage("zh-TW");
});
backendApp.controller("BackendController", BackendController);
function BackendController($scope,$translate,$location,HostUrl,request,locale){
    console.log("BackendController!!");
    request.changeHostUrl(HostUrl);
    locale.changeLang(locale.zh_TW);
    $scope.menuTreeSetting= {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                $scope.$apply(function () {
                    $location.path("/"+treeNode.permission_code);
                });
            }
        }
    };

    request.http({
        method: "GET",
        url: "/permission/query/list"
    }).success(function (data, status, headers, config) {
        $scope.menuList = data;
        //console.log($scope.menuList);
        locale.formatPermissionList($scope.menuList);
        $scope.initMenuTree();
    });

    $scope.initMenuTree = function () {
        $scope.menuTree = $("#menuTree");
        $.fn.zTree.init($scope.menuTree, $scope.menuTreeSetting, $scope.menuList);
        $scope.menuZTreeObj = $.fn.zTree.getZTreeObj("menuTree");
        $scope.menuZTreeObj.expandAll(true);
    };


}

var Action = {
    NewNode: "newNode",
    NewChildNode: "newChildNode",
    MoveUp: "moveUp",
    MoveDown: "moveDown",
    MoveFirst: "moveFirst",
    MoveLast: "moveLast",
    Add: "add",
    Edit: "edit",
    Remove: "remove"
};

