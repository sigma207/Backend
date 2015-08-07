/**
 * Created by user on 2015/8/7.
 */
backendApp.controller("UserController", UserController);
function UserController($scope, $translatePartialLoader, $translate, $log, $modal, request) {
    $translatePartialLoader.addPart("user");
    $translate.refresh();

    $scope.gridOptions = {};
    $scope.gridOptions.enableHorizontalScrollbar = 0;
    $scope.gridOptions.columnDefs = [
        {field: 'login_id', displayName: 'loginId', headerCellFilter: 'translate'},
        {
            name: 'edit', displayName: 'userManage', headerCellFilter: 'translate',
            cellTemplate: '' +
            '<button type="button" class="btn-xs btn-primary" translate="removeUser" ng-click="grid.appScope.removeUserClick(row)" ></button>' +
            '<button type="button" class="btn-xs btn-primary" translate="editUser" ng-click="grid.appScope.editUserClick(row)" ></button>' +
            '<button type="button" class="btn-xs btn-primary" translate="allocateRole" ng-click="grid.appScope.allocateRoleClick(row)" ></button>'
        }
    ];

    $scope.getUserList = function () {
        request.http({
            method: "GET",
            url: "/user/selectUser"
        }).success(function (data, status, headers, config) {
            $scope.gridOptions.data = data;
            $scope.getRoleList();
        });
    };

    $scope.getRoleList = function () {
        request.http({
            method: "GET",
            url: "/user/selectUser"
        }).success(function (data, status, headers, config) {
            $scope.roleList = data;
        });
    };

    $scope.addUserClick = function () {
        $scope.currentAction = Action.Add;
        $scope.editUser = {};
        $scope.modalTitle = $translate.instant("addUser");
        $scope.openEditUser();
    };

    $scope.openEditUser = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'userEdit.html',
            controller: 'userEditCtrl',
            size: $scope.editSize,
            resolve: {
                editObj: function () {
                    return $scope.editUser;
                },
                title: function () {
                    return $scope.modalTitle;
                },
                currentAction: function () {
                    return $scope.currentAction;
                }
            }
        });

        modalInstance.result.then(
            function (editObj) {
                switch ($scope.currentAction) {
                    case Action.Add:
                        $scope.getUserList();
                        break;
                    case Action.Edit:
                        $scope.getUserList();
                        break;
                }
            },
            function () {
                //$log.info('Modal dismissed at: ' + new Date());
            }
        );
    };

    $scope.getUserList();
}