/**
 * Created by user on 2015/7/17.
 */
var Action = {
    NewGroup: "newGroup",
    NewItem: "newItem",
    NewChildGroup: "newChildGroup",
    NewChildItem: "newChildItem",
    MoveUp: "moveUp",
    MoveDown: "moveDown",
    MoveFirst: "moveFirst",
    MoveLast: "moveLast",
    Edit: "edit",
    Remove: "remove"
};
var Position = {
    Before: "before",
    After: "after",
    First: "first",
    Last: "last"
};
var PermissionPage = {
    permissionTree:undefined,
    treeSetting:{
        data: {
            simpleData: {
                enable: true
            }
        }
    }
};
var currentAction;
var currentItem;
var currentLocale;
$(document).ready(function () {
    console.log("ppp");
    currentLocale = "describe_zh_tw";
    $("#editDialog").dialog({
        autoOpen: false
    });

    initZTree(Main.testData.pData);
});

function initZTree(data){
    PermissionPage.permissionTree = $("#permissionTree");
    $.fn.zTree.init(PermissionPage.permissionTree, PermissionPage.treeSetting, data);
    initContextMenu();
    //loadContentUrl();
}

function initContextMenu(){
    $('[class^="ses_"]');
    PermissionPage.permissionTree.contextMenu({
        selector: "li[id^='menuTree_']",
        build: function (element) {
            var div = $("#editDialog");

            currentItem = api.itemFrom(element);
            var itemData = api.itemData(currentItem);
            var menu = {};
            menu[Action.NewGroup] = {
                name: "新增群組",
                callback: function () {
                    currentAction = Action.NewGroup;
                    addPositionOption();
                    initEditDialogVal({});
                    div.dialog({title: "新增群組"});
                    div.dialog("open");
                }
            };
            menu[Action.NewItem] = {
                name: "新增功能",
                callback: function () {
                    currentAction = Action.NewItem;
                    addPositionOption();
                    initEditDialogVal({});
                    div.dialog({title: "新增功能"});
                    div.dialog("open");
                }
            };
            menu['sep1'] = '';
            menu[Action.NewChildGroup] = {
                name: "新增子群組",
                disabled: !api.isInode(currentItem),
                callback: function () {
                    currentAction = Action.NewChildGroup;
                    addPositionOption();
                    initEditDialogVal({});
                    div.dialog({title: itemData[currentLocale] + ":新增子群組"});
                    div.dialog("open");
                }
            };
            menu[Action.NewChildItem] = {
                name: "新增子功能",
                disabled: !api.isInode(currentItem),
                callback: function () {
                    currentAction = Action.NewChildItem;
                    addPositionOption();
                    initEditDialogVal({});
                    div.dialog({title: itemData[currentLocale] + ":新增子功能"});
                    div.dialog("open");
                }
            };
            menu['sep2'] = '';
            menu[Action.MoveFirst] = {
                name: "移到最上",
                callback: function () {
                    api.moveFirst(currentItem);
                }
            };
            menu[Action.MoveUp] = {
                name: "往上移",
                callback: function () {
                    api.moveUp(currentItem);
                }
            };
            menu[Action.MoveDown] = {
                name: "往下移",
                callback: function () {
                    api.moveDown(currentItem);
                }
            };
            menu[Action.MoveLast] = {
                name: "移到最下",
                callback: function () {
                    api.moveLast(currentItem);
                }
            };
            menu['sep3'] = '';
            menu[Action.Edit] = {
                name: "編輯",
                callback: function () {
                    currentAction = Action.Edit;
                    addPositionOption();
                    initEditDialogVal(itemData);
                    div.dialog({title: itemData[currentLocale] + ":編輯"});
                    div.dialog("open");
                }
            };
            menu[Action.Remove] = {
                name: "移除",
                callback: function () {
                    api.remove(currentItem);
                }
            };
            return {
                autoHide: true,
                items: menu
            };
        }
    });
}

function Folder(id, describe_zh_tw, describe_zh_cn, describe_en_us) {
    this.id = id;
    this.describe_zh_tw = describe_zh_tw;
    this.describe_zh_cn = describe_zh_cn;
    this.describe_en_us = describe_en_us;
    this.inode = true;
    this.open = false;
    this.icon = "folder";
    this.branch = [];
}

function Item(id, describe_zh_tw, describe_zh_cn, describe_en_us) {
    this.id = id;
    this.describe_zh_tw = describe_zh_tw;
    this.describe_zh_cn = describe_zh_cn;
    this.describe_en_us = describe_en_us;
    this.inode = false;
    this.open = false;
    this.icon = "file";
}