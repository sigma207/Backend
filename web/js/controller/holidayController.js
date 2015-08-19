/**
 * Created by user on 2015/8/9.
 */
backendApp.controller("HolidayController", HolidayController);
function HolidayController($scope, $translatePartialLoader, $translate, $log, $modal, ExchangeService, request) {
    $translatePartialLoader.addPart("holiday");
    $translate.refresh();

    $scope.exchangeChange = function () {
        $scope.selectedMainSymbol = $scope.selectedExchange.mainSymbolList[0];
        $scope.mainSymbolChange();
    };

    $scope.mainSymbolChange = function () {
        $scope.getHoliday();
        $scope.getException();
    };

    $scope.getExchangeList = function () {
        ExchangeService.query({},{}, function (data) {
            $scope.exchangeList = data;
            $scope.selectedExchange = $scope.exchangeList[0];
            $scope.exchangeChange();
        });
    };

    $scope.getHoliday = function () {
        request.json("/holiday/select", $scope.selectedMainSymbol).
            success(function (data, status, headers, config) {
                for(var i= 0,count=data.length;i<count;i++){
                    DateTool.yyyyMMddToDate(data[i],"begin_date","beginDate");
                    DateTool.yyyyMMddToDate(data[i],"end_date","endDate");
                }
                $scope.holidayCollection = data;
                $log.info($scope.holidayCollection);
            }
        );
    };

    $scope.getException = function () {
        request.json("/holidayException/select", $scope.selectedMainSymbol).
            success(function (data, status, headers, config) {
                for(var i= 0,count=data.length;i<count;i++){
                    DateTool.yyyyMMddToDate(data[i],"calendar","calendarDate");
                }
                $scope.exceptionCollection = data;
                $log.info($scope.exceptionCollection);
            }
        );
    };

    $scope.removeHolidayClick = function (row) {
        request.json("/holiday/delete", row).
            success(function (data, status, headers, config) {
                $scope.getHoliday();
            }
        );
    };

    $scope.removeExceptionClick = function (row) {
        request.json("/holidayException/delete", row).
            success(function (data, status, headers, config) {
                $scope.getException();
            }
        );
    };

    $scope.editHolidayClick = function (row) {
        $scope.modalTitle = $translate.instant("editHoliday");
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'holidayEdit.html',
            controller: 'holidayEditCtrl',
            size: $scope.editSize,
            resolve: {
                title: function () {
                    return $scope.modalTitle;
                },
                editObj: function () {
                    return angular.copy(row);
                }
            }
        });

        modalInstance.result.then(
            function () {
                $scope.getHoliday();
            },
            function () {
                //$log.info('Modal dismissed at: ' + new Date());
            }
        )
    };

    $scope.editExceptionClick = function (row) {
        $scope.modalTitle = $translate.instant("editException");
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'exceptionEdit.html',
            controller: 'exceptionEditCtrl',
            size: $scope.editSize,
            resolve: {
                title: function () {
                    return $scope.modalTitle;
                },
                editObj: function () {
                    return angular.copy(row);
                }
            }
        });

        modalInstance.result.then(
            function () {
                $scope.getException();
            },
            function () {
                //$log.info('Modal dismissed at: ' + new Date());
            }
        )
    };

    $scope.batchAddHolidayClick = function () {
        //$scope.editSize = "lg";
        $scope.modalTitle = $translate.instant("addHoliday");
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'batchHoliday.html',
            controller: 'batchHolidayCtrl',
            size: $scope.editSize,
            resolve: {
                title: function () {
                    return $scope.modalTitle;
                },
                mainSymbol: function () {
                    return $scope.selectedMainSymbol;
                }
            }
        });

        modalInstance.result.then(
            function () {
                $scope.getHoliday();
            },
            function () {
                //$log.info('Modal dismissed at: ' + new Date());
            }
        )
    };

    $scope.batchAddExceptionClick = function () {
        $scope.modalTitle = $translate.instant("addException");
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'batchException.html',
            controller: 'batchExceptionCtrl',
            size: $scope.editSize,
            resolve: {
                title: function () {
                    return $scope.modalTitle;
                },
                mainSymbol: function () {
                    return $scope.selectedMainSymbol;
                }
            }
        });

        modalInstance.result.then(
            function () {
                $scope.getException();
            },
            function () {
                //$log.info('Modal dismissed at: ' + new Date());
            }
        )
    };

    $scope.getExchangeList();
}

backendApp.controller("holidayEditCtrl", function ($scope, $modalInstance, $log, request, title, editObj) {
    $scope.title = title;
    $scope.editObj = editObj;
    $log.info(editObj);
    $scope.save = function () {
        DateTool.dateToYyyyMMdd($scope.editObj,"beginDate","begin_date");
        DateTool.dateToYyyyMMdd($scope.editObj,"endDate","end_date");
        $log.info(editObj);
        request.json("/holiday/update", $scope.editObj).
            success(function (data, status, headers, config) {
                $modalInstance.close(data);
            }
        );
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

backendApp.controller("exceptionEditCtrl", function ($scope, $modalInstance, $log, request, title, editObj) {
    $scope.title = title;
    $scope.editObj = editObj;
    $log.info($scope.editObj);
    $scope.save = function () {
        DateTool.dateToYyyyMMdd($scope.editObj,"calendarDate","calendar");
        request.json("/holidayException/update", $scope.editObj).
            success(function (data, status, headers, config) {
                $modalInstance.close(data);
            }
        );
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

backendApp.controller('batchHolidayCtrl', function ($scope, $modalInstance, $log, request, title, mainSymbol) {
    $scope.title = title;

    $scope.init = function () {
        $scope.rowCollection = [];
        $scope.addRow();
    };

    $scope.getNewRow = function () {
        return {
            exchange_id:mainSymbol.exchange_id,
            main_symbol_id:mainSymbol.main_symbol_id
        };
    };

    $scope.addClick = function (index,row) {
        $scope.addRow();
    };

    $scope.deleteClick = function (index,row) {
        $scope.rowCollection.splice(index, 1);
        if($scope.rowCollection.length==0){
            $scope.addRow();
        }
    };

    $scope.addRow = function () {
        $scope.rowCollection.push($scope.getNewRow());
    };

    $scope.save = function () {
        for(var i= 0,count = $scope.rowCollection.length;i<count;i++){
            DateTool.dateToYyyyMMdd($scope.rowCollection[i],"beginDate","begin_date");
            DateTool.dateToYyyyMMdd($scope.rowCollection[i],"endDate","end_date");
        }
        $log.info("save");
        $log.info($scope.rowCollection);
        request.json("/holiday/insert", $scope.rowCollection).
            success(function (data, status, headers, config) {
                $modalInstance.close(data);
            }
        );
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

backendApp.controller('batchExceptionCtrl', function ($scope, $modalInstance, $log, request, title, mainSymbol) {
    $scope.title = title;

    $scope.init = function () {
        $scope.rowCollection = [];
        $scope.addRow();
    };

    $scope.getNewRow = function () {
        return {
            exchange_id:mainSymbol.exchange_id,
            main_symbol_id:mainSymbol.main_symbol_id
        };
    };

    $scope.addClick = function (index,row) {
        $scope.addRow();
    };

    $scope.deleteClick = function (index,row) {
        $scope.rowCollection.splice(index, 1);
        if($scope.rowCollection.length==0){
            $scope.addRow();
        }
    };

    $scope.addRow = function () {
        $scope.rowCollection.push($scope.getNewRow());
    };

    $scope.save = function () {
        for(var i= 0,count = $scope.rowCollection.length;i<count;i++){
            DateTool.dateToYyyyMMdd($scope.rowCollection[i],"calendarDate","calendar");
        }
        request.json("/holidayException/insert", $scope.rowCollection).
            success(function (data, status, headers, config) {
                $modalInstance.close(data);
            }
        );
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});