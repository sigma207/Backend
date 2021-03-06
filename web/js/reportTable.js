/**
 * Created by user on 2015/5/12.
 */

var ReportTable = {
    TD_CLASS_RENDERER: "tdClassRenderer",
    createNew: function (tableClass) {
        var dt = DataSourceRenderer.createNew();//dragTable
        dt.tableClass = tableClass;
        dt.$table = $("." + dt.tableClass);
        dt.pkey = dt.$table.attr("pkey");
        dt.$headTr = dt.$table.find("thead>tr");
        dt.$thArrowDiv;
        /**
         * The temporary array of all thObj, It will be use when generateTr().
         * In order to reduce DOM operation.
         * @type {Array}
         */
        dt.thObjList = [];
        dt.trList;
        dt.debug = false;
        dt.eventLogEnable = false;
        //dt.dragImgElement;
        dt.dragIndex = -1;
        dt.dropIndex = -1;
        //dt.data = [];
        //dt.dataSize = 0;
        dt.columnSize = 0;
        dt.columnFields = [];
        dt.renderTBody = "";
        dt.tdClassRenderers = {};
        dt.selectedMap = {};
        dt.selectedKey = {};
        dt.keepSelected = true;

        dt.DRAG_OVER_CLASS = "dragOverColumn";
        dt.BASIC_TH_CLASS = "basicTH";
        dt.ORDER_BY = "orderBy";
        dt.DESC = "desc";
        dt.ASC = "asc";
        dt.COLUMN_TYPE = "type";
        dt.DECIMAL = "decimal";
        dt.FIELD = "field";
        dt.TD_CLASS = "tdClass";
        dt.TEMPLATE_CLASS = "templateClass";
        dt.TEMPLATE_HTML = "templateHtml";
        dt.ARROW_DIV = "arrowDiv";
        dt.DESC_ARROW = "descArrow";
        dt.ASC_ARROW = "ascArrow";
        dt.DATA_DATE_FORMATE = "YYYYMMDD";
        dt.DISPLAY_DATE_FORMATE = "YYYY-MM-DD";
        dt.DATA_TIME_FORMATE = "HHmmss";
        dt.DISPLAY_TIME_FORMATE = "HH:mm:ss";

        //dt.dsr = null;
        //dt.setReportDataManager = function (rdm) {
        //    dt.dsr = rdm;
        //};

        dt.checkHeadBody = function () {
            if (dt.$table.find("thead").length == 0) {
                dt.$table.append("<thead><tr></tr></thead>");
            }
            if (dt.$table.find("tbody").length == 0) {
                dt.$table.append("<tbody></tbody>");
            }
        };

        dt.initTHead = function () {
            dt.initColumnField();
            var $th;
            var field;
            for (var colIndex = 0; colIndex < dt.columnSize; colIndex++) {
                $th = dt.getThByIndex(colIndex);
                if (typeof($th.attr(dt.COLUMN_TYPE)) == "undefined") {
                    $th.attr(dt.COLUMN_TYPE, "text");
                }
                $th.attr(dt.ORDER_BY, "");
                //$th.addClass(dt.BASIC_TH_CLASS);
                //append the arrow div for sort
                $th.append("<div class='" + dt.ARROW_DIV + "'></div>");
                field = $th.attr(dt.FIELD);
                if (field) {
                    $th.on("click", dt.sortColumnClick);
                }
            }
            dt.$thArrowDiv = dt.$headTr.find("th>." + dt.ARROW_DIV);
            //add event listener for drag&down
            var thList = dt.getThList();
            thList.attr("draggable", true);
            thList.on("dragstart", dt.dragStart);
            thList.on("dragenter", dt.dragEnter);
            thList.on("dragleave", dt.dragLeave);
            thList.on("dragover", dt.dragOver);
            thList.on("dragend", dt.dragEnd);
            thList.on("drop", dt.drop);
        };

        dt.initColumnField = function () {
            var $th;
            var thList = dt.getThList();
            dt.columnSize = thList.length;
            dt.columnFields = [];
            for (var colIndex = 0; colIndex < dt.columnSize; colIndex++) {
                $th = dt.getThByIndex(colIndex);
                dt.columnFields.push($th.attr(dt.FIELD));
            }
        };

        /**
         * To save attribute of th, it will be use when generateTd().
         * @param $th
         * @returns {{th: *, type: *, decimal: (*|number), field: *, stockChangeColorField: *, orderBy: *, display: *, arrowDiv: (*|{}), externalClass: *}}
         */
        dt.thObject = function ($th) {
            var thObj = {
                "th": $th,
                "type": $th.attr(dt.COLUMN_TYPE),
                "decimal": $th.attr(dt.DECIMAL) || 0,
                "field": $th.attr(dt.FIELD),
                "orderBy": $th.attr(dt.ORDER_BY),
                "display": $th.css("display"),
                "arrowDiv": $th.find(dt.ARROW_DIV),
                "externalClass": $th.attr(dt.TD_CLASS),
                "templateClass": $th.attr(dt.TEMPLATE_CLASS)
            };
            thObj[ReportTable.TD_CLASS_RENDERER] = $th.attr(ReportTable.TD_CLASS_RENDERER);
            if (typeof thObj[dt.TEMPLATE_CLASS] !== typeof undefined) {
                thObj[dt.TEMPLATE_HTML] = $("." + thObj[dt.TEMPLATE_CLASS]).html();
                //console.log("html=%s", thObj[dt.TEMPLATE_HTML]);
            }
            var format = "";
            var originalFormat = "";
            var dateTimeFormat = "";
            var digit = "";
            switch (thObj.type) {
                case "rate":
                    format = "%";
                //break;
                case "number":
                    if (JsonTool.isInt(parseInt(thObj.decimal))) {
                        for (var i = 0; i < thObj.decimal; i++) {
                            digit += "0";
                        }
                        format = "0,0." + digit + format;
                    }
                    break;
                case "date":
                    originalFormat = dt.DATA_DATE_FORMATE;
                    dateTimeFormat = dt.DISPLAY_DATE_FORMATE;
                    break;
                case "time":
                    originalFormat = dt.DATA_TIME_FORMATE;
                    dateTimeFormat = dt.DISPLAY_TIME_FORMATE;
                    break;
            }
            thObj.format = format;
            thObj.originalFormat = originalFormat;
            thObj.dateTimeFormat = dateTimeFormat;
            return thObj;
        };

        /**
         * refresh thObjList, make sure the thObjList have latest th attribute
         */
        dt.refreshThObjList = function () {
            dt.thObjList = [];
            var thList = dt.getThList();
            thList.each(function (i) {
                dt.thObjList.push(dt.thObject($(this)));
            });
        };

        //dt.setDataSource = function (newData) {
        //    dt.data = newData;
        //    dt.dataSize = dt.data.length;
        //    dt.renderDom();
        //};

        dt.setReportColumns = function (columns, types) {
            dt.$headTr.empty();
            var template = "";

            for (var i = 0; i < columns.length; i++) {
                template += "<th";
                template += " " + dt.FIELD + "='column" + i + "' " + dt.COLUMN_TYPE + "='" + types[i] + "'>" + columns[i];
                template += "</th>";
            }

            $("." + tableClass + ">thead>tr").html(template);
            dt.$table = $("." + dt.tableClass);
            dt.$headTr = dt.$table.find("thead>tr");
            dt.initTHead();
        };

        /**
         * Getting the th list.
         * @returns JQuery list
         */
        dt.getThList = function () {
            return dt.$headTr.children();
        };

        /**
         * Getting the th by Index.
         * @param index
         * @returns JQuery object
         */
        dt.getThByIndex = function (index) {
            return dt.getThList().eq(index);
        };

        /**
         * Getting the list of th and td by colIndex.
         * @param index
         * @returns  JQuery list
         */
        dt.getColumn = function (index) {
            return dt.$table.find("tr>th:nth-child(" + (index + 1) + "), tr>td:nth-child(" + (index + 1) + ")");
        };

        /**
         * ------------------------------------------------------------------
         * Operate Column
         * ------------------------------------------------------------------
         */
        dt.swapColumn = function () {
            if (dt.dropIndex != dt.dragIndex) {
                var $dragColumn = dt.getColumn(dt.dragIndex);
                var $dropColumn = dt.getColumn(dt.dropIndex);
                $dragColumn.each(function (i) {
                    DomTool.swapElements($(this)[0], $dropColumn.get(i));
                });
                dt.initColumnField();
            }
        };

        dt.sortColumnClick = function (e) {
            if (dt.dataSize > 0) {
                dt.sortOrderBy($(this).index(), true);
            }
        };

        /**
         * @param sortIndex
         * @param changeOrderBy
         */
        dt.sortOrderBy = function (sortIndex, changeOrderBy) {
            dt.keepSelected = false;
            var $th = dt.getThByIndex(sortIndex);
            var currentOrderBy = $th.attr(dt.ORDER_BY);
            currentOrderBy = (currentOrderBy == dt.ASC || currentOrderBy == "") ? dt.ASC : dt.DESC;
            if (changeOrderBy) {
                currentOrderBy = (currentOrderBy == dt.ASC) ? dt.DESC : dt.ASC;
            }
            dt.dsr.sortData(sortIndex, $th.attr(dt.FIELD), currentOrderBy, $th.attr(dt.COLUMN_TYPE));
        };

        dt.clearSortColumn = function () {
            var thList = dt.getThList();
            //remove all arrow class
            dt.$thArrowDiv.removeClass(dt.DESC_ARROW);
            dt.$thArrowDiv.removeClass(dt.ASC_ARROW);
            thList.attr(dt.ORDER_BY, "");//empty 'orderBy' attribute of all th
        };

        dt.updateSortColumn = function (sortIndex, orderBy) {
            dt.clearSortColumn();
            //var thList = dt.getThList();
            var $th = dt.getThByIndex(sortIndex);
            var arrowDiv = $th.find("." + dt.ARROW_DIV);
            //remove all arrow class
            //dt.$thArrowDiv.removeClass(dt.DESC_ARROW);
            //dt.$thArrowDiv.removeClass(dt.ASC_ARROW);


            if (orderBy == dt.ASC) {
                arrowDiv.addClass(dt.ASC_ARROW);
            } else {
                arrowDiv.addClass(dt.DESC_ARROW);
            }
            //thList.attr(dt.ORDER_BY, "");//empty 'orderBy' attribute of all th
            $th.attr(dt.ORDER_BY, orderBy);//set 'orderBy' attribute of this th
        };
        /**
         * ------------------------------------------------------------------
         * Render TBody
         * ------------------------------------------------------------------
         */
        dt.addTdClassRenderer = function (funcName, func) {
            dt.tdClassRenderers[funcName] = func;
        };

        dt.render = function () {
            //console.time("renderDom");
            dt.refreshThObjList();//refresh thObjList
            dt.renderTBody = "";
            var count = 0;
            var tableRowCount = dt.dsr.getRenderRowCount();
            for (var rowIndex = dt.dsr.getRowStartIndex(); rowIndex < dt.dataSize; rowIndex++) {
                dt.renderTBody += dt.generateTr(rowIndex);
                if (dt.dsr.usePage)count++;
                if (count >= tableRowCount) {
                    break;
                }
            }
            //fill empty tr for page
            if (dt.dsr.usePage && count < tableRowCount) {
                while (count < tableRowCount) {
                    dt.renderTBody += dt.generateTr(rowIndex++);
                    count++;
                }
            }

            dt.$table.find("tbody").html(dt.renderTBody);
            dt.trList = dt.$table.find("tbody").children();
            dt.trList.each(function (index) {
                var tr = $(this);
                var rowIndex = tr.attr("rowIndex");
                tr.click(dt.onRowClick);
                dt.initTr(tr, rowIndex, dt.data[rowIndex]);
            });

            dt.initSelected();
            //console.timeEnd("renderDom");
        };

        dt.initTr = function (tr, rowIndex, rowData) {
            var baseInputs = tr.find(".baseInput");
            baseInputs.each(function (i) {
                var input = $(this);
                var name = input.attr("name");
                input.on("change", onInputChange);

                if (rowData.hasOwnProperty(name)) {
                    input.val(rowData[name]);
                }
                function onInputChange(e) {
                    rowData[name] = input.val();
                    console.log("onBaseInputChange");
                }
            });
            var dateInputs = tr.find(".dateInput");
            dateInputs.each(function (i) {
                var input = $(this);
                input.datepicker();
                input.datepicker("option", Config.DatePicker);
                var name = input.attr("name");
                input.on("change", onInputChange);
                if (rowData.hasOwnProperty(name)) {
                    input.datepicker("setDate", rowData[name]);
                }
                if (input.hasClass("startDate")) {
                    var startDate = input;
                    var endDate = dateInputs.filter(".endDate").eq(0);
                    startDate.datepicker("option", "onClose", selectBeginDate);
                    endDate.datepicker("option", "onClose", selectEndDate);
                }
                function onInputChange(e) {
                    rowData[name] = $.datepicker.formatDate("yymmdd", input.datepicker("getDate"));
                }

                function selectBeginDate(selectedDate) {
                    endDate.datepicker("option", "minDate", selectedDate);
                }

                function selectEndDate(selectedDate) {
                    startDate.datepicker("option", "maxDate", selectedDate);
                }

            });
            var deleteImgs = tr.find(".rowDeleteImg");
            deleteImgs.each(function (i) {
                var img = $(this);
                img.on("click", function (e) {
                    dt.dsr.removeRow(rowIndex);
                });
            });
            var tableSelectCheckBoxes = tr.find("tableSelectCheckbox");
            tableSelectCheckBoxes.each(function (i) {
                var checkbox = $(this);
                checkbox.on("change", dt.onRowSelectChange);
            })
        };

        dt.initSelected = function () {
            //var tableSelectCheckbox = dt.$table.find(".tableSelectCheckbox");
            //tableSelectCheckbox.on("change", dt.onRowSelectChange);
            if (dt.keepSelected) {
                dt.selectedMap = {};
                dt.selectedKey = {};
            } else {
                var rowPKeyValue = undefined;
                for (var rowIndex = 0; rowIndex < dt.dataSize; rowIndex++) {
                    rowPKeyValue = dt.data[rowIndex][dt.pkey];
                    if (dt.selectedKey.hasOwnProperty(rowPKeyValue)) {
                        dt.selectRow(rowIndex, true);
                    }
                }
            }
            dt.keepSelected = true;
        };

        dt.clearSelected = function () {
            dt.selectedMap = {};
            dt.selectedKey = {};
            var tableSelectCheckbox = dt.$table.find(".tableSelectCheckbox");
            tableSelectCheckbox.prop("checked", false);
        };

        dt.renderRow = function (rowIndex) {
            var tr = dt.generateTr(rowIndex);
            dt.trList.filter("[rowIndex="+rowIndex+"]").replaceWith(tr);
            //dt.trList.eq(index).replaceWith(tr);
            dt.trList = dt.$table.find("tbody").children();

            //tr = dt.trList.eq(index);
            tr = dt.trList.filter("[rowIndex="+rowIndex+"]");
            tr.click(dt.onRowClick);
            dt.initTr(tr, rowIndex, dt.data[rowIndex]);
        };

        dt.onRowClick = function (e) {
            var tr = e.currentTarget;
            var tableClass = dt.tableClass;
            var rowIndex = $(tr).attr("rowIndex");
            var rowData = dt.data[rowIndex];
            var obj = {
                clickEvent: e,
                tableClass: tableClass,
                rowIndex: rowIndex,
                rowData: rowData
            };
            dt.$table.trigger("rowClick", [obj]);
        };

        dt.onRowSelectChange = function (e) {
            var rowIndex = $(this).closest("tr").attr("rowIndex");
            //var name = $(this).attr("name");
            dt.select(rowIndex, $(this).is(':checked'));
        };

        dt.select = function (rowIndex, selected) {
            var rowData = dt.data[rowIndex] || {};
            var pKeyValue = rowData[dt.pkey];
            if (selected) {
                dt.selectedMap[rowIndex] = rowData;
                dt.selectedKey[pKeyValue] = rowIndex;
            } else {
                delete dt.selectedMap[rowIndex];
                delete dt.selectedKey[pKeyValue];
            }
        };

        dt.selectRow = function (rowIndex, selected) {
            dt.select(rowIndex, selected);
            var tr = dt.trList.filter("[rowIndex=" + rowIndex + "]");
            tr.find(".tableSelectCheckbox").prop("checked", true);
        };

        dt.getSelectedData = function () {
            var list = [];
            for (var rowIndex in dt.selectedMap) {
                list.push(dt.selectedMap[rowIndex]);
            }
            return list;
        };

        dt.generateTr = function (rowIndex) {
            var tr = "<tr rowIndex='" + rowIndex + "'>";
            var thObj;
            var rowData = dt.data[rowIndex] || {};
            for (var colIndex = 0; colIndex < dt.columnSize; colIndex++) {
                thObj = dt.thObjList[colIndex];
                tr += dt.generateTd(thObj, rowIndex, colIndex, rowData);
            }
            tr += "</tr>";
            return tr;
        };

        dt.generateTd = function (thObj, rowIndex, colIndex, rowData) {
            var tdClass = dt.generateTdClass(thObj, rowData);
            var tdStyle = dt.generateStyle(thObj.display);
            var tdContent = "";
            if (typeof thObj[dt.TEMPLATE_HTML] === typeof undefined) {
                tdContent = dt.generateValue(thObj, rowData);
            } else {
                tdContent = dt.generateByTemplate(thObj, rowIndex, rowData);
            }

            return "<td" + tdClass + tdStyle + ">" + tdContent + "</td>";
        };

        dt.generateTdClass = function (thObj, rowData) {
            var type = thObj[dt.COLUMN_TYPE];
            var externalClass = thObj.externalClass;

            var tdClass = "";
            if (type == "number" || type == "rate" || type == "date" || type == "time") {
                tdClass += "numberTD";
            } else {
                tdClass += "baseTD";
            }

            var tdClassRenderer = thObj[ReportTable.TD_CLASS_RENDERER];
            if (typeof tdClassRenderer !== typeof undefined && tdClassRenderer !== false) {
                tdClass += " " + dt.tdClassRenderers[tdClassRenderer].call(dt, rowData);
            }

            if (typeof externalClass !== typeof undefined && externalClass !== false) {
                tdClass += " " + externalClass;
            }
            if (tdClass != "") {
                return " class='" + tdClass + "'";
            } else {
                return "";
            }
        };

        dt.generateStyle = function (display) {
            if (display == "none") {
                return " style='display:none'";
            } else {
                return "";
            }
        };

        dt.generateValue = function (thObj, rowData) {
            var value = rowData[thObj.field];

            if (typeof(value) == "undefined") {
                return "&nbsp;"
            } else {
                if (thObj.format != "") {
                    if (thObj.format.indexOf("%") != -1) {
                        value = value / 100;
                    }
                    return numeral(value).format(thObj.format);
                } else if (thObj.dateTimeFormat != "") {
                    return moment(value, thObj.originalFormat).format(thObj.dateTimeFormat);
                } else if (thObj.type == "number" && thObj.format == "") {
                    if (!JsonTool.isInt(thObj.decimal)) {
                        var decimal = rowData[thObj.decimal];
                        var digit = "";
                        for (var i = 0; i < decimal; i++) {
                            digit += "0";
                        }
                        return numeral(value).format("0,0." + digit);
                    }
                } else {
                    return value;
                }
            }
        };

        dt.generateByTemplate = function (thObj, rowIndex, rowData) {
            return thObj[dt.TEMPLATE_HTML];
        };
        /**
         * ------------------------------------------------------------------
         * Drag&Down
         * ------------------------------------------------------------------
         */
        dt.dragStart = function (e) {
            dt.eventLog("dragStart");
            dt.dragIndex = $(this).index();
            e.originalEvent.dataTransfer.setData("text/plain", "anything");

            //dt.dragImgElement = e.originalEvent.target.cloneNode(true);
            //dt.dragImgElement.style.backgroundColor = "red";
            //dt.dragImgElement.style.position = "absolute"; dt.dragImgElement.style.top = "0px"; dt.dragImgElement.style.right = "0px";
            //document.body.appendChild(dt.dragImgElement);
            //e.originalEvent.dataTransfer.setDragImage(dt.dragImgElement, 0, 0);

            e.originalEvent.target.style.opacity = "0.4";
        };

        dt.dragEnter = function (e) {
            dt.eventLog("dragEnter");
            $(this).addClass(dt.DRAG_OVER_CLASS);
        };

        dt.dragLeave = function (e) {
            dt.eventLog("dragLeave");
            $(this).removeClass(dt.DRAG_OVER_CLASS);
        };

        dt.dragOver = function (e) {
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = "move";
            return false;
        };

        dt.dragEnd = function (e) {
            dt.eventLog("dragEnd");
            //原本放在dr.drop(),但如果drop在th以外的地方就不會觸發drop
            dt.getThList().removeClass(dt.DRAG_OVER_CLASS);
            dt.getThList().css("opacity", "1");
            //document.body.removeChild(dt.dragImgElement);
        };

        dt.drop = function (e) {
            dt.eventLog("drop");
            e.preventDefault();
            dt.dropIndex = $(this).index();
            dt.swapColumn();
            return false;
        };
        /**
         * ------------------------------------------------------------------
         * Show&Hide column
         * ------------------------------------------------------------------
         */
        dt.hideColumn = function (index) {
            if (index < dt.columnSize) {
                dt.getColumn(index).hide();
            }
        };

        dt.showColumn = function (index) {
            if (index < dt.columnSize) {
                dt.getColumn(index).show();
            }
        };

        /**
         * ------------------------------------------------------------------
         * Log
         * ------------------------------------------------------------------
         */
        dt.eventLog = function (msg) {
            if (dt.eventLogEnable)
                dt.log(msg);
        };

        dt.log = function (msg) {
            if (dt.debug)
                console.log("dragTable log:" + msg);
        };
        /**
         * ------------------------------------------------------------------
         * Function End
         * ------------------------------------------------------------------
         */

        dt.checkHeadBody();
        if (dt.$headTr.length > 0) {
            dt.initTHead();
        }
        return dt;
    }
};