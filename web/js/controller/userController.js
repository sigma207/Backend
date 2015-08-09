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
            url: "/user/selectUser"
        }).success(function (data, status, headers, config) {
            $scope.gridOptions.data = data;
            $scope.getRoleList();
        });
    };

    $scope.getRoleList = function () {
        request.http({
            method: "GET",
            url: "/role/query/list"
        }).success(function (data, status, headers, config) {
            $scope.roleList = data;
        });
    };

    $scope.queryClick = function () {
        $scope.getUserList();
    };

    $scope.removeUserClick = function (row) {
        request.json("/user/deleteUser", row.entity).
            success(function (data, status, headers, config) {
                var index = $scope.gridOptions.data.indexOf(row.entity);
                $scope.gridOptions.data.splice(index, 1);
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
        $scope.editUser = angular.copy(row.entity);
        request.json("/user/selectUserRole", row.entity).
            success(function (data, status, headers, config) {
                $scope.userRoleList = data;
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
                request.json("/user/insertUser", $scope.editObj).
                    success(function (data, status, headers, config) {
                        $modalInstance.close(data);
                    }
                );
                break;
            case Action.Edit:
                request.json("/user/updateUser", $scope.editObj).
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

    $scope.init = function() {
        $scope.gridOptions = {
            enableRowSelection: true,
            enableSelectAll: true
        };
        $scope.gridOptions.enableHorizontalScrollbar = 0;
        $scope.gridOptions.columnDefs = [
            {field: 'role_code', displayName: 'roleCode', headerCellFilter: 'translate'},
            {field: 'role_name', displayName: 'roleName', headerCellFilter: 'translate'},
        ];
        $scope.gridOptions.onRegisterApi = function(gridApi){
            //set gridApi on scope
            $scope.gridApi = gridApi;
            $timeout(function() {
                if($scope.gridApi.selection.selectRow){
                    var i, count;
                    var roleMap = {};
                    for (i = 0, count = $scope.userRoleList.length; i < count; i++) {
                        roleMap[userRoleList[i].role_id] = 0;
                    }
                    for (i = 0, count = $scope.roleList.length; i < count; i++) {
                        if (typeof roleMap[$scope.roleList[i].role_id] !== typeof undefined) {
                            $scope.gridApi.selection.selectRow($scope.gridOptions.data[i]);
                        }
                    }
                }
            });
        };
        $scope.gridOptions.data = $scope.roleList;
    };

    $scope.save = function () {
        var list = $scope.gridApi.selection.getSelectedRows();
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