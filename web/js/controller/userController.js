/**
 * Created by user on 2015/8/7.
 */
backendApp.controller("UserController", UserController);
function UserController($scope, $translatePartialLoader, $translate, $log, $modal, UserService, RoleService) {
    $translatePartialLoader.addPart("user");
    $translate.refresh();

    $scope.getUserList = function () {
        UserService.getList().then(function (data) {
            $scope.rowCollection = data;
            $scope.getRoleList();
        });
    };

    $scope.getRoleList = function () {
        RoleService.getList().then(function (data) {
            $scope.roleList = data;
        });
    };

    $scope.queryClick = function () {
        $scope.getUserList();
    };

    $scope.removeUserClick = function (row) {
        row.remove().then(function () {
            var index = $scope.rowCollection.indexOf(row);
            $scope.rowCollection.splice(index, 1);
        });
    };

    $scope.editUserClick = function (row) {
        //$scope.currentAction = Action.Edit;
        //$scope.editRole = angular.copy(row.entity);
        //$scope.modalTitle =  $scope.editRole.role_code+":"+$translate.instant("editRole");
        //$scope.openEditRole();
    };

    $scope.allocateRoleClick = function (row) {
        $scope.editUser = row;
        row.getList("userRoles").then(function (data) {
            $scope.userRoleList = data;
            $scope.modalTitle = $scope.editUser.login_id+":"+$translate.instant("allocateRole");
            $scope.openAllocateRole();
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

backendApp.controller('userEditCtrl', function ($scope, $modalInstance, $log, UserService, locale, title, editObj, currentAction) {
    $scope.title = title;
    $scope.editObj = editObj;
    $scope.save = function () {
        switch (currentAction) {
            case Action.Add:
                UserService.post( $scope.editObj).then(function (data) {
                    $modalInstance.close(data);
                });
                break;
            case Action.Edit:
                $scope.editObj.put().then(function (data) {
                    $modalInstance.close();
                });
                break;
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

backendApp.controller('allocateRoleCtrl', function ($scope, $modalInstance, $log, $timeout, title, editObj, userRoleList, roleList) {
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
        var list = $scope.selectedRoleList;
        $scope.editObj.userRoleList = [];
        for(var i= 0,count=list.length;i<count;i++){
            $scope.editObj.userRoleList.push({user_id: $scope.editObj.user_id, role_id: list[i].role_id});
        }
        $scope.editObj.post("userRoles").then(function (data) {
            $modalInstance.close(data);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});