/**
 * Created by user on 2015/8/5.
 */
var backendApp = angular.module("backendApp", ["pascalprecht.translate", "ui.bootstrap", "smart-table", "ngRoute", "ngResource", "restangular", "requestFactory", "localeFactory"]);
//backendApp.factory('PermissionService', ['$resource', function ($resource) {
//    return $resource('api/permission/:permissionId',
//        {},
//        {
//            deletePermission: {method: 'POST', url: 'api/permission/delete'},
//            move: {method: 'POST', url: 'api/permission/move', isArray: true}
//        }
//        //{charge: {method: 'POST'}, params: {charge: true}, isArray: false}
//    );
//}]);
backendApp.factory('SymbolTradableDailyTempService', ['$resource', function ($resource) {
    return $resource('api/symbolTradableDailyTemp/exchange/:exchange_id/mainSymbol/:main_symbol_id');
}]);
backendApp.factory('SymbolTradableDailyService', ['$resource', function ($resource) {
    return $resource('api/symbolTradableDaily/exchange/:exchange_id/mainSymbol/:main_symbol_id');
}]);

backendApp.constant("HostUrl", "http://localhost:8080/Backend/api");
backendApp.config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl("/Backend/api");
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
    RestangularProvider.setErrorInterceptor(function(resp) {
        //$log.info(resp);
        var status = resp.status;
        var errorJson = resp.data;
        console.log(resp);
        return true; // 停止promise链
    });
});

backendApp.factory('ExchangeService', function (Restangular) {
    return Restangular.service('exchange');
});

backendApp.factory('UserService', function (Restangular) {
    return Restangular.service('users');
});

backendApp.factory('LoginService', function (Restangular) {
    return Restangular.service('login');
});

backendApp.factory('RoleService', function (Restangular) {
    return Restangular.service('role');
});
backendApp.factory('OrganizationService', function (Restangular) {
    return Restangular.service('organization');
});

backendApp.factory('OrganizationMoveService', function (Restangular) {
    return Restangular.service('organization/move');
});


backendApp.factory('PermissionService', function (Restangular) {
    return Restangular.service('permission');
});

backendApp.factory('PermissionMoveService', function (Restangular) {
    return Restangular.service('permission/move');
});

backendApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.
        when("/Login", {
            templateUrl: "Login.html"
        }).
        when("/A1", {
            templateUrl: "permissionManage/permission/Permission.html"
        }).
        when("/A2", {
            templateUrl: "permissionManage/role/Role.html"
        }).
        when("/B2", {
            templateUrl: "goodsManage/holiday/Holiday.html"
        }).
        when("/B4", {
            templateUrl: "goodsManage/stock/DailyTemp.html"
        }).
        when("/B5", {
            templateUrl: "goodsManage/stock/Daily.html"
        }).
        when("/C1", {
            templateUrl: "userManage/user/User.html"
        }).
        when("/C2", {
            templateUrl: "userManage/organization/Organization.html"
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


backendApp.run(function ($rootScope, $translate, $log) {
    $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
        $rootScope.dateDisplayFormat = $translate.instant("format.display.date");
        $rootScope.dateInputFormat = $translate.instant("format.input.date");
        $translate.refresh();
    });
});
backendApp.filter("customFilter", ['$filter', function ($filter) {
    var filterFilter = $filter('filter');
    var standardComparator = function standardComparator(obj, text) {
        text = ('' + text).toLowerCase();
        return ('' + obj).toLowerCase().indexOf(text) > -1;
    };
    var startWithComparator = function (actual, expected) {
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;
    };
    var selectedComparator = function (actual, expected) {
        if (expected === 1) {//匹配有勾的
            return (actual === expected);
        } else {
            return true;//不匹配
        }
    };
    return function (array, expression) {
        //console.log(array);
        console.log(expression);
        function customComparator(actual, expected) {
            //console.log("actual=%s",actual);
            //console.log("expected=%s",expected);
            if (angular.isObject(expected)) {
                //console.log("expected=%s",expected.startWith);
                if (expected.startWith && expected.value != "") {
                    return startWithComparator(actual, expected.value);
                } else if (expected.selected) {
                    return selectedComparator(actual, expected.value);
                }
                return true;
            } else {
                return standardComparator(actual, expected);
            }
        }

        return filterFilter(array, expression, customComparator);
    }
}]);
backendApp.directive("tableSelectCheckbox", TableSelectCheckbox);
backendApp.directive("rowSelectCheckbox", RowSelectCheckbox);
backendApp.directive("headCheckbox", HeadCheckbox);
backendApp.directive("rowCheckbox", RowCheckbox);
backendApp.directive("rowReadonlyCheckbox", RowReadonlyCheckbox);
backendApp.directive("checkboxFilter", CheckboxFilter);
backendApp.directive("textStartWith", TextStartWith);
// Common directive for Focus
backendApp.directive('focus', Focus);
backendApp.directive('parseInt', ParseInt);
backendApp.directive('datePickerOpen', DatePickerOpen);
//backendApp.directive('dateLowerThan',DateLowerThan);
//backendApp.directive('dateGreaterThan', DateGreaterThan);

backendApp.controller("BackendController", BackendController);
function BackendController($scope, $translate, $location, $log, $modal, PermissionService, HostUrl, request, locale, datepickerPopupConfig) {
    $log.info("BackendController!!");
    request.changeHostUrl(HostUrl);
    locale.changeLang(locale.zh_TW);
    //$scope.dateFormat = $translate.instant("format.date");
    //$scope.dateFormat = "yyyy-MM-dd";
    //$log.info("dateFormat=%s",$scope.dateFormat);
    var tree = $("#menuTree");
    var zTreeObj;
    var treeSetting = {
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



    $scope.initMenuTree = function () {
        $.fn.zTree.init(tree, treeSetting, $scope.menuList);
        zTreeObj = $.fn.zTree.getZTreeObj("menuTree");
        zTreeObj.expandAll(true);
    };

    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
        // TRANSLATION
        datepickerPopupConfig.currentText = $translate.instant("datePicker.currentText");
        datepickerPopupConfig.clearText = $translate.instant("datePicker.clearText");
        datepickerPopupConfig.closeText = $translate.instant("datePicker.closeText");
    };

    $location.path("/Login");

    $scope.onLogin = function (user) {
        $location.path("/");
        $scope.loginUser = user;
        PermissionService.getList().then(function (data) {
            $scope.menuList = data;
            locale.formatPermissionList($scope.menuList);
            $scope.initMenuTree();
        });
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

