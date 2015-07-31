/**
 * Created by user on 2015/7/30.
 */

var UserPage = {
    action: undefined,
    editUser: undefined,
    editRowIndex: -1,
    userDialog: undefined,
    roleDialog: undefined,
    roleRequest: RequestJSON.createNew(Config.HostUrl + "/role"),
    userRequest: RequestJSON.createNew(Config.HostUrl + "/user"),
    userTable : undefined,
    userDataSourceManager : undefined,
    roleTable: undefined,
    roleDataSourceManager: undefined,
    onQueryClick: function (e) {
        getUserList();
    },
    onNewUserClick: function (e) {
        UserPage.action = Action.Add;
        UserPage.editUser = {};
        $("#login_id").val(UserPage.editUser.login_id);
        $("#password").val(UserPage.editUser.password);
        $("#inputAgain").val("");
        UserPage.userDialog.dialog({title: i18n.t("function.addUser")});
        UserPage.userDialog.dialog("open");
    },
    onUserSaveClick: function (e) {
        UserPage.editUser.login_id = $("#login_id").val();
        UserPage.editUser.password = $("#password").val();
        if(UserPage.action == Action.Add){
            UserPage.userRequest.ajax("/addUser", {
                    dataType: "json",
                    contentType: "application/json",
                    type: 'POST',
                    data: JSON.stringify(UserPage.editUser)
                }
            )
                .done(function (data, status, xhr) {
                    UserPage.userDataSourceManager.addRowData(data);
                    UserPage.userDialog.dialog("close");
                }
            );
        }else if(UserPage.action == Action.Edit){
            UserPage.userRequest.ajax("/updateUser", {
                    dataType: "json",
                    contentType: "application/json",
                    type: 'POST',
                    data: JSON.stringify(UserPage.editUser)
                }
            )
                .done(function (data, status, xhr) {
                    UserPage.userDataSourceManager.updateRowData(UserPage.editRowIndex);
                    UserPage.userDialog.dialog("close");
                }
            );
        }

    }
};
$(document).ready(function () {
    UserPage.userTable = ReportTable.createNew("userTable");
    UserPage.userDataSourceManager = DataSourceManager.createNew(false);
    UserPage.userDataSourceManager.addRenderer(UserPage.userTable);

    UserPage.roleTable = ReportTable.createNew("roleTable");
    UserPage.roleDataSourceManager = DataSourceManager.createNew(false);
    UserPage.roleDataSourceManager.addRenderer(UserPage.roleTable);

    $(document).on("rowClick", userTableRowClick);

    UserPage.userDialog = $("#userDialog");
    UserPage.userDialog.dialog(Config.Dialog);

    UserPage.roleDialog = $("#roleDialog");
    UserPage.roleDialog.dialog(Config.Dialog);

    $("#queryBt").on("click", UserPage.onQueryClick);
    $("#newUserBt").on("click", UserPage.onNewUserClick);
    $("#userSave").on("click", UserPage.onUserSaveClick);

    getUserList();
});

function getUserList() {
    UserPage.userRequest.ajax("/selectUser")
        .done(function (data, status, xhr) {
            UserPage.userDataSourceManager.setDataSource(JSON.parse(data));
            getRoleList();
        }
    );
}

function getRoleList() {
    UserPage.roleRequest.ajax("/query/list")
        .done(function (data, status, xhr) {
            UserPage.roleDataSourceManager.setDataSource(JSON.parse(data));
        }
    );
}

function userTableRowClick(e, obj) {
    console.log("userTableRowClick");
    var tagName = $(obj.clickEvent.target).prop("tagName");
    var name = $(obj.clickEvent.target).prop("name");
    if (tagName == "INPUT") {
        UserPage.editUser = obj.rowData;
        UserPage.editRowIndex = obj.rowIndex;
        if (name == "allocate") {
            allocate();
        } else if(name=="editUser"){
            //editUser();
        } else if(name=="removeUser"){
            deleteUser();
        }
    }
}

function deleteUser(){
    UserPage.userRequest.ajax("/deleteUser", {
        dataType: "json",
        contentType: "application/json",
        type: 'POST',
        data: JSON.stringify(UserPage.editUser)
    })
        .done(function (data, status, xhr) {
            UserPage.userDataSourceManager.removeRow(UserPage.editRowIndex);
        }
    );
}

function allocate() {
    UserPage.userRequest.ajax("/selectUserRole", {
        dataType: "json",
        contentType: "application/json",
        type: 'POST',
        data: JSON.stringify(UserPage.editUser)
    })
        .done(function (data, status, xhr) {
            //var permissionList = data.permissionList;
            //console.log(permissionList);
            //RolePage.zTreeObj.checkAllNodes(false);
            //var node = undefined;
            //for (var i = 0; i < permissionList.length; i++) {
            //    node = RolePage.zTreeObj.getNodeByParam("permission_id", permissionList[i].permission_id);
            //    RolePage.zTreeObj.checkNode(node, true, false);
            //}

            UserPage.roleDialog.dialog({title: UserPage.editUser.login_id + ":" + i18n.t("function.allocateRole")});
            UserPage.roleDialog.dialog("open");
        }
    );
}