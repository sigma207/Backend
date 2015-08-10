/**
 * Created by user on 2015/8/5.
 */
var backendApp = angular.module("backendApp", ["pascalprecht.translate","ui.bootstrap","smart-table","ui.grid","ui.grid.selection","ui.grid.edit","ngRoute","requestFactory","localeFactory"]);
backendApp.constant("HostUrl","http://localhost:8080/Backend");
backendApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.
        when("/A1",{
            templateUrl:"permissionManage/permission/Permission.html"
        }).
        when("/A2",{
            templateUrl:"permissionManage/role/Role.html"
        }).
        when("/B2",{
            templateUrl:"goodsManage/holiday/Holiday.html"
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
backendApp.directive("tableDate", function ($filter) {
    function parseDateString(dateString) {
        if (typeof(dateString) === 'undefined' || dateString === '') {
            return null;
        }
        var parts = dateString.split('/');
        if (parts.length !== 3) {
            return null;
        }
        var year = parseInt(parts[2], 10);
        var month = parseInt(parts[1], 10);
        var day = parseInt(parts[0], 10);

        if (month < 1 || year < 1 || day < 1) {
            return null;
        }
        return new Date(year, (month - 1), day);
    }
    function pad(s) { return (s < 10) ? '0' + s : s; }
    return {
        priority: -100, // run after default uiGridEditor directive
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            console.log("link");
            console.log(scope);
            scope.istableDate = false;

            scope.$on( 'uiGridEventBeginCellEdit', function () {
                console.log("uiGridEventBeginCellEdit");
                scope.istableDate = true;
            });

            element.on("click",function(){
                console.log("click");
                scope.istableDate = true;
            });

            element.bind( 'blur', function () {
                if(!scope.istableDate){
                    scope.$emit( 'uiGridEventEndCellEdit' );
                }else{
                    scope.istableDate =  false;
                }
            }); //when leaving the input element, emit the 'end cell edit' event

            if (ngModel) {
                ngModel.$formatters.push(function (modelValue) {
                    var modelValue= new Date(modelValue);
                    ngModel.$setValidity(null,(!modelValue || !isNaN(modelValue.getTime())));
                    return $filter('date')(modelValue, 'yyyyMMdd');
                });

                ngModel.$parsers.push(function (viewValue) {
                    if (viewValue ) {
                        var dateString =  [pad(viewValue.getDate()), pad(viewValue.getMonth()+1), viewValue.getFullYear()].join('/')
                        var dateValue = parseDateString(dateString);
                        ngModel.$setValidity(null, (dateValue && !isNaN(dateValue.getTime())));
                        return dateValue;
                    }
                    else {
                        ngModel.$setValidity(null, true);
                        return null;
                    }
                });
            }
        }
    };
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

