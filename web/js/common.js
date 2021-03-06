/**
 * Created by user on 2015/7/24.
 */
function getJson() {
    $.getJSON("../../test/data.json", onTestDataLoad).fail(onTestDataFail);
}

var RequestJSON = {
    createNew: function (hostUrl) {
        var req = {};
        req.hostUrl = hostUrl;
        req.ajax = function (url, setting) {
            req.url = url;
            return $.ajax(req.hostUrl + req.url, setting).done(req.beforeCallback).fail(req.beforeFailCallBack);
        };
        req.json = function (url, data) {
            req.url = url;
            var setting = {
                dataType: "json",
                contentType: "application/json",
                type: 'POST',
                data: JSON.stringify(data)
            };
            return $.ajax(req.hostUrl + req.url, setting).done(req.beforeCallback).fail(req.beforeFailCallBack);
        };

        req.getJSON = function (url, callback, failCallback) {
            req.url = url;
            req.callback = callback;
            req.failCallback = failCallback;
            $.getJSON(req.hostUrl + req.url, req.beforeCallback).fail(req.beforeFailCallBack);
        };

        req.beforeCallback = function (data, status, jqXHR) {
            log(data);
        };

        req.beforeFailCallBack = function (jqXHR, textStatus, errorThrown) {
            log(jqXHR);
            if(jqXHR.responseText!=""){
                //$("#errorContent").html(jqXHR.responseText);
                //MainPage.errorDialog.dialog("open");
                alert(i18n.t("error."+jqXHR.responseText))
            }
        };

        return req;
    }
};

function formatPermissionList(permissionList) {
    var permission = undefined;

    for (var i = 0; i < permissionList.length; i++) {
        permission = permissionList[i];
        if (permission.children) {
            formatPermissionList(permission.children);
        }
        locale.node(permission, permission);
    }
}