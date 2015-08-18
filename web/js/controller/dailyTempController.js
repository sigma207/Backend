/**
 * Created by user on 2015/8/17.
 */
backendApp.controller("DailyTempController", DailyTempController);
function DailyTempController($scope, $translatePartialLoader, $translate, $log, $filter, $modal, SymbolTradableDailyService, request) {
    $translatePartialLoader.addPart("dailyTemp");
    $translate.refresh();

    $scope.exchangeChange = function () {
        $scope.selectedMainSymbol = $scope.selectedExchange.mainSymbolList[0];
        $scope.mainSymbolChange();
    };

    $scope.mainSymbolChange = function () {
        $log.info($scope.selectedMainSymbol.exchange_id);
        $log.info($scope.selectedMainSymbol.main_symbol_id);
        SymbolTradableDailyService.queryByMainSymbol({
            exchange_id:$scope.selectedMainSymbol.exchange_id,
            main_symbol_id:$scope.selectedMainSymbol.main_symbol_id},{},function (data) {
            //for(var i= 0,count=data.length;i<count;i++){
            //    if(i%2==0)data[i].tradable = 1;
            //}
            //$log.info(data);
            $scope.rowCollection = data;
            $scope.displayedCollection = [].concat($scope.rowCollection);
        });
        //$scope.getHoliday();
        //$scope.getException();
    };

    $scope.getExchangeList = function () {
        request.http({
            method: "GET",
            url: "/mainSymbol/select"
        }).success(function (data, status, headers, config) {
            $scope.exchangeList = data;
            $scope.selectedExchange = $scope.exchangeList[0];
            $scope.exchangeChange();
        });
    };

    $scope.saveClick = function () {
        $log.info($scope.displayedCollection);
        var xx = $filter('filter')($scope.rowCollection, function (item) {
            return item.tradable===1;
        });
        $log.info(xx);
    };

    //SymbolTradableDailyService.query(function (data) {
    //    $scope.rowCollection = data;
    //});

    $scope.getExchangeList();
}