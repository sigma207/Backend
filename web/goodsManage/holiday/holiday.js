/**
 * Created by user on 2015/8/3.
 */
var HolidayPage = {
    begin_date: undefined,
    end_date: undefined,
    holidayDialog: undefined,
    holidayBatchDialog: undefined,
    exceptionDialog: undefined,
    holidayTable: undefined,
    holidayDataSourceManager: undefined,
    exceptionTable: undefined,
    exceptionDataSourceManager: undefined,
    holidayRequest: RequestJSON.createNew(Config.HostUrl + "/holiday"),
    editHoliday: undefined,
    exchangeList: undefined,
    selectedExchange: undefined,
    selectedMainSymbol: undefined,
    getGoodsList: function () {
        HolidayPage.exchangeList = HolidayPage.fakeGoods;
        HolidayPage.setExchange(HolidayPage.exchangeList);
    },
    getHoliday: function () {
        //HolidayPage.holidayDataSourceManager.setDataSource(JSON.parse(data));
    },
    getException: function () {
        //HolidayPage.exceptionDataSourceManager.setDataSource(JSON.parse(data));
    },
    onExchangeChange: function (e) {
        var selectedIndex = $("#exchange_id")[0].selectedIndex;
        HolidayPage.selectedExchange = HolidayPage.exchangeList[selectedIndex];
        HolidayPage.setSymbol(HolidayPage.selectedExchange.main_symbol)
    },
    onSymbolChange: function (e) {
        var selectedIndex = $("#main_symbol_id")[0].selectedIndex;
        HolidayPage.selectedMainSymbol = HolidayPage.selectedExchange.main_symbol[selectedIndex];
        HolidayPage.getHoliday();
        HolidayPage.getException();
        console.log("getHoliday");
    },
    onBatchAddHolidayClick: function (e) {
        HolidayPage.batchHoliday = [{}];
        HolidayPage.holidayEditDataSourceManager.setDataSource(HolidayPage.batchHoliday);
        //HolidayPage.holidayEditDataSourceManager.addRowData({begin_date: "20150805", memo: "ABC"});
        HolidayPage.holidayBatchDialog.dialog({title: i18n.t("function.addHoliday")});
        HolidayPage.holidayBatchDialog.dialog("open");
    },
    onBatchSaveHolidayClick: function (e) {
        HolidayPage.holidayRequest.json("/batchInsertHoliday", HolidayPage.batchHoliday)
            .done(function (data, status, xhr) {
                HolidayPage.exceptionDataSourceManager.addRowData(HolidayPage.editException);
                HolidayPage.holidayBatchDialog.dialog("close");
            }
        );
    },
    onAddHolidayClick: function (e) {
        HolidayPage.holidayEditDataSourceManager.addRowData({});
    },
    onAddExceptionClick: function (e) {
        HolidayPage.action = Action.Add;
        HolidayPage.editException = {};
        $("#calendar").val("");
        $("#exceptionMemo").val("");
        HolidayPage.exceptionDialog.dialog({title: i18n.t("function.addException")});
        HolidayPage.exceptionDialog.dialog("open");
    },
    onSaveHolidayClick: function (e) {
        HolidayPage.editHoliday.begin_date = $("#begin_date").val();
        HolidayPage.editHoliday.end_date = $("#end_date").val();
        HolidayPage.editHoliday.holidayMemo = $("#holidayMemo").val();
        if (HolidayPage.action == Action.Add) {
            HolidayPage.holidayRequest.json("/insertHoliday", HolidayPage.editHoliday)
                .done(function (data, status, xhr) {
                    HolidayPage.holidayDataSourceManager.addRowData(HolidayPage.editHoliday);
                    HolidayPage.holidayDialog.dialog("close");
                }
            );
        } else if (HolidayPage.action == Action.Edit) {
            HolidayPage.holidayRequest.json("/updateHoliday", HolidayPage.editHoliday)
                .done(function (data, status, xhr) {
                    HolidayPage.holidayDataSourceManager.updateRowData(HolidayPage.editHoliday);
                    HolidayPage.holidayDialog.dialog("close");
                }
            );
        }
    },
    onSaveExceptionClick: function (e) {
        HolidayPage.editException.calendar = $("#calendar").val();
        HolidayPage.editException.exceptionMemo = $("#exceptionMemo").val();
        if (HolidayPage.action == Action.Add) {
            HolidayPage.holidayRequest.json("/insertHoliday", HolidayPage.editException)
                .done(function (data, status, xhr) {
                    HolidayPage.exceptionDataSourceManager.addRowData(HolidayPage.editException);
                    HolidayPage.exceptionDialog.dialog("close");
                }
            );
        } else if (HolidayPage.action == Action.Edit) {
            HolidayPage.holidayRequest.json("/updateHoliday", HolidayPage.editException)
                .done(function (data, status, xhr) {
                    HolidayPage.exceptionDataSourceManager.updateRowData(HolidayPage.editException);
                    HolidayPage.exceptionDialog.dialog("close");
                }
            );
        }
    },
    setExchange: function (list) {
        var exchange_id = $("#exchange_id");
        var options = "";
        for (var i = 0, count = list.length; i < count; i++) {
            options += SelectTool.getOptionHtml(list[i].exchange_id);
        }
        exchange_id.html(options);
        exchange_id.change();
    },
    setSymbol: function (list) {
        var main_symbol_id = $("#main_symbol_id");
        var options = "";
        for (var i = 0, count = list.length; i < count; i++) {
            options += SelectTool.getOptionHtml(list[i]);
        }
        main_symbol_id.html(options);
        main_symbol_id.change();
    },
    fakeGoods: [
        {
            exchange_id: "1GCC",
            main_symbol: ["*"]
        },
        {
            exchange_id: "2GCC",
            main_symbol: ["ABC", "DEF"]
        }
    ]
};
$(document).ready(function () {
    HolidayPage.holidayTable = ReportTable.createNew("userTable");
    HolidayPage.holidayDataSourceManager = DataSourceManager.createNew(false);
    HolidayPage.holidayDataSourceManager.addRenderer(HolidayPage.holidayTable);

    HolidayPage.holidayEditTable = ReportTable.createNew("holidayEditTable");
    HolidayPage.holidayEditDataSourceManager = DataSourceManager.createNew(false);
    HolidayPage.holidayEditDataSourceManager.addRenderer(HolidayPage.holidayEditTable);

    HolidayPage.exceptionTable = ReportTable.createNew("roleTable");
    HolidayPage.exceptionDataSourceManager = DataSourceManager.createNew(false);
    HolidayPage.exceptionDataSourceManager.addRenderer(HolidayPage.exceptionTable);

    HolidayPage.holidayDialog = $("#holidayDialog");
    HolidayPage.holidayDialog.dialog(Config.Dialog);
    HolidayPage.holidayBatchDialog = $("#holidayBatchDialog");
    HolidayPage.holidayBatchDialog.dialog(Config.Dialog);
    HolidayPage.holidayBatchDialog.dialog("option", "width", "500");

    HolidayPage.exceptionDialog = $("#exceptionDialog");
    HolidayPage.exceptionDialog.dialog(Config.Dialog);

    HolidayPage.begin_date = $("#begin_date");
    HolidayPage.begin_date.datepicker();
    HolidayPage.end_date = $("#end_date");
    HolidayPage.end_date.datepicker();
    HolidayPage.calendar = $("#calendar");
    HolidayPage.calendar.datepicker();
    //HolidayPage.begin_date.datepicker("option","dateFormat","yymmdd");
    HolidayPage.begin_date.datepicker("option", Config.DatePicker);
    HolidayPage.end_date.datepicker("option", Config.DatePicker);
    HolidayPage.calendar.datepicker("option", Config.DatePicker);

    $("#batchAddHolidayBt").on("click", HolidayPage.onBatchAddHolidayClick);
    $("#batchSaveHolidayBt").on("click", HolidayPage.onBatchSaveHolidayClick);
    $("#addHolidayBt").on("click", HolidayPage.onAddHolidayClick);
    $("#addExceptionBt").on("click", HolidayPage.onAddExceptionClick);
    $("#saveHoliday").on("click", HolidayPage.onSaveHolidayClick);


    HolidayPage.begin_date.datepicker("option", "onClose", function (selectedDate) {
        HolidayPage.end_date.datepicker("option", "minDate", selectedDate);
    });
    HolidayPage.end_date.datepicker("option", "onClose", function (selectedDate) {
        HolidayPage.begin_date.datepicker("option", "maxDate", selectedDate);
    });

    $("#exchange_id").on("change", HolidayPage.onExchangeChange);
    $("#main_symbol_id").on("change", HolidayPage.onSymbolChange);

    HolidayPage.getGoodsList();
});