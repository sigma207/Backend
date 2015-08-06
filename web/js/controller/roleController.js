/**
 * Created by user on 2015/8/6.
 */
backendApp.controller("RoleController", RoleController);
function RoleController($scope,$log,request){
    $log.info("RoleController");
    request.http({
        method: "GET",
        url: "/role/query/list"
    }).success(function (data, status, headers, config) {
        $scope.roleList = data;
        $log.info($scope.roleList);
    });
}