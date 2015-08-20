/**
 * Created by user on 2015/8/17.
 */
backendApp.controller("DailyTempController", DailyTempController);
function DailyTempController($scope, $translatePartialLoader, $translate, $log, $filter, SymbolTradableDailyTempService, ExchangeService) {
    $translatePartialLoader.addPart("daily");
    $translate.refresh();

    $scope.exchangeChange = function () {
        $scope.selectedMainSymbol = $scope.selectedExchange.mainSymbolList[0];
        $scope.mainSymbolChange();
    };

    $scope.mainSymbolChange = function () {
        $scope.getList();
    };

    $scope.getList = function () {
        var params = {
            exchange_id: $scope.selectedMainSymbol.exchange_id,
            main_symbol_id: $scope.selectedMainSymbol.main_symbol_id
        };
        SymbolTradableDailyTempService.query(params, {}, function (data) {
            $scope.rowCollection = data;
            $scope.displayedCollection = [].concat($scope.rowCollection);
        });
    };

    $scope.getExchangeList = function () {
        ExchangeService.getList().then(function (data) {
            $scope.exchangeList = data;
            $scope.selectedExchange = $scope.exchangeList[0];
            $scope.exchangeChange();
        });
    };

    $scope.saveClick = function () {
        var list = $filter('filter')($scope.rowCollection, function (item) {
            return item.tradable === 1;
        });
        var params = {
            exchange_id: $scope.selectedMainSymbol.exchange_id,
            main_symbol_id: $scope.selectedMainSymbol.main_symbol_id
        };
        SymbolTradableDailyTempService.save(params, list, function (data) {
                $scope.getList();
            }
        );
    };

    $scope.getExchangeList();
}