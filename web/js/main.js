/**
 * Created by user on 2015/7/20.
 */
var Main = {
    contentItem:undefined,
    lang:undefined,
    testData:undefined,
    treeSetting:{
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onMenuClick
        }
    }
};
var locale = Locale.createNew(Locale.zh_TW);

$(document).ready(function () {
    Main.contentItem = MenuItem.Permission;
    Main.testData = pData;
    //initZTree(Main.testData);
    $.getJSON("test/data.json",onTestDataLoad).fail(onTestDataFail);
});

function onTestDataLoad(data,status,xhr){
    Main.testData = data;
    console.log(data);
    //initMenu(Main.testData.permissionData);
    initZTree(Main.testData.pData);

}

function onTestDataFail(jqXHR, textStatus, error){
    console.log( error.code+":"+error.message );
}

function initZTree(data){
    $.fn.zTree.init($("#menuTree"), Main.treeSetting, data);
    loadContentUrl();
}

function onMenuClick(event, treeId, treeNode){
    console.log("onMenuClick");
    if(treeNode.id=="11"){
        Main.contentItem = MenuItem.Permission;
        loadContentUrl();
    }else if(treeNode.id=="12"){
        Main.contentItem = MenuItem.Role;
        loadContentUrl();
    }
}

function loadContentUrl() {
    console.log("loadContentUrl:"+Main.contentItem.url);
    $(".content").load(Main.contentItem.url, contentLoad);
}

function contentLoad(response, status, xhr) {
    //console.log(response);
    //console.log(status);
    //console.log(xhr);
    changeLang(locale.lang);
}

function changeLang(lang) {
    var option = {resGetPath: "locales/" + lang + "/"+Main.contentItem.localesFile+".json"};
    i18n.init(option, function (t) {
        $(".content").add(".ui-dialog").i18n();
    });
}