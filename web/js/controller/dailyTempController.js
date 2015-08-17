/**
 * Created by user on 2015/8/17.
 */
backendApp.controller("DailyTempController", DailyTempController);
function DailyTempController($scope, $translatePartialLoader, $translate, $log, $modal, SymbolTradableDailyService, request) {
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

    //SymbolTradableDailyService.query(function (data) {
    //    $scope.rowCollection = data;
    //});

    $scope.getExchangeList();
}