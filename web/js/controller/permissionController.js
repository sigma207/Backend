/**
 * Created by user on 2015/8/6.
 */
backendApp.controller("PermissionController", PermissionController);
function PermissionController($scope, $modal, $log, PermissionService, locale) {
    $log.info("PermissionController!!");
    $scope.editSize = undefined;
    $scope.editTitle = "新增節點";
    $scope.permissionTreeSetting = {
        data: {
            simpleData: {
                enable: true
            }
        }
    };
    $scope.nodeMoveSetting = {
        targetNode: undefined,
        treeNode: undefined,
        moveType: undefined
    };

    PermissionService.query(function (data) {
        $scope.permissionList = data;
        locale.formatPermissionList($scope.permissionList);
        $scope.initPermissionTree();
    });

    $scope.initPermissionTree = function () {
        $scope.permissionTree = $("#permissionTree");
        $.fn.zTree.init($scope.permissionTree, $scope.permissionTreeSetting, $scope.permissionList);
        $scope.permissionZTreeObj = $.fn.zTree.getZTreeObj("permissionTree");
        $scope.permissionZTreeObj.expandAll(true);
        $scope.initPermissionTreeContextMenu();
    };

    $scope.initPermissionTreeContextMenu = function () {
        $scope.permissionTree.contextMenu({
            selector: ".zTreeItem",
            build: function (element) {
                var treeId = element.attr("id").replace("_a", "");
                var moveNodes = $scope.permissionZTreeObj.getNodes();
                var currentNode = $scope.permissionZTreeObj.getNodeByTId(treeId);
                if (currentNode.level != 0) {
                    moveNodes = currentNode.getParentNode().children;
                }

                $scope.permissionZTreeObj.selectNode(currentNode);
                var menu = {};
                menu[Action.NewNode] = {
                    name: "新增節點",
                    callback: function () {
                        $log.info(Action.NewNode);
                        $scope.currentAction = Action.NewNode;
                        if (currentNode.level == 0) {
                            $scope.editNewPermission();
                        } else {
                            $scope.editNewPermission(currentNode.getParentNode());
                        }
                        $scope.editTitle = "新增節點";
                        $scope.open();
                    }
                };
                menu[Action.NewChildNode] = {
                    name: "新增子節點",
                    callback: function () {
                        $log.info(Action.NewChildNode);
                        $scope.currentAction = Action.NewChildNode;
                        $scope.editNewPermission(currentNode);
                        $scope.editTitle = currentNode[locale.zh_TW] + ":新增子節點";
                        $scope.open();
                    }
                };
                menu[Action.MoveFirst] = {
                    name: "移到最上",
                    callback: function () {
                        $scope.nodeMoveSetting.moveNodes = moveNodes;
                        $scope.nodeMoveSetting.targetNode = moveNodes[0];
                        $scope.nodeMoveSetting.treeNode = currentNode;
                        $scope.nodeMoveSetting.moveType = "prev";
                        $scope.nodeMoveSetting.moveAction = Action.MoveFirst;

                        PermissionService.move({},$scope.nodeMoveSetting, $scope.onPermissionMove);
                    }
                };
                menu[Action.MoveUp] = {
                    name: "往上移",
                    disabled: !currentNode.getPreNode(),
                    callback: function () {
                        $scope.nodeMoveSetting.moveNodes = moveNodes;
                        $scope.nodeMoveSetting.targetNode = currentNode.getPreNode();
                        $scope.nodeMoveSetting.treeNode = currentNode;
                        $scope.nodeMoveSetting.moveType = "prev";
                        $scope.nodeMoveSetting.moveAction = Action.MoveUp;

                        PermissionService.move({},$scope.nodeMoveSetting, $scope.onPermissionMove);
                    }
                };
                menu[Action.MoveDown] = {
                    name: "往下移",
                    disabled: !currentNode.getNextNode(),
                    callback: function () {
                        $scope.nodeMoveSetting.moveNodes = moveNodes;
                        $scope.nodeMoveSetting.targetNode = currentNode.getNextNode();
                        $scope.nodeMoveSetting.treeNode = currentNode;
                        $scope.nodeMoveSetting.moveType = "next";
                        $scope.nodeMoveSetting.moveAction = Action.MoveDown;

                        PermissionService.move({},$scope.nodeMoveSetting, $scope.onPermissionMove);
                    }
                };
                menu[Action.MoveLast] = {
                    name: "移到最下",
                    callback: function () {
                        $scope.nodeMoveSetting.moveNodes = moveNodes;
                        $scope.nodeMoveSetting.targetNode = moveNodes[moveNodes.length - 1];
                        $scope.nodeMoveSetting.treeNode = currentNode;
                        $scope.nodeMoveSetting.moveType = "next";
                        $scope.nodeMoveSetting.moveAction = Action.MoveLast;

                        PermissionService.move({},$scope.nodeMoveSetting, $scope.onPermissionMove);
                    }
                };
                menu['sep2'] = '';
                menu[Action.Edit] = {
                    name: "編輯",
                    callback: function () {
                        $scope.currentAction = Action.Edit;
                        $scope.editPermission = currentNode;
                        locale.convertDashToBaseLine($scope.editPermission.permissionNameMap);
                        $scope.editTitle = currentNode.name + ":編輯";
                        $scope.open();
                    }
                };
                menu[Action.Remove] = {
                    name: "移除",
                    callback: function () {
                        //PermissionService.remove({permissionId:currentNode.permission_id},{}, function (data) {
                        //    $log.info("remove");
                        //    var selectedNode = $scope.permissionZTreeObj.getSelectedNodes()[0];
                        //    $scope.permissionZTreeObj.removeNode(selectedNode);
                        //});
                        PermissionService.deletePermission({},currentNode, function (data) {
                            var selectedNode = $scope.permissionZTreeObj.getSelectedNodes()[0];
                            $scope.permissionZTreeObj.removeNode(selectedNode);
                        });
                    }
                };
                return {
                    autoHide: false,
                    items: menu
                };
            }
        });
    };

    $scope.editNewPermission = function (parentNode) {
        $scope.editPermission = {};
        $scope.editPermission.permission_id = undefined;
        $scope.editPermission.permission_code = undefined;
        $scope.editPermission.path = undefined;
        if (parentNode) {
            if (parentNode.isParent) {
                $scope.editPermission.sequence = parentNode.children.length;
            } else {
                $scope.editPermission.sequence = 0;
            }
            $scope.editPermission.parent_permission_id = parentNode.permission_id;
        } else {
            var rootNodes = $scope.permissionZTreeObj.getNodes();
            if (rootNodes) {
                $scope.editPermission.sequence = rootNodes.length;
            } else {
                $scope.editPermission.sequence = 0;
            }
            $scope.editPermission.parent_permission_id = undefined;
        }
    };

    $scope.onPermissionMove = function (data) {
        for (var i = 0; i < data.length; i++) {
            var node = $scope.permissionZTreeObj.getNodeByParam("permission_id", data[i].permission_id);
            node.sequence = data[i].sequence;
        }
        $scope.permissionZTreeObj.moveNode($scope.nodeMoveSetting.targetNode, $scope.nodeMoveSetting.treeNode, $scope.nodeMoveSetting.moveType, true);
    };

    $scope.addNodeClick = function () {
        $scope.currentAction = Action.NewNode;

        var selectedNodes = $scope.permissionZTreeObj.getSelectedNodes();

        var selectedNode = undefined;
        if (selectedNodes.length > 0) {
            selectedNode = selectedNodes[0];
        }
        if (selectedNode && selectedNode.level == 0) {
            $scope.editNewPermission();
        } else {
            $scope.editNewPermission(selectedNode);
        }
        $scope.editTitle = "新增節點";
        $scope.open();
    };

    $scope.open = function () {
        //$scope.editSize = "sm";
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'permissionEdit.html',
            controller: 'permissionEditCtrl',
            size: $scope.editSize,
            resolve: {
                editPermission: function () {
                    return $scope.editPermission;
                },
                title: function () {
                    return $scope.editTitle;
                },
                currentAction: function () {
                    return $scope.currentAction;
                }
            }
        });

        modalInstance.result.then(function (editPermission) {

            var selectedNode = undefined;
            $scope.editPermission = editPermission;
            locale.node($scope.editPermission, $scope.editPermission);
            $log.info(editPermission);
            switch ($scope.currentAction) {
                case Action.NewNode:
                    if ($scope.editPermission.parent_permission_id) {
                        var parent_node = $scope.permissionZTreeObj.getNodeByParam("permission_id", $scope.editPermission.parent_permission_id);
                        $scope.permissionZTreeObj.addNodes(parent_node, $scope.editPermission, true);
                    } else {
                        $scope.permissionZTreeObj.addNodes(null, $scope.editPermission, true);
                    }
                    break;
                case Action.NewChildNode:
                    selectedNode = $scope.permissionZTreeObj.getSelectedNodes()[0];
                    $scope.permissionZTreeObj.addNodes(selectedNode, $scope.editPermission, true);
                    $scope.permissionZTreeObj.expandNode(selectedNode, true);
                    break;
                case Action.Edit:
                    selectedNode = $scope.permissionZTreeObj.getSelectedNodes()[0];
                    selectedNode.permission_code = $scope.editPermission.permission_code;
                    locale.node(selectedNode, $scope.editPermission);
                    $scope.permissionZTreeObj.updateNode(selectedNode);
                    break;
            }
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
}

backendApp.controller('permissionEditCtrl', function ($scope, $modalInstance, $log, PermissionService, request, locale, title, editPermission, currentAction) {
    $scope.title = title;
    $scope.editPermission = editPermission;
    $scope.ok = function () {
        locale.convertBaseLineToDash($scope.editPermission.permissionNameMap);
        $log.info($scope.editPermission);
        switch (currentAction) {
            case Action.NewNode:
            case Action.NewChildNode:
                PermissionService.save({}, $scope.editPermission, function (data) {
                    delete data.$promise;
                    delete data.$resolved;
                    $modalInstance.close(data);
                });
                break;
            case Action.Edit:
                PermissionService.save({permissionId:$scope.editPermission.permission_id}, $scope.editPermission, function (data) {
                    delete data.$promise;
                    delete data.$resolved;
                    $modalInstance.close(data);
                });
                break;
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});