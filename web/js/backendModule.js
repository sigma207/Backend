/**
 * Created by user on 2015/8/5.
 */

angular.module("requestFactory", []).
    factory("request", ["$http", function ($http) {
        var request = {
            hostUrl: undefined,
            changeHostUrl: function (url) {
                request.hostUrl = url;
            },
            http: function (setting) {
                if (request.hostUrl) {
                    setting.url = request.hostUrl + setting.url;
                }
                return $http(setting).success(request.onSuccess).error(request.onError);
            },
            json: function (url, data) {
                return $http({
                    method: "POST",
                    url: (request.hostUrl) ? request.hostUrl + url : url,
                    data: data
                }).success(request.onSuccess).error(request.onError);
            },
            onSuccess: function (data, status, headers, config) {
                //console.log("json onSuccess");
                //console.log(data);
                //console.log(status);
                //console.log(headers);
                //console.log(config);
            },
            onError: function (data, status, headers, config) {
                console.log("json onError");
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            }
        };
        return request;
    }]);
angular.module("localeFactory", []).
    factory("locale", function () {
        var locale = {
            zh_TW: "zh-TW",
            zh_CN: "zh-CN",
            en_US: "en-US",
            //list: [locale.zh_TW, locale.zh_CN, locale.en_US],
            lang: undefined,
            formatPermissionList: function (permissionList) {
                var permission = undefined;

                for (var i = 0; i < permissionList.length; i++) {
                    permission = permissionList[i];
                    if (permission.children) {
                        locale.formatPermissionList(permission.children);
                    }
                    locale.node(permission, permission);
                }
            },
            changeLang: function (newLang) {
                locale.lang = newLang;
            },
            convertDashToBaseLine: function (obj) {
                for (var key in obj) {
                    var value = obj[key];
                    delete obj[key];
                    key = key.replace("-", "_");
                    obj[key] = value;
                }
            },
            convertBaseLineToDash: function (obj) {
                for (var key in obj) {
                    var value = obj[key];
                    delete obj[key];
                    key = key.replace("_", "-");
                    obj[key] = value;
                }
            },
            getLangAttribute: function () {
                return locale.lang.replace("-", "_");
            },
            node: function (node, permission) {
                locale.copyLocalesAttribute(node, permission.permissionNameMap);
                node["name"] = node[locale.lang] + "(" + permission.permission_code + ")";
            },
            copyLocalesAttribute: function (obj, localesObj) {
                for (var i = 0; i < locale.list.length; i++) {
                    obj[locale.list[i]] = localesObj[locale.list[i]];
                }
            }
        };
        locale.list = [locale.zh_TW, locale.zh_CN, locale.en_US];
        return locale;
    })
;