/**
 * Created by user on 2015/7/20.
 */
var roleTable;
var dataSourceManager;
$(document).ready(function () {
    console.log("role....");
    roleTable = ReportTable.createNew("roleTable");
    dataSourceManager = DataSourceManager.createNew(false);
    dataSourceManager.addRenderer(roleTable);

    //$.getJSON("../../test/data.json",onTestDataLoad).fail(onTestDataFail);
    $(document).on("rowClick",roleTableRowClick);
    dataSourceManager.setDataSource(Main.testData.roleData);
});

function onTestDataLoad(data,status,xhr){
    console.log(data);

}
function onTestDataFail(jqXHR, textStatus, errorThrown){
    console.log( textStatus );
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