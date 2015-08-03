/**
 * Created by user on 2015/7/17.
 */

var Position = {
    Before: "前",
    After: "後",
    First: "first",
    Last: "last"
};
var PermissionPage = {
    tree: undefined,
    zTreeObj: undefined,
    treeSetting: {
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            nameIsHTML: true
        }
    },
    editDialog: undefined,
    editPermission: undefined,
    request: RequestJSON.createNew(Config.HostUrl + "/permission"),
    initNodeName: function (node, permission) {
        locale.node(node, permission);
    },
    nodeMoveSetting:{
        targetNode:undefined,
        treeNode:undefined,
        moveType:undefined
    }
};
var currentAction;
$(document).ready(function () {
    PermissionPage.editDialog = $("#editDialog");
    PermissionPage.editDialog.dialog({
        modal: true,
        autoOpen: false,
        appendTo: ".content",
        width: 400
    });

    $("#save").on("click", onSaveClick);
    $("#newNodeBt").on("click", onNewNodeClick);

    getPermissionList();
});

function getPermissionList() {
    PermissionPage.request.ajax("/query/list", {
        success: onPermissionListLoad
    });
}

function onPermissionListLoad(data, status, xhr) {
    var permissionList = JSON.parse(data);
    if (permissionList.result && permissionList.result == "noData") {
        initZTree([]);
    } else {
        initZTree(permissionList);
    }
}

function onPermissionAdd(data, status, xhr) {
    if (data.permission_id == -1) {
        alert("add error");
    } else {
        PermissionPage.editPermission = data;
        PermissionPage.editDialog.dialog("close");

        PermissionPage.initNodeName(PermissionPage.editPermission, PermissionPage.editPermission);
        switch (currentAction) {
            case Action.NewNode:
                if(PermissionPage.editPermission.parent_permission_id){
                    var parent_node = PermissionPage.zTreeObj.getNodeByParam("permission_id",PermissionPage.editPermission.parent_permission_id);
                    PermissionPage.zTreeObj.addNodes(parent_node, PermissionPage.editPermission, true);
                }else{
                    PermissionPage.zTreeObj.addNodes(null, PermissionPage.editPermission, true);
                }
                break;
            case Action.NewChildNode:
                var selectedNode = PermissionPage.zTreeObj.getSelectedNodes()[0];
                PermissionPage.zTreeObj.addNodes(selectedNode, PermissionPage.editPermission, true);
                PermissionPage.zTreeObj.expandNode(selectedNode,true);
                break;
        }

    }
}

function onPermissionUpdate(data, status, xhr){
    PermissionPage.editDialog.dialog("close");
    var selectedNode = PermissionPage.zTreeObj.getSelectedNodes()[0];

    selectedNode.permission_code = data.permission_code;
    PermissionPage.initNodeName(selectedNode, data);
    PermissionPage.zTreeObj.updateNode(selectedNode);
}

function onPermissionDelete(data, status, xhr){
    var selectedNode = PermissionPage.zTreeObj.getSelectedNodes()[0];
    PermissionPage.zTreeObj.removeNode(selectedNode);
}

function onPermissionMove(data,status, xhr){
    console.log("onPermissionMove");
    for(var i=0;i<data.length;i++){
        var node = PermissionPage.zTreeObj.getNodeByParam("permission_id",data[i].permission_id);
        node.sequence = data[i].sequence;
    }
    PermissionPage.zTreeObj.moveNode(PermissionPage.nodeMoveSetting.targetNode, PermissionPage.nodeMoveSetting.treeNode, PermissionPage.nodeMoveSetting.moveType, true);
}

function initZTree(data) {
    PermissionPage.tree = $("#permissionTree");
    formatPermissionList(data);
    $.fn.zTree.init(PermissionPage.tree, PermissionPage.treeSetting, data);
    PermissionPage.zTreeObj = $.fn.zTree.getZTreeObj("permissionTree");
    initContextMenu();
    //loadContentUrl();
}

function initContextMenu() {
    PermissionPage.tree.contextMenu({
        selector: ".zTreeItem",
        build: function (element) {
            var treeId = element.attr("id").replace("_a", "");
            var moveNodes = PermissionPage.zTreeObj.getNodes();
            var currentNode = PermissionPage.zTreeObj.getNodeByTId(treeId);
            if(currentNode.level!=0){
                moveNodes = currentNode.getParentNode().children;
            }

            PermissionPage.zTreeObj.selectNode(currentNode);
            var menu = {};
            menu[Action.NewNode] = {
                name: i18n.t("function.newNode"),
                callback: function () {
                    currentAction = Action.NewNode;
                    if(currentNode.level==0){
                        editNewPermission();
                    }else{
                        editNewPermission(currentNode.getParentNode());
                    }
                    PermissionPage.editDialog.dialog({title: i18n.t("function.newNode")});
                    PermissionPage.editDialog.dialog("open");
                }
            };
            menu[Action.NewChildNode] = {
                name: i18n.t("function.newChildNode"),
                callback: function () {
                    currentAction = Action.NewChildNode;
                    editNewPermission(currentNode);
                    PermissionPage.editDialog.dialog({title: currentNode[Locale.zh_TW] + ":" + i18n.t("function.newChildNode")});
                    PermissionPage.editDialog.dialog("open");
                }
            };
            menu[Action.MoveFirst] = {
                name: "移到最上",
                callback: function () {
                    PermissionPage.nodeMoveSetting.moveNodes = moveNodes;
                    PermissionPage.nodeMoveSetting.targetNode = moveNodes[0];
                    PermissionPage.nodeMoveSetting.treeNode = currentNode;
                    PermissionPage.nodeMoveSetting.moveType = "prev";
                    PermissionPage.nodeMoveSetting.moveAction = Action.MoveFirst;

                    PermissionPage.request.ajax("/move", {
                        dataType: "json",
                        contentType: "application/json",
                        type: 'POST',
                        data: JSON.stringify(PermissionPage.nodeMoveSetting),
                        success: onPermissionMove
                    });
                }
            };
            menu[Action.MoveUp] = {
                name: "往上移",
                disabled: !currentNode.getPreNode(),
                callback: function () {
                    PermissionPage.nodeMoveSetting.moveNodes = moveNodes;
                    PermissionPage.nodeMoveSetting.targetNode = currentNode.getPreNode();
                    PermissionPage.nodeMoveSetting.treeNode = currentNode;
                    PermissionPage.nodeMoveSetting.moveType = "prev";
                    PermissionPage.nodeMoveSetting.moveAction = Action.MoveUp;

                    PermissionPage.request.ajax("/move", {
                        dataType: "json",
                        contentType: "application/json",
                        type: 'POST',
                        data: JSON.stringify(PermissionPage.nodeMoveSetting),
                        success: onPermissionMove
                    });
                }
            };
            menu[Action.MoveDown] = {
                name: "往下移",
                disabled: !currentNode.getNextNode(),
                callback: function () {
                    PermissionPage.nodeMoveSetting.moveNodes = moveNodes;
                    PermissionPage.nodeMoveSetting.targetNode = currentNode.getNextNode();
                    PermissionPage.nodeMoveSetting.treeNode = currentNode;
                    PermissionPage.nodeMoveSetting.moveType = "next";
                    PermissionPage.nodeMoveSetting.moveAction = Action.MoveDown;

                    PermissionPage.request.ajax("/move", {
                        dataType: "json",
                        contentType: "application/json",
                        type: 'POST',
                        data: JSON.stringify(PermissionPage.nodeMoveSetting),
                        success: onPermissionMove
                    });
                }
            };
            menu[Action.MoveLast] = {
                name: "移到最下",
                callback: function () {
                    PermissionPage.nodeMoveSetting.moveNodes = moveNodes;
                    PermissionPage.nodeMoveSetting.targetNode = moveNodes[moveNodes.length-1];
                    PermissionPage.nodeMoveSetting.treeNode = currentNode;
                    PermissionPage.nodeMoveSetting.moveType = "next";
                    PermissionPage.nodeMoveSetting.moveAction = Action.MoveLast;

                    PermissionPage.request.ajax("/move", {
                        dataType: "json",
                        contentType: "application/json",
                        type: 'POST',
                        data: JSON.stringify(PermissionPage.nodeMoveSetting),
                        success: onPermissionMove
                    });
                }
            };
            menu['sep2'] = '';
            menu[Action.Edit] = {
                name: "編輯",
                callback: function () {
                    currentAction = Action.Edit;
                    initEditDialogVal(currentNode);
                    PermissionPage.editDialog.dialog({title: currentNode.name + ":編輯"});
                    PermissionPage.editDialog.dialog("open");
                }
            };
            menu[Action.Remove] = {
                name: "移除",
                callback: function () {
                    console.log("remove...");
                    console.log(currentNode);
                    PermissionPage.request.ajax("/delete", {
                        dataType: "json",
                        contentType: "application/json",
                        type: 'POST',
                        data: JSON.stringify(currentNode),
                        success: onPermissionDelete
                    });

                }
            };
            return {
                autoHide: true,
                items: menu
            };
        }
    });
}

function onSaveClick(e) {
    PermissionPage.editPermission.permission_code = $("#permission_code").val();
    PermissionPage.editPermission.path = $("#path").val();
    var position = $("#position").val();
    locale.getDomVal(PermissionPage.editPermission.permissionNameMap, "#describe_");
    switch (currentAction) {
        case Action.NewNode:
        case Action.NewChildNode:
            PermissionPage.request.ajax("/add", {
                dataType: "json",
                contentType: "application/json",
                type: 'POST',
                data: JSON.stringify(PermissionPage.editPermission),
                success: onPermissionAdd
            });
            break;
        case Action.Edit:
            PermissionPage.request.ajax("/update", {
                dataType: "json",
                contentType: "application/json",
                type: 'POST',
                data: JSON.stringify(PermissionPage.editPermission),
                success: onPermissionUpdate
            });
            break;
    }
}

function onNewNodeClick() {
    currentAction = Action.NewNode;
    var selectedNodes = PermissionPage.zTreeObj.getSelectedNodes();
    //log(selectedNodes);
    var selectedNode = undefined;
    if(selectedNodes.length>0){
        selectedNode = selectedNodes[0];
    }
    if(selectedNode&&selectedNode.level==0){
        editNewPermission();
    }else{
        editNewPermission(selectedNode);
    }

    PermissionPage.editDialog.dialog({title: i18n.t("function.newNode")});
    PermissionPage.editDialog.dialog("open");
}

function addPositionOption() {
    var select = $("#position");
    var positionContainer = $("#positionContainer");
    var options = "";
    positionContainer.hide();
    switch (currentAction) {
        case Action.NewNode:
            //options += getOption(Position.Before);
            //options += getOption(Position.After);
            //positionContainer.show();
            break;
    }
    select.empty();
    select.append(options);
}

function getOption(value) {
    return "<option value='" + value + "'>" + value + "</option>";
}

function editNewPermission(parentNode) {
    addPositionOption();
    PermissionPage.editPermission = {};
    PermissionPage.editPermission.permission_id = undefined;
    PermissionPage.editPermission.permission_code = undefined;
    PermissionPage.editPermission.path = undefined;
    if(parentNode){
        if(parentNode.isParent){
            PermissionPage.editPermission.sequence = parentNode.children.length;
        }else{
            PermissionPage.editPermission.sequence = 0;
        }
        PermissionPage.editPermission.parent_permission_id = parentNode.permission_id;
    } else {
        var rootNodes = PermissionPage.zTreeObj.getNodes();
        if (rootNodes) {
            PermissionPage.editPermission.sequence = rootNodes.length;
        } else {
            PermissionPage.editPermission.sequence = 0;
        }
        PermissionPage.editPermission.parent_permission_id = undefined;
    }
    PermissionPage.editPermission.permissionNameMap = {};

    $("#permission_code").val(PermissionPage.editPermission.permission_code);
    $("#path").val(PermissionPage.editPermission.path);
    locale.setDomVal(PermissionPage.editPermission.permissionNameMap, "#describe_");
}

function initEditDialogVal(currentNode) {
    console.log(currentNode);
    PermissionPage.editPermission = currentNode;
    console.log(PermissionPage);
    $("#permission_code").val(PermissionPage.editPermission.permission_code);
    $("#path").val(PermissionPage.editPermission.path);
    locale.setDomVal(PermissionPage.editPermission.permissionNameMap, "#describe_");
}
