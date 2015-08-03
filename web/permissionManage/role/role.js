/**
 * Created by user on 2015/7/20.
 */
var roleTable;
var dataSourceManager;
var RolePage = {
    action: undefined,
    editRole: undefined,
    editRowIndex: -1,
    tree: undefined,
    zTreeObj: undefined,
    treeSetting: {
        check: {
            enable: true
        }
    },
    roleDialog: undefined,
    permissionDialog: undefined,
    permissionList: undefined,
    roleRequest: RequestJSON.createNew(Config.HostUrl + "/role"),
    permissionRequest: RequestJSON.createNew(Config.HostUrl + "/permission"),
    onQueryClick: function (e) {
        getRoleList();
    },
    onNewRoleClick: function (e) {
        RolePage.action = Action.Add;
        RolePage.editRole = {};
        $("#roleCode").val(RolePage.editRole.role_code);
        $("#roleName").val(RolePage.editRole.role_name);
        RolePage.roleDialog.dialog({title: i18n.t("function.addRole")});
        RolePage.roleDialog.dialog("open");
    },
    onRoleSaveClick: function (e) {
        RolePage.editRole.role_code = $("#roleCode").val();
        RolePage.editRole.role_name = $("#roleName").val();
        if(RolePage.action == Action.Add){
            RolePage.roleRequest.ajax("/addRole", {
                    dataType: "json",
                    contentType: "application/json",
                    type: 'POST',
                    data: JSON.stringify(RolePage.editRole)
                }
            )
                .done(function (data, status, xhr) {
                    //dataSourceManager.addRowData(data);
                    getRoleList();
                    RolePage.roleDialog.dialog("close");
                }
            );
        }else if(RolePage.action == Action.Edit){
            RolePage.roleRequest.ajax("/updateRole", {
                    dataType: "json",
                    contentType: "application/json",
                    type: 'POST',
                    data: JSON.stringify(RolePage.editRole)
                }
            )
                .done(function (data, status, xhr) {
                    //dataSourceManager.updateRowData(RolePage.editRowIndex);
                    getRoleList();
                    RolePage.roleDialog.dialog("close");
                }
            );
        }

    },
    onPermissionSaveClick: function (e) {
        var checkedNodes = RolePage.zTreeObj.getCheckedNodes();
        var role_id = RolePage.editRole.role_id;
        var count = checkedNodes.length;
        RolePage.editRole.permissionList = [];
        for (var i = 0; i < count; i++) {
            RolePage.editRole.permissionList.push({permission_id: checkedNodes[i].permission_id, role_id: role_id});
        }
        RolePage.roleRequest.ajax("/allocatePermission", {
                dataType: "json",
                contentType: "application/json",
                type: 'POST',
                data: JSON.stringify(RolePage.editRole)
            }
        )
            .done(function (data, status, xhr) {
                RolePage.permissionDialog.dialog("close");
            }
        );
    }
};

$(document).ready(function () {
    roleTable = ReportTable.createNew("roleTable");
    dataSourceManager = DataSourceManager.createNew(false);
    dataSourceManager.addRenderer(roleTable);

    roleTable.$table.on("rowClick", roleTableRowClick);

    RolePage.roleDialog = $("#roleDialog");
    RolePage.roleDialog.dialog(Config.Dialog);
    RolePage.permissionDialog = $("#permissionDialog");
    RolePage.permissionDialog.dialog(Config.Dialog);

    $("#queryBt").on("click", RolePage.onQueryClick);
    $("#newRoleBt").on("click", RolePage.onNewRoleClick);
    $("#roleSave").on("click", RolePage.onRoleSaveClick);
    $("#permissionSave").on("click", RolePage.onPermissionSaveClick);
    getRoleList();
});

function getRoleList() {
    RolePage.roleRequest.ajax("/query/list")
        .done(function (data, status, xhr) {
            var roleList = JSON.parse(data);
            dataSourceManager.setDataSource(roleList);
            getPermissionList();
        }
    );
}

function getPermissionList() {
    RolePage.permissionRequest.ajax("/query/list")
        .done(function (data, status, xhr) {
            RolePage.permissionList = JSON.parse(data);
            RolePage.tree = $("#permissionTree");
            formatPermissionList(RolePage.permissionList, RolePage.permissionList);
            $.fn.zTree.init(RolePage.tree, RolePage.treeSetting, RolePage.permissionList);
            RolePage.zTreeObj = $.fn.zTree.getZTreeObj("permissionTree");
        });
}

function roleTableRowClick(e, obj) {
    console.log("roleTableRowClick");
    var tagName = $(obj.clickEvent.target).prop("tagName");
    var name = $(obj.clickEvent.target).prop("name");
    if (tagName == "INPUT") {
        RolePage.editRole = obj.rowData;
        RolePage.editRowIndex = obj.rowIndex;
        if (name == "allocate") {
            allocate();
        } else if(name=="editRole"){
            editRole();
        } else if(name=="removeRole"){
            deleteRole();
        }
    }
}

function editRole(){
    RolePage.action = Action.Edit;
    $("#roleCode").val(RolePage.editRole.role_code);
    $("#roleName").val(RolePage.editRole.role_name);
    RolePage.roleDialog.dialog({title: RolePage.editRole.role_code+":"+ i18n.t("function.editRole")});
    RolePage.roleDialog.dialog("open");
}

function deleteRole(){
    RolePage.roleRequest.ajax("/deleteRole", {
        dataType: "json",
        contentType: "application/json",
        type: 'POST',
        data: JSON.stringify(RolePage.editRole)
    })
        .done(function (data, status, xhr) {
            dataSourceManager.removeRow(RolePage.editRowIndex);
        }
    );
}

function allocate() {
    console.log("roleAllocate");
    RolePage.roleRequest.ajax("/query/rolePermissionList", {
        dataType: "json",
        contentType: "application/json",
        type: 'POST',
        data: JSON.stringify(RolePage.editRole)
    })
        .done(function (data, status, xhr) {
            var permissionList = data.permissionList;
            console.log(permissionList);
            RolePage.zTreeObj.checkAllNodes(false);
            var node = undefined;
            for (var i = 0; i < permissionList.length; i++) {
                node = RolePage.zTreeObj.getNodeByParam("permission_id", permissionList[i].permission_id);
                RolePage.zTreeObj.checkNode(node, true, false);
            }
            showRolePermissionTree(RolePage.editRole);
        }
    );
}

function showRolePermissionTree(role) {
    RolePage.zTreeObj.expandAll(true);
    RolePage.permissionDialog.dialog({title: role.role_code + ":" + i18n.t("function.allocatePermission")});
    RolePage.permissionDialog.dialog("open");
}