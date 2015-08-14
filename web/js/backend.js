/**
 * Created by user on 2015/8/5.
 */
var backendApp = angular.module("backendApp", ["pascalprecht.translate", "ui.bootstrap", "smart-table", "ngRoute", "requestFactory", "localeFactory"]);
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

backendApp.directive("tableCheckbox", TableCheckbox);

backendApp.directive("rowCheckbox", RowCheckbox);
// Common directive for Focus
backendApp.directive('focus',Focus);
backendApp.directive('datePickerOpen',DatePickerOpen);
//backendApp.directive('dateLowerThan',DateLowerThan);
//backendApp.directive('dateGreaterThan', DateGreaterThan);

backendApp.controller("BackendController", BackendController);
function BackendController($scope, $translate, $location, HostUrl, request, locale, datepickerPopupConfig) {
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
        url: "/permission/select"
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
        // TRANSLATION
        datepickerPopupConfig.currentText = $translate.instant("datePicker.currentText");
        datepickerPopupConfig.clearText = $translate.instant("datePicker.clearText");
        datepickerPopupConfig.closeText = $translate.instant("datePicker.closeText");
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

