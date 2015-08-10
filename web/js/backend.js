/**
 * Created by user on 2015/8/5.
 */
var backendApp = angular.module("backendApp", ["pascalprecht.translate", "ui.bootstrap", "smart-table", "ui.grid", "ui.grid.selection", "ui.grid.edit", "ngRoute", "requestFactory", "localeFactory"]);
backendApp.constant("HostUrl", "http://localhost:8080/Backend");
backendApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.
        when("/A1", {
            templateUrl: "permissionManage/permission/Permission.html"
        }).
        when("/A2", {
            templateUrl: "permissionManage/role/Role.html"
        }).
        when("/B2", {
            templateUrl: "goodsManage/holiday/Holiday.html"
        }).
        when("/C1", {
            templateUrl: "userManage/user/User.html"
        }).
        otherwise({redirectTo: '/'})
}]);
backendApp.config(function ($translateProvider, $translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('main');
    $translatePartialLoaderProvider.addPart('common');
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'i18n/{part}/{lang}.json'
    });
    $translateProvider.preferredLanguage("zh-TW");
});

backendApp.directive("tableCheckbox", function () {
    return {
        scope: {
            selectedItems: '='
        },
        controller: function ($scope, $compile) {
            //console.log("tableCheckbox controller");
            //console.log($scope);
            var ctrl = this;
            this.itemSelect = function (item,selected) {
                if(selected){
                    if(!ctrl.itemHasBeenSelected(item)){
                        $scope.selectedItems.push(item);
                    }
                } else {
                    var index = $scope.selectedItems.indexOf(item);
                    $scope.selectedItems.splice(index,1);
                }
            };
            this.itemHasBeenSelected = function (item) {
                return ($scope.selectedItems.indexOf(item)!=-1);
            }
        }
    }
});

backendApp.directive("rowCheckbox", function () {
    return {
        template: "<input ng-model='selected' type='checkbox'/>",
        require: "^tableCheckbox",
        scope: {
            row:"=",
            index:"="
        },
        link: function (scope, element, attr, tableCheckboxCtrl) {
            scope.selected = false;
            if(tableCheckboxCtrl.itemHasBeenSelected(scope.row)){
                scope.selected = true;
            }
            element.on('change', function (event) {
                tableCheckboxCtrl.itemSelect(scope.row,scope.selected);
            });
        }
    }
});
backendApp.controller("BackendController", BackendController);
function BackendController($scope, $translate, $location, HostUrl, request, locale) {
    console.log("BackendController!!");
    request.changeHostUrl(HostUrl);
    locale.changeLang(locale.zh_TW);
    $scope.menuTreeSetting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                $scope.$apply(function () {
                    $location.path("/" + treeNode.permission_code);
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

    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
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

