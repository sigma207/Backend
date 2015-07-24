/**
 * Created by user on 2015/7/20.
 */
var roleTable;
var dataSourceManager;
var RolePage = {
    roleDialog:undefined
};
$(document).ready(function () {
    console.log("role....");
    roleTable = ReportTable.createNew("roleTable");
    dataSourceManager = DataSourceManager.createNew(false);
    dataSourceManager.addRenderer(roleTable);

    //$.getJSON("../../test/data.json",onTestDataLoad).fail(onTestDataFail);
    $(document).on("rowClick",roleTableRowClick);
    dataSourceManager.setDataSource(Main.testData.roleData);
    RolePage.editDialog = $("#roleDialog");
    RolePage.editDialog.dialog({
        modal: true,
        autoOpen: false
    });

    $("#newRoleBt").on("click",newRoleClick);
});

function onTestDataLoad(data,status,xhr){
    console.log(data);

}
function onTestDataFail(jqXHR, textStatus, errorThrown){
    console.log( textStatus );
}

function newRoleClick(e){
    RolePage.editDialog.dialog({title:i18n.t("newRole")});
    RolePage.editDialog.dialog("open");
}

function roleTableRowClick(e,obj){
    var tagName = $(obj.clickEvent.target).prop("tagName");
    if(tagName=="INPUT"){
        allocate(obj.clickEvent,obj.rowIndex,obj.rowData);
    }
}

function allocate(e,rowIndex,rowData){
    console.log(e);
    console.log("rowIndex=%s",rowIndex);
}