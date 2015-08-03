/**
 * Created by user on 2015/7/20.
 */
var MainPage = {
    contentItem: undefined,
    lang: undefined,
    testData: undefined,
    treeSetting: {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onMenuClick
        }
    },
    errorDialog: undefined,
    permissionRequest: RequestJSON.createNew(Config.HostUrl + "/permission"),
    getPermissionList: function () {
        MainPage.permissionRequest.ajax("/query/list").
            done(function (data, status, xhr) {
                var permissionList = JSON.parse(data);
                initZTree(permissionList);
            }
        );
    }
};
var locale = Locale.createNew(Locale.zh_TW);

$(document).ready(function () {
    MainPage.contentItem = MenuItem.Demo;
    MainPage.testData = pData;

    MainPage.errorDialog = $("#errorDialog");
    MainPage.errorDialog.dialog(Config.Dialog);
    //initZTree(Main.testData);
    //$.getJSON("test/data.json", onTestDataLoad).fail(onTestDataFail);
    MainPage.getPermissionList();
});

function onTestDataLoad(data, status, xhr) {
    MainPage.testData = data;
    console.log(data);
    //initMenu(Main.testData.permissionData);
    initZTree(MainPage.testData.pData);

}

function onTestDataFail(jqXHR, textStatus, error) {
    console.log(error.code + ":" + error.message);
}

function initZTree(data) {
    formatPermissionList(data);
    MainPage.tree = $("#menuTree");
    $.fn.zTree.init(MainPage.tree, MainPage.treeSetting, data);
    MainPage.zTreeObj = $.fn.zTree.getZTreeObj("menuTree");
    MainPage.zTreeObj.expandAll(true);
    loadContentUrl();
}

function onMenuClick(event, treeId, treeNode) {
    console.log("onMenuClick");
    MainPage.contentItem = treeNode;
    //if (treeNode.id == "11") {
    //    MainPage.contentItem = MenuItem.Permission;
    //} else if (treeNode.id == "12") {
    //    MainPage.contentItem = MenuItem.Role;
    //} else if (treeNode.id == "41") {
    //    MainPage.contentItem = MenuItem.User;
    //}
    if (typeof MainPage.contentItem !== typeof undefined) {
        loadContentUrl();
    }
}

function loadContentUrl() {
    console.log("loadContentUrl:" + MainPage.contentItem.path);
    if(MainPage.contentItem&&MainPage.contentItem.path){
        $(".content").load(MainPage.contentItem.path, contentLoad);
    }
}

function contentLoad(response, status, xhr) {
    //console.log(response);
    //console.log(status);
    //console.log(xhr);
    changeLang(locale.lang);
}

function changeLang(lang) {
    var startIndex = MainPage.contentItem.path.lastIndexOf("/")+1;
    var endIndex = MainPage.contentItem.path.lastIndexOf(".html");
    if(endIndex!=-1){
        var item = MainPage.contentItem.path.substring(startIndex,endIndex).toLowerCase();
        var option = {resGetPath: "locales/" + lang + "/" + item + ".json"};
        i18n.init(option, function (t) {
            //console.log(lang + ":" + item + ".json");
            $(".content").add(".ui-dialog").i18n();
        });
    }

}