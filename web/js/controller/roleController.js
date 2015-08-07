/**
 * Created by user on 2015/8/6.
 */
backendApp.controller("RoleController", RoleController);
function RoleController($scope, $translatePartialLoader, $translate, $log, $modal, request, locale) {
    $translatePartialLoader.addPart("role");
    $translate.refresh();
    $log.info("RoleController");
    $scope.gridOptions = {};
    $scope.gridOptions.enableHorizontalScrollbar = 0;
    $scope.gridOptions.columnDefs = [
        {field: 'role_code', displayName: 'roleCode', headerCellFilter: 'translate'},
        {field: 'role_name', displayName: 'roleName', headerCellFilter: 'translate'},
        {
            name: 'edit', displayName: 'roleManage', headerCellFilter: 'translate',
            cellTemplate: '' +
            '<button type="button" class="btn-xs btn-primary" translate="removeRole" ng-click="grid.appScope.removeRoleClick(row)" ></button>' +
            '<button type="button" class="btn-xs btn-primary" translate="editRole" ng-click="grid.appScope.editRoleClick(row)" ></button>' +
            '<button type="button" class="btn-xs btn-primary" translate="allocatePermission" ng-click="grid.appScope.allocatePermissionClick(row)" ></button>'
        }
    ];

    $scope.getRoleList = function () {
        request.http({
            method: "GET",
            url: "/role/query/list"
        }).success(function (data, status, headers, config) {
            $scope.gridOptions.data = data;
            $scope.getPermissionList();
        });
    };

    $scope.getPermissionList = function () {
        request.http({
            method: "GET",
            url: "/permission/query/list"
        }).success(function (data, status, headers, config) {
            $scope.permissionList = data;
            locale.formatPermissionList($scope.permissionList);
        });
    };

    $scope.queryClick = function () {
        $scope.getRoleList();
    };

    $scope.removeRoleClick = function (row) {
        request.json("/role/deleteRole", row.entity).
            success(function (data, status, headers, config) {
                var index = $scope.gridOptions.data.indexOf(row.entity);
                $scope.gridOptions.data.splice(index, 1);
            }
        );
    };

    $scope.editRoleClick = function (row) {
        $scope.currentAction = Action.Edit;
        $scope.editRole = angular.copy(row.entity);
        $scope.modalTitle =  $scope.editRole.role_code+":"+$translate.instant("editRole");
        $scope.openEditRole();
    };

    $scope.allocatePermissionClick = function (row) {
        request.json("/role/query/rolePermissionList", row.entity).
            success(function (data, status, headers, config) {
                $scope.editRole = data;
                $scope.openAllocatePermission();
            }
        );
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

backendApp.controller('roleEditCtrl', function ($scope, $modalInstance, $log, request, locale, title, editObj, currentAction) {
    $scope.title = title;
    $scope.editObj = editObj;
    $scope.save = function () {
        switch (currentAction) {
            case Action.Add:
                request.json("/role/addRole", $scope.editObj).
                    success(function (data, status, headers, config) {
                        $modalInstance.close(data);
                    }
                );
                break;
            case Action.Edit:
                request.json("/role/updateRole", $scope.editObj).
                    success(function (data, status, headers, config) {
                        $log.info("success");
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
        request.json("/role/allocatePermission", $scope.editObj).
            success(function (data, status, headers, config) {
                $modalInstance.close(data);
            }
        );
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});