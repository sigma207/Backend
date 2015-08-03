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
    userTable: undefined,
    userDataSourceManager: undefined,
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
        if (UserPage.action == Action.Add) {
            UserPage.userRequest.ajax("/insertUser", {
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
        } else if (UserPage.action == Action.Edit) {
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

    },
    onRoleSaveClick: function (e) {
        var list = UserPage.roleTable.getSelectedData();
        UserPage.editUser.userRoleList = [];
        for (var i = 0, count = list.length; i < count; i++) {
            UserPage.editUser.userRoleList.push({login_id: UserPage.editUser.login_id, role_id: list[i].role_id});
        }
        UserPage.userRequest.ajax("/allocateUserRole", {
                dataType: "json",
                contentType: "application/json",
                type: 'POST',
                data: JSON.stringify(UserPage.editUser)
            }
        ).done(function (data, status, xhr) {
                UserPage.roleDialog.dialog("close");
            }
        );
    }
};
$(document).ready(function () {
    UserPage.userTable = ReportTable.createNew("userTable");
    UserPage.userDataSourceManager = DataSourceManager.createNew(false);
    UserPage.userDataSourceManager.addRenderer(UserPage.userTable);

    UserPage.roleTable = ReportTable.createNew("roleTable");
    UserPage.roleDataSourceManager = DataSourceManager.createNew(false);
    UserPage.roleDataSourceManager.addRenderer(UserPage.roleTable);

    UserPage.userTable.$table.on("rowClick", userTableRowClick);

    UserPage.userDialog = $("#userDialog");
    UserPage.userDialog.dialog(Config.Dialog);

    UserPage.roleDialog = $("#roleDialog");
    UserPage.roleDialog.dialog(Config.Dialog);

    $("#queryBt").on("click", UserPage.onQueryClick);
    $("#newUserBt").on("click", UserPage.onNewUserClick);
    $("#userSave").on("click", UserPage.onUserSaveClick);
    $("#roleSave").on("click", UserPage.onRoleSaveClick);

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
    var tagName = $(obj.clickEvent.target).prop("tagName");
    var name = $(obj.clickEvent.target).prop("name");
    if (tagName == "INPUT") {
        UserPage.editUser = obj.rowData;
        UserPage.editRowIndex = obj.rowIndex;
        if (name == "allocate") {
            allocate();
        } else if (name == "editUser") {
            //editUser();
        } else if (name == "removeUser") {
            deleteUser();
        }
    }
}

function deleteUser() {
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
            UserPage.roleTable.clearSelected();
            var userRoleList = data;
            var i, count;
            var roleMap = {};
            for (i = 0, count = userRoleList.length; i < count; i++) {
                roleMap[userRoleList[i].role_id] = 0;
            }
            var roleList = UserPage.roleDataSourceManager.dataSource;
            for (i = 0, count = roleList.length; i < count; i++) {
                if (typeof roleMap[roleList[i].role_id] !== typeof undefined) {
                    UserPage.roleTable.selectRow(i, true);
                }
            }

            UserPage.roleDialog.dialog({title: UserPage.editUser.login_id + ":" + i18n.t("function.allocateRole")});
            UserPage.roleDialog.dialog("open");
        }
    );
}