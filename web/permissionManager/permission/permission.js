/**
 * Created by user on 2015/7/17.
 */
var Action = {
    NewNode: "newNode",
    NewChildNode: "newChildNode",
    MoveUp: "moveUp",
    MoveDown: "moveDown",
    MoveFirst: "moveFirst",
    MoveLast: "moveLast",
    Edit: "edit",
    Remove: "remove"
};
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
    request: RequestJSON.createNew(Config.HostUrl + "/permission")
};
var currentAction;
$(document).ready(function () {
    PermissionPage.editDialog = $("#editDialog");
    PermissionPage.editDialog.dialog({
        modal: true,
        autoOpen: false
    });

    $("#save").on("click", onSaveClick);
    $("#newNodeBt").on("click", onNewNodeClick);

    getPermissionList();
});

function getPermissionList() {
    PermissionPage.request.ajax("/query/list", {
        success: onPermissionListLoad
    });
    //initZTree(Main.testData.pData);
}

function onPermissionListLoad(data, status, xhr) {

}

function onPermissionAdd(data, status, xhr) {
    if(data.permission_id==-1){
        alert("add error");
    }
}

function initZTree(data) {
    PermissionPage.tree = $("#permissionTree");

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
            var nodes = PermissionPage.zTreeObj.getNodes();
            var currentNode = PermissionPage.zTreeObj.getNodeByTId(treeId);
            var nextNode = currentNode.getNextNode();
            var preNode = currentNode.getPreNode();
            var parentNode = currentNode.getParentNode();
            var firstNode = undefined;
            var lastNode = undefined;

            if (parentNode && typeof parentNode !== typeof undefined) {
                firstNode = parentNode.children[0];
                lastNode = parentNode.children[parentNode.children.length - 1];
            } else {
                firstNode = nodes[0];
                lastNode = nodes[nodes.length - 1];
            }

            PermissionPage.zTreeObj.selectNode(currentNode);
            var menu = {};
            menu[Action.NewNode] = {
                name: i18n.t("function.newNode"),
                callback: function () {
                    currentAction = Action.NewNode;
                    addPositionOption();
                    initEditDialogVal();
                    PermissionPage.editDialog.dialog({title: i18n.t("function.newNode")});
                    PermissionPage.editDialog.dialog("open");
                }
            };
            menu[Action.NewChildNode] = {
                name: i18n.t("function.newChildNode"),
                callback: function () {
                    currentAction = Action.NewChildNode;
                    addPositionOption();
                    initEditDialogVal();
                    PermissionPage.editDialog.dialog({title: currentNode[Locale.zh_TW] + ":" + i18n.t("function.newChildNode")});
                    PermissionPage.editDialog.dialog("open");
                }
            };
            menu[Action.MoveFirst] = {
                name: "移到最上",
                callback: function () {
                    PermissionPage.zTreeObj.moveNode(firstNode, currentNode, "prev", true);
                }
            };
            menu[Action.MoveUp] = {
                name: "往上移",
                callback: function () {
                    if (typeof preNode !== typeof undefined) {
                        PermissionPage.zTreeObj.moveNode(preNode, currentNode, "prev", true);
                    }
                }
            };
            menu[Action.MoveDown] = {
                name: "往下移",
                callback: function () {
                    if (typeof nextNode !== typeof undefined) {
                        PermissionPage.zTreeObj.moveNode(nextNode, currentNode, "next", true);
                    }
                }
            };
            menu[Action.MoveLast] = {
                name: "移到最下",
                callback: function () {
                    PermissionPage.zTreeObj.moveNode(lastNode, currentNode, "next", true);
                }
            };
            menu['sep2'] = '';
            menu[Action.Edit] = {
                name: "編輯",
                callback: function () {
                    currentAction = Action.Edit;
                    addPositionOption();
                    initEditDialogVal(currentNode);
                    PermissionPage.editDialog.dialog({title: currentNode.name + ":編輯"});
                    PermissionPage.editDialog.dialog("open");
                }
            };
            menu[Action.Remove] = {
                name: "移除",
                callback: function () {
                    PermissionPage.zTreeObj.removeNode(currentNode);
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
    var position = $("#position").val();
    locale.getDomVal(PermissionPage.editPermission.permissionNameMap, "#describe_");
    log(PermissionPage.editPermission);
    switch (currentAction) {
        case Action.NewNode:
            PermissionPage.request.ajax("/add", {
                dataType: "json",
                contentType: "application/json",
                type: 'POST',
                data: JSON.stringify(PermissionPage.editPermission),
                success: onPermissionAdd
            });
            break;
    }

    //var node = getNewNode(PermissionPage.editPermission);
    //var currentNode = PermissionPage.zTreeObj.getSelectedNodes()[0];
    //switch (currentAction) {
    //    case Action.NewNode:
    //        if(currentNode){
    //            var parentNode = currentNode.getParentNode();
    //            PermissionPage.zTreeObj.addNodes(parentNode, node, true);
    //        }else{
    //            PermissionPage.zTreeObj.addNodes(null, node, true);
    //        }
    //
    //        break;
    //    case Action.NewChildNode:
    //        PermissionPage.zTreeObj.addNodes(currentNode, node, true);
    //        PermissionPage.zTreeObj.expandNode(currentNode,true);
    //        break;
    //    case Action.Edit:
    //        locale.node(currentNode, obj);
    //        PermissionPage.zTreeObj.updateNode(currentNode);
    //        break;
    //}
    //var div = $("#editDialog");
    //div.dialog("close");
}

function onNewNodeClick() {
    currentAction = Action.NewNode;
    addPositionOption();
    initEditDialogVal();
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
            options += getOption(Position.Before);
            options += getOption(Position.After);
            positionContainer.show();
            break;
    }
    select.empty();
    select.append(options);
}

function getOption(value) {
    return "<option value='" + value + "'>" + value + "</option>";
}

function initEditDialogVal(obj) {
    if (typeof obj === typeof undefined) {
        PermissionPage.editPermission = {};
        PermissionPage.editPermission.permission_id = undefined;
        PermissionPage.editPermission.permission_code = undefined;
        PermissionPage.editPermission.permissionNameMap = {};
    } else {
        PermissionPage.editPermission = obj;
    }

    $("#permission_code").val(PermissionPage.editPermission.permission_code);
    locale.setDomVal(PermissionPage.editPermission.permissionNameMap, "#describe_");
}

function getNewNode(localesObj, folder) {
    var node = {};
    locale.node(node, localesObj);
    return node;
}
