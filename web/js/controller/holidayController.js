/**
 * Created by user on 2015/8/9.
 */
backendApp.controller("HolidayController", HolidayController);
function HolidayController($scope, $translatePartialLoader, $translate, $log, $modal, request) {
    $translatePartialLoader.addPart("holiday");
    $translate.refresh();
    $scope.fakeGoods= [
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
    $scope.holidayList = [{begin_date:new Date(),end_date:new Date(),memo:"abc"}];

    $scope.init = function() {
        $scope.gridOptions = {};
        $scope.gridOptions.enableHorizontalScrollbar = 0;
        $scope.gridOptions.columnDefs = [
            {name: 'begin_date', displayName: 'beginDate', headerCellFilter: 'translate',  type: 'date', cellFilter: 'date:"yyyy-MM-dd"'},
            {name: 'end_date', displayName: 'endDate', headerCellFilter: 'translate',  type: 'date', cellFilter: 'date:"yyyy-MM-dd"'},
            {name: 'memo', displayName: 'memo', headerCellFilter: 'translate', enableCellEdit: true }
        ];
        $scope.gridOptions.onRegisterApi = function(gridApi){
            //set gridApi on scope
            $scope.gridApi = gridApi;

        };
        $scope.gridOptions.data = $scope.holidayList;
    };

    $scope.save = function () {
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