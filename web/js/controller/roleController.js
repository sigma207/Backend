/**
 * Created by user on 2015/8/6.
 */
backendApp.controller("RoleController", RoleController);
function RoleController($scope, $translatePartialLoader, $translate, $log, $modal, Restangular, RoleService, request, locale) {
    $translatePartialLoader.addPart("role");
    $translate.refresh();
    $log.info("RoleController!!");
    //var roles = RoleRestangular.all("role");

    $scope.getRoleList = function () {
        RoleService.getList().then(function (data) {
            $scope.rowCollection = data;
            $scope.getPermissionList();
        });
    };

    $scope.getPermissionList = function () {
        request.http({
            method: "GET",
            url: "/permission"
        }).success(function (data, status, headers, config) {
            $scope.permissionList = data;
            locale.formatPermissionList($scope.permissionList);
        });
    };

    $scope.queryClick = function () {
        $scope.getRoleList();
    };

    $scope.removeRoleClick = function (row) {
        row.remove().then(function () {
            var index = $scope.rowCollection.indexOf(row);
            $scope.rowCollection.splice(index, 1);
        });
    };

    $scope.editRoleClick = function (row) {
        $scope.currentAction = Action.Edit;
        $scope.editRole = Restangular.copy(row);
        $scope.modalTitle =  $scope.editRole.role_code+":"+$translate.instant("editRole");
        $scope.openEditRole();
    };

    $scope.allocatePermissionClick = function (row) {
        //setRestangularFields
        row.getList("permission").then(function (data) {
            row.permissionList = data;
            $scope.editRole = row;
            $scope.modalTitle =  $scope.editRole.role_code+":"+$translate.instant("allocatePermission");
            $scope.openAllocatePermission();
        });
        //request.json("/role/permission", row).
        //    success(function (data, status, headers, config) {
        //        $scope.editRole = data;
        //        $scope.modalTitle =  $scope.editRole.role_code+":"+$translate.instant("allocatePermission");
        //        $scope.openAllocatePermission();
        //    }
        //);
    };

    $scope.addRoleClick = function () {
        $scope.currentAction = Action.Add;
        $scope.editRole = {};
        $scope.modalTitle = $translate.instant("addRole");
        $scope.openEditRole();
    };

    $scope.openEditRole = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'roleEdit.html',
            controller: 'roleEditCtrl',
            size: $scope.editSize,
            resolve: {
                editObj: function () {
                    return $scope.editRole;
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
                        $scope.getRoleList();
                        break;
                    case Action.Edit:
                        $scope.getRoleList();
                        break;
                }
            },
            function () {
                //$log.info('Modal dismissed at: ' + new Date());
            }
        );
    };

    $scope.openAllocatePermission = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'allocatePermission.html',
            controller: 'allocatePermissionCtrl',
            size: $scope.editSize,
            resolve: {
                editObj: function () {
                    return $scope.editRole;
                },
                permissionList: function () {
                    $log.info($scope.permissionList);
                    return $scope.permissionList;
                },
                title: function () {
                    return $scope.modalTitle;
                }
            }
        });

        modalInstance.result.then(
            function () {
                $scope.getRoleList();
            },
            function () {
                //$log.info('Modal dismissed at: ' + new Date());
            }
        )
    };

    $scope.getRoleList();
}

backendApp.controller('roleEditCtrl', function ($scope, $modalInstance, $log, RoleService, request, locale, title, editObj, currentAction) {
    $scope.title = title;
    $scope.editObj = editObj;
    $scope.save = function () {
        switch (currentAction) {
            case Action.Add:
                RoleService.post( $scope.editObj).then(function (data) {
                    $modalInstance.close($scope.editObj);
                });
                break;
            case Action.Edit:
                $scope.editObj.put().then(function (data) {
                    $log.info(data);
                    $modalInstance.close();
                });
                break;
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

backendApp.controller('allocatePermissionCtrl', function ($scope, $modalInstance, $log, request, title, permissionList, editObj) {
    $scope.title = title;
    $scope.permissionList = permissionList;
    $scope.editObj = editObj;
    $log.info("allocatePermissionCtrl");
    $scope.init = function() {
        $scope.treeSetting= {
            check: {
                enable: true
            }
        };
        $scope.tree = $("#permissionTree");
        $.fn.zTree.init($scope.tree, $scope.treeSetting, $scope.permissionList);
        $scope.zTreeObj = $.fn.zTree.getZTreeObj("permissionTree");
        $scope.zTreeObj.checkAllNodes(false);
        var node = undefined;
        for (var i = 0; i < $scope.editObj.permissionList.length; i++) {
            node = $scope.zTreeObj.getNodeByParam("permission_id", $scope.editObj.permissionList[i].permission_id);
            $scope.zTreeObj.checkNode(node, true, false);
        }
        $scope.zTreeObj.expandAll(true);
    };

    $scope.save = function () {
        var checkedNodes = $scope.zTreeObj.getCheckedNodes();
        var role_id = $scope.editObj.role_id;
        var count = checkedNodes.length;
        $scope.editObj.permissionList = [];
        for (var i = 0; i < count; i++) {
            $scope.editObj.permissionList.push({permission_id: checkedNodes[i].permission_id, role_id: role_id});
        }
        $scope.editObj.post("permission").then(function () {
            $modalInstance.close();
        });
        //request.json("/role/allocatePermission", $scope.editObj).
        //    success(function (data, status, headers, config) {
        //        $modalInstance.close(data);
        //    }
        //);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});