/**
 * Created by user on 2015/8/9.
 */
backendApp.controller("HolidayController", HolidayController);
function HolidayController($scope, $translatePartialLoader, $translate, $log, $modal, request) {
    $translatePartialLoader.addPart("holiday");
    $translate.refresh();
    $scope.testDate = new Date();
    $scope.status = {
        opened: false
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.open = function ($event) {
        $log.info("open");
        $scope.status.opened = true;
    };
    $scope.formats = ['yyyyMMdd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.fakeGoods = [
        {
            exchange_id: "1GCC",
            main_symbol: ["*"]
        },
        {
            exchange_id: "2GCC",
            main_symbol: ["ABC", "DEF"]
        }
    ];
    $scope.exchangeList = $scope.fakeGoods;
    $scope.selectedExchange = undefined;
    $scope.selectedMainSymbol = undefined;

    $scope.holidayGridOptions = {};
    $scope.holidayGridOptions.enableHorizontalScrollbar = 0;
    $scope.holidayGridOptions.columnDefs = [
        {field: 'exchange_id', displayName: 'exchangeId', headerCellFilter: 'translate'},
        {field: 'main_symbol_id', displayName: 'mainSymbolId', headerCellFilter: 'translate'},
        {field: 'begin_date', displayName: 'beginDate', headerCellFilter: 'translate'},
        {field: 'end_date', displayName: 'endDate', headerCellFilter: 'translate'},
        {field: 'memo', displayName: 'memo', headerCellFilter: 'translate'}
    ];

    $scope.exceptionGridOptions = {};
    $scope.exceptionGridOptions.enableHorizontalScrollbar = 0;
    $scope.exceptionGridOptions.columnDefs = [
        {field: 'exchange_id', displayName: 'exchangeId', headerCellFilter: 'translate'},
        {field: 'main_symbol_id', displayName: 'mainSymbolId', headerCellFilter: 'translate'},
        {field: 'calendar', displayName: 'calendar', headerCellFilter: 'translate'},
        {field: 'memo', displayName: 'memo', headerCellFilter: 'translate'}
    ];


    $scope.exchangeChange = function () {
        $scope.selectedMainSymbol = $scope.selectedExchange.main_symbol[0];
    };

    $scope.mainSymbolChange = function () {
        HolidayPage.getHoliday();
        HolidayPage.getException();
    };

    $scope.getHoliday = function () {

    };

    $scope.getException = function () {

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
                }
            }
        });

        modalInstance.result.then(
            function () {
                //$scope.getUserList();
            },
            function () {
                //$log.info('Modal dismissed at: ' + new Date());
            }
        )
    };
}

backendApp.controller('batchHolidayCtrl', function ($scope, $modalInstance, $log, $timeout, request, title) {
    $scope.title = title;

    $scope.init = function () {
        $scope.rowCollection = [];
        $scope.addHoliday();
    };

    $scope.getHoliday = function () {
        return {begin_date: new Date(), end_date: new Date(), memo: "abc"};
    };

    $scope.beginDateButtonClick = function (row) {
        row.beginDateOpened = true;
    };
    $scope.endDateButtonClick = function (row) {
        row.endDateOpened = true;
    };

    $scope.addClick = function (index,row) {
        $scope.addHoliday();
    };

    $scope.deleteClick = function (index,row) {
        $scope.rowCollection.splice(index, 1);
        if($scope.rowCollection.length==0){
            $scope.addHoliday();
        }
    };

    $scope.addHoliday = function () {
        $scope.rowCollection.push($scope.getHoliday());
    };

    $scope.save = function () {
        $log.info($scope.rowCollection);
        //var list = $scope.gridApi.selection.getSelectedRows();
        //$scope.editObj.userRoleList = [];
        //for(var i= 0,count=list.length;i<count;i++){
        //    $scope.editObj.userRoleList.push({login_id: $scope.editObj.login_id, role_id: list[i].role_id});
        //}
        //request.json("/user/allocateUserRole", $scope.editObj).
        //    success(function (data, status, headers, config) {
        //        $modalInstance.close(data);
        //    }
        //);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});