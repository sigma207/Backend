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
var currentAction;
var currentItem;
var currentLocale;
var api = undefined;
$(document).ready(function () {
    console.log("ppp");
    currentLocale = "describe_zh_tw";
    var tree = $('#tree');
    tree.aciTree({
        rootData: getTree(),
        itemHook: itemHook
    });

    tree.on('acitree', onTreeEvent);

    api = tree.aciTree('api');
    //api.init();
    //api.option("itemHook",itemHook);
    //api.option("rootData",getTree);

    $("#save").on("click", onSaveClick);
    $("#locale_zh_tw").on("click", onLocaleZhTwClick);
    $("#locale_zh_cn").on("click", onLocaleZhCnClick);
    $("#locale_en_us").on("click", onLocaleEnUsClick);
    $("#editDialog").dialog({
        autoOpen: false
    });

    tree.contextMenu({
        selector: ".aciTreeLine",
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
});

function onLocaleZhTwClick(e) {
    currentLocale = "describe_zh_tw";
    changeLocale();
}

function onLocaleZhCnClick(e) {
    currentLocale = "describe_zh_cn";
    changeLocale();
}

function onLocaleEnUsClick(e) {
    currentLocale = "describe_en_us";
    changeLocale();
}

function changeLocale() {
    $(".locale").hide();
    $("." + currentLocale).show();
}

function itemHook(parent, item, itemData, level) {
    this.setLabel(item, {
        label: "<span class='locale describe_zh_tw'>" + itemData.describe_zh_tw + "</span>" +
        "<span class='locale describe_zh_cn'>" + itemData.describe_zh_cn + "</span>" +
        "<span class='locale describe_en_us'>" + itemData.describe_en_us + "</span>"
    });
}

function onSaveClick(e) {
    var obj = {
        id: $("#id").val(),
        describe_zh_tw: $("#describe_zh_tw").val(),
        describe_zh_cn: $("#describe_zh_cn").val(),
        describe_en_us: $("#describe_en_us").val(),
        position: $("#position").val()
    };
    var itemData = getItemData(obj);
    switch (currentAction) {
        case Action.NewGroup:
        case Action.NewItem:
            if (obj.position == Position.Before) {
                api.before(currentItem, {itemData: itemData});
            } else {
                api.after(currentItem, {itemData: itemData});
            }
            break;
        case Action.NewChildGroup:
        case Action.NewChildItem:
            api.append(currentItem, {itemData: itemData});
            api.open(currentItem);
            break;
        case Action.Edit:
            itemData = api.itemData(currentItem);
            itemData.id = obj.id;
            itemData.describe_zh_tw = obj.zh_tw;
            itemData.describe_zh_cn = obj.zh_cn;
            itemData.describe_en_us = obj.en_us;
            var label =
                "<span class='locale describe_zh_tw'>" + itemData.describe_zh_tw + "</span>" +
                "<span class='locale describe_zh_cn'>" + itemData.describe_zh_cn + "</span>" +
                "<span class='locale describe_en_us'>" + itemData.describe_en_us + "</span>";
            api.setLabel(currentItem, {label: label});
            changeLocale();
            break;
    }
    var div = $("#editDialog");
    div.dialog("close");
}

function getItemData(obj) {
    if (currentAction == Action.NewGroup || currentAction == Action.NewChildGroup) {
        return new Folder(obj.id, obj.describe_zh_tw, obj.describe_zh_cn, obj.describe_en_us);
    } else if (currentAction == Action.NewItem || currentAction == Action.NewChildItem) {
        return new Item(obj.id, obj.describe_zh_tw, obj.describe_zh_cn, obj.describe_en_us);
    }
}

function initEditDialogVal(obj) {
    $("#id").val(obj.id);
    $("#describe_zh_tw").val(obj.describe_zh_tw);
    $("#describe_zh_cn").val(obj.describe_zh_cn);
    $("#describe_en_us").val(obj.describe_en_us);
}

function addPositionOption() {
    var select = $("#position");
    var positionContainer = $("#positionContainer");
    var options = "";
    positionContainer.hide();
    switch (currentAction) {
        case Action.NewGroup:
        case Action.NewItem:
            options += getOption(Position.Before);
            options += getOption(Position.After);
            positionContainer.show();
            break;
        case Action.NewChildGroup:
        case Action.NewChildItem:
//                    options += getOption(Position.First);
//                    options += getOption(Position.Last);
            break;
    }
    select.empty();
    select.append(options);
}

function getOption(value) {
    return "<option value='" + value + "'>" + value + "</option>";
}

function getTree() {
    return [
        new Folder('A', "會員管理", "会员", "member")
    ];
}

function onTreeEvent(event, api, item, eventName, options) {
    var itemId = api.getId(item);

    if (eventName == 'loaded'||eventName == "added") {
        changeLocale();
    }
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