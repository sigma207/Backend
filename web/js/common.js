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
            req.callback = setting.success;
            req.failCallback = setting.error;
            setting.success = req.beforeCallback;
            setting.error = req.beforeFailCallBack;
            $.ajax(req.hostUrl + req.url, setting);
        };

        req.getJSON = function (url, callback, failCallback) {
            req.url = url;
            req.callback = callback;
            req.failCallback = failCallback;
            $.getJSON(req.hostUrl + req.url, req.beforeCallback).fail(req.beforeFailCallBack);
        };

        req.beforeCallback = function (data, status, jqXHR ) {
            log(data);
            log(status);
            log(jqXHR );
            req.callback.call(req, [data, status, jqXHR ]);
        };

        req.beforeFailCallBack = function (jqXHR, textStatus, errorThrown) {
            log(jqXHR);
            log(textStatus);
            log(errorThrown);
            if (typeof req.failCallback !== typeof undefined) {
                req.failCallback.call(req, [jqXHR, textStatus, errorThrown]);
            }

        };

        return req;
    }
};