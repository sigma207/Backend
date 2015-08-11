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
            //'<button type="button" class="btn-xs btn-primary" translate="editUser" ng-click="grid.appScope.editUserClick(row)" ></button>' +
            '<button type="button" class="btn-xs btn-primary" translate="allocateRole" ng-click="grid.appScope.allocateRoleClick(row)" ></button>'
        }
    ];

    $scope.getUserList = function () {
        request.http({
            method: "GET",
            url: "/user/select"
        }).success(function (data, status, headers, config) {
            $scope.rowCollection = data;
            $scope.getRoleList();
        });
    };

    $scope.getRoleList = function () {
        request.http({
            method: "GET",
            url: "/role/select"
        }).success(function (data, status, headers, config) {
            $scope.roleList = data;
        });
    };

    $scope.queryClick = function () {
        $scope.getUserList();
    };

    $scope.removeUserClick = function (row) {
        request.json("/user/delete", row).
            success(function (data, status, headers, config) {
                var index = $scope.rowCollection.indexOf(row);
                $scope.rowCollection.splice(index, 1);
            }
        );
    };

    $scope.editUserClick = function (row) {
        //$scope.currentAction = Action.Edit;
        //$scope.editRole = angular.copy(row.entity);
        //$scope.modalTitle =  $scope.editRole.role_code+":"+$translate.instant("editRole");
        //$scope.openEditRole();
    };

    $scope.allocateRoleClick = function (row) {
        $scope.editUser = angular.copy(row);
        request.json("/user/select/userRoleList", row).
            success(function (data, status, headers, config) {
                $scope.userRoleList = data;
                $scope.modalTitle = $scope.editUser.login_id+":"+$translate.instant("allocateRole");
                $scope.openAllocateRole();
            }
        );
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

    $scope.openAllocateRole = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'allocateRole.html',
            controller: 'allocateRoleCtrl',
            size: $scope.editSize,
            resolve: {
                editObj: function () {
                    return $scope.editUser;
                },
                userRoleList: function () {
                    return $scope.userRoleList;
                },
                roleList: function () {
                    return $scope.roleList;
                },
                title: function () {
                    return $scope.modalTitle;
                }
            }
        });

        modalInstance.result.then(
            function () {
                $scope.getUserList();
            },
            function () {
                //$log.info('Modal dismissed at: ' + new Date());
            }
        )
    };

    $scope.getUserList();
}

backendApp.controller('userEditCtrl', function ($scope, $modalInstance, $log, request, locale, title, editObj, currentAction) {
    $scope.title = title;
    $scope.editObj = editObj;
    $scope.save = function () {
        switch (currentAction) {
            case Action.Add:
                request.json("/user/insert", $scope.editObj).
                    success(function (data, status, headers, config) {
                        $modalInstance.close(data);
                    }
                );
                break;
            case Action.Edit:
                request.json("/user/update", $scope.editObj).
                    success(function (data, status, headers, config) {
                        $modalInstance.close(data);
                    }
                );
                break;
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

backendApp.controller('allocateRoleCtrl', function ($scope, $modalInstance, $log, $timeout, request, title, editObj, userRoleList, roleList) {
    $scope.title = title;
    $scope.editObj = editObj;
    $scope.userRoleList = userRoleList;
    $scope.roleList = roleList;
    $scope.selectedRoleList = [];

    $scope.init = function() {
        var i, count;
        var roleMap = {};
        for (i = 0, count = $scope.userRoleList.length; i < count; i++) {
            roleMap[userRoleList[i].role_id] = 0;
        }
        for (i = 0, count = $scope.roleList.length; i < count; i++) {
            if (typeof roleMap[$scope.roleList[i].role_id] !== typeof undefined) {
                $scope.selectedRoleList.push(roleList[i]);
            }
        }
        $scope.rowCollection = $scope.roleList;
    };

    $scope.save = function () {
        $log.info($scope.selectedRoleList );
        var list = $scope.selectedRoleList;
        $scope.editObj.userRoleList = [];
        for(var i= 0,count=list.length;i<count;i++){
            $scope.editObj.userRoleList.push({login_id: $scope.editObj.login_id, role_id: list[i].role_id});
        }
        request.json("/user/allocateUserRole", $scope.editObj).
            success(function (data, status, headers, config) {
                $modalInstance.close(data);
            }
        );
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});