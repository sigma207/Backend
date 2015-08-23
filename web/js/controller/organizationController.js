/**
 * Created by user on 2015/8/22.
 */
backendApp.controller("OrganizationController", OrganizationController);
function OrganizationController($scope, $modal, $log, $translatePartialLoader, $translate, Restangular, OrganizationService, OrganizationMoveService, locale) {
    $translatePartialLoader.addPart("organization");
    $translate.refresh();

    var tree = $("#organizationTree");
    var zTreeObj;
    var nodeMoveSetting = {
        targetNode: undefined,
        treeNode: undefined,
        moveType: undefined
    };
    var treeSetting = {
        data: {
            simpleData: {
                enable: true
            },
            key:{
                name:"org_name"
            }
        }
    };

    OrganizationService.getList().then(function (data) {
        $scope.organizationList = data;
        $scope.initTree();
        //$scope.rowCollection = $scope.organizationList;
    });

    $scope.initTree = function () {
        $.fn.zTree.init(tree, treeSetting, $scope.organizationList);
        zTreeObj = $.fn.zTree.getZTreeObj("organizationTree");
        zTreeObj.expandAll(true);
        $scope.initTreeContextMenu();
    };

    $scope.initTreeContextMenu = function () {
        tree.contextMenu({
            selector: ".zTreeItem",
            build: function (element) {
                var treeId = element.attr("id").replace("_a", "");
                var moveNodes = zTreeObj.getNodes();
                var currentNode = zTreeObj.getNodeByTId(treeId);
                if (currentNode.level != 0) {
                    moveNodes = currentNode.getParentNode().children;
                }
                nodeMoveSetting.moveNodes = moveNodes;
                nodeMoveSetting.treeNode = currentNode;

                zTreeObj.selectNode(currentNode);
                var menu = {};
                menu[Action.NewNode] = {
                    name: $translate.instant("add_org"),
                    callback: function () {
                        $scope.currentAction = Action.NewNode;
                        if (currentNode.level == 0) {
                            $scope.editNewObject();
                        } else {
                            $scope.editNewObject(currentNode.getParentNode());
                        }
                        $scope.editTitle = $translate.instant("add_org");
                        $scope.open();
                    }
                };
                menu[Action.NewChildNode] = {
                    name: $translate.instant("add_sub_org"),
                    callback: function () {
                        $scope.currentAction = Action.NewChildNode;
                        $scope.editNewObject(currentNode);
                        $log.info(currentNode);
                        $scope.editTitle = currentNode.org_name + ":"+$translate.instant("add_sub_org");
                        $scope.open();
                    }
                };
                menu[Action.MoveFirst] = {
                    name: $translate.instant("move_top"),
                    callback: function () {
                        nodeMoveSetting.targetNode = moveNodes[0];
                        nodeMoveSetting.moveType = "prev";
                        nodeMoveSetting.moveAction = Action.MoveFirst;
                        OrganizationMoveService.post(nodeMoveSetting).then($scope.onNodeMove);
                    }
                };
                menu[Action.MoveUp] = {
                    name: $translate.instant("move_up"),
                    disabled: !currentNode.getPreNode(),
                    callback: function () {
                        nodeMoveSetting.targetNode = currentNode.getPreNode();
                        nodeMoveSetting.moveType = "prev";
                        nodeMoveSetting.moveAction = Action.MoveUp;
                        OrganizationMoveService.post(nodeMoveSetting).then($scope.onNodeMove);
                    }
                };
                menu[Action.MoveDown] = {
                    name: $translate.instant("move_down"),
                    disabled: !currentNode.getNextNode(),
                    callback: function () {
                        nodeMoveSetting.targetNode = currentNode.getNextNode();
                        nodeMoveSetting.moveType = "next";
                        nodeMoveSetting.moveAction = Action.MoveDown;
                        OrganizationMoveService.post(nodeMoveSetting).then($scope.onNodeMove);
                    }
                };
                menu[Action.MoveLast] = {
                    name: $translate.instant("move_bottom"),
                    callback: function () {
                        nodeMoveSetting.targetNode = moveNodes[moveNodes.length - 1];
                        nodeMoveSetting.moveType = "next";
                        nodeMoveSetting.moveAction = Action.MoveLast;
                        OrganizationMoveService.post(nodeMoveSetting).then($scope.onNodeMove);
                    }
                };
                menu['sep2'] = '';
                menu[Action.Edit] = {
                    name: $translate.instant("edit"),
                    callback: function () {
                        $scope.currentAction = Action.Edit;
                        $scope.editNode = Restangular.copy(currentNode);
                        $scope.editTitle = currentNode.org_name + ":"+$translate.instant("edit");
                        $scope.open();
                    }
                };
                menu[Action.Remove] = {
                    name: $translate.instant("delete"),
                    callback: function () {
                        $log.info(currentNode);
                        Restangular.copy(currentNode).remove().then(function (data) {
                            var selectedNode = zTreeObj.getSelectedNodes()[0];
                            zTreeObj.removeNode(selectedNode);
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

    $scope.editNewObject = function (parentNode) {
        $scope.editNode = {};
        if (parentNode) {
            if (parentNode.isParent) {
                $scope.editNode.sequence = parentNode.children.length;
            } else {
                $scope.editNode.sequence = 0;
            }
            $scope.editNode.parent_org_id = parentNode.org_id;
        } else {
            var rootNodes = zTreeObj.getNodes();
            if (rootNodes) {
                $scope.editNode.sequence = rootNodes.length;
            } else {
                $scope.editNode.sequence = 0;
            }
            $scope.editNode.parent_org_id = undefined;
        }
    };

    $scope.onNodeMove = function (data) {
        for (var i = 0; i < data.length; i++) {
            var node = zTreeObj.getNodeByParam("org_id", data[i].org_id);
            node.sequence = data[i].sequence;
        }
        zTreeObj.moveNode(nodeMoveSetting.targetNode, nodeMoveSetting.treeNode, nodeMoveSetting.moveType, true);
    };

    $scope.addNodeClick = function () {
        $scope.currentAction = Action.NewNode;

        var selectedNodes = zTreeObj.getSelectedNodes();

        var selectedNode = undefined;
        if (selectedNodes.length > 0) {
            selectedNode = selectedNodes[0];
        }
        if (selectedNode && selectedNode.level == 0) {
            $scope.editNewObject();
        } else {
            $scope.editNewObject(selectedNode);
        }
        $scope.editTitle = $translate.instant("add_org");
        $scope.open();
    };

    $scope.open = function () {
        //$scope.editSize = "sm";
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'organizationEdit.html',
            controller: 'organizationEditCtrl',
            size: $scope.editSize,
            resolve: {
                editNode: function () {
                    return $scope.editNode;
                },
                title: function () {
                    return $scope.editTitle;
                },
                currentAction: function () {
                    return $scope.currentAction;
                }
            }
        });

        modalInstance.result.then(function (editNode) {

            var selectedNode = undefined;
            $scope.editNode = editNode;
            switch ($scope.currentAction) {
                case Action.NewNode:
                    if ($scope.editNode.parent_org_id) {
                        var parent_node = zTreeObj.getNodeByParam("org_id", $scope.editNode.parent_org_id);
                        zTreeObj.addNodes(parent_node, $scope.editNode, true);
                    } else {
                        zTreeObj.addNodes(null, $scope.editNode, true);
                    }
                    break;
                case Action.NewChildNode:
                    selectedNode = zTreeObj.getSelectedNodes()[0];
                    $log.info(selectedNode);
                    zTreeObj.addNodes(selectedNode, $scope.editNode, true);
                    $log.info(selectedNode);
                    zTreeObj.expandNode(selectedNode, true);
                    break;
                case Action.Edit:
                    selectedNode = zTreeObj.getSelectedNodes()[0];
                    selectedNode.org_code = $scope.editNode.org_code;
                    selectedNode.org_name = $scope.editNode.org_name;
                    locale.node(selectedNode, $scope.editNode);
                    $log.info(selectedNode);
                    zTreeObj.updateNode(selectedNode);
                    break;
            }
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

}

backendApp.controller('organizationEditCtrl', function ($scope, $modalInstance, $log, OrganizationService, locale, title, editNode, currentAction) {
    $scope.title = title;
    $scope.editNode = editNode;
    $scope.ok = function () {
        switch (currentAction) {
            case Action.NewNode:
            case Action.NewChildNode:
                OrganizationService.post( $scope.editNode).then(function (data) {
                    $modalInstance.close(data);
                });
                break;
            case Action.Edit:
                $scope.editNode.put().then(function (data) {
                    $modalInstance.close(data);
                });
                break;
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});