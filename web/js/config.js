/**
 * Created by user on 2015/7/21.
 */
var Config = {
    HostUrl: "http://localhost:8080/Backend",
    Dialog:{
        modal: true,
        autoOpen: false,
        appendTo: ".content"
    },
    DatePicker:{
        dateFormat:"yymmdd"
    }
};
var MenuItem = {
    Demo: {
        url: "Demo.html"
    },
    Permission: {
        url: "permissionManager/permission/Permission.html",
        localesFile: "permission"
    },
    Role: {
        url: "permissionManager/role/Role.html",
        localesFile: "role"
    },
    User: {
        url: "userManager/user/User.html",
        localesFile: "user"
    }
};

var Action = {
    NewNode: "newNode",
    NewChildNode: "newChildNode",
    MoveUp: "moveUp",
    MoveDown: "moveDown",
    MoveFirst: "moveFirst",
    MoveLast: "moveLast",
    Add: "add",
    Edit: "edit",
    Remove: "remove"
};

var Locale = {
    zh_TW: "zh-TW",
    zh_CN: "zh-CN",
    en_US: "en-US",
    createNew: function (currentLang) {
        var locale = {};
        locale.list = [Locale.zh_TW, Locale.zh_CN, Locale.en_US];
        locale.lang = currentLang;
        locale.getLangAttribute = function () {
            return locale.lang.replace("-", "_");
        };
        locale.node = function (node, permission) {
            //var lang = locale.getLangAttribute();

            locale.copyLocalesAttribute(node, permission.permissionNameMap);
            node["name"] = node[locale.lang]+"("+permission.permission_code+")";
        };

        locale.copyLocalesAttribute = function (obj, localesObj) {
            //var obj = {};
            for (var i = 0; i < locale.list.length; i++) {
                obj[locale.list[i]] = localesObj[locale.list[i]];
            }
            //return obj;
        };

        locale.getDomVal = function (permissionNameMap, selector) {
            for (var i = 0; i < locale.list.length; i++) {
                var language = locale.list[i];
                permissionNameMap[language] = $(selector + language).val();
            }
        };

        locale.setDomVal = function (permissionNameMap, selector) {
            for (var i = 0; i < locale.list.length; i++) {
                var language = locale.list[i];
                var propertyLocale = permissionNameMap[language];
                //if(propertyLocale){
                    $(selector + language).val(propertyLocale);
                //}
            }
        };
        return locale;
    }
};

var pData = [
    {"id": 1, "pId": 0, "name": "權限管理", "open": true},
    {"id": 11, "pId": 1, "name": "權限設定"},
    {"id": 12, "pId": 1, "name": "角色設定"},
    {"id": 2, "pId": 0, "name": "商品管理", "open": true},
    {"id": 21, "pId": 2, "name": "主商品設定"},
    {"id": 22, "pId": 2, "name": "每日商品屬性"},
    {"id": 23, "pId": 2, "name": "可交易商品設定"},
    {"id": 3, "pId": 0, "name": "下單監控", "open": true},
    {"id": 31, "pId": 3, "name": "代客下單"},
    {"id": 32, "pId": 3, "name": "即時部位監控"},
    {"id": 4, "pId": 0, "name": "後台帳號管理", "open": true},
    {"id": 41, "pId": 4, "name": "開帳號"},
    {"id": 42, "pId": 4, "name": "配角色"},
    {"id": 5, "pId": 0, "name": "交易帳號管理", "open": true},
    {"id": 51, "pId": 5, "name": "開代理"},
    {"id": 52, "pId": 5, "name": "開會員"},
    {"id": 53, "pId": 5, "name": "開交易員"},
    {"id": 54, "pId": 5, "name": "群組設定，配交易員"},
    {"id": 55, "pId": 5, "name": "出入金"},
    {"id": 56, "pId": 5, "name": "客戶個人資料"},
    {"id": 6, "pId": 0, "name": "報表", "open": true},
    {"id": 61, "pId": 6, "name": "操作日誌查詢"},
    {"id": 62, "pId": 6, "name": "各式交易報表"},
    {"id": 7, "pId": 0, "name": "其他操作", "open": true},
    {"id": 71, "pId": 7, "name": "公告"},
    {"id": 72, "pId": 7, "name": "投顧信息"},
    {"id": 73, "pId": 7, "name": "報價查詢"},
    {"id": 74, "pId": 7, "name": "黑名單"}
];

