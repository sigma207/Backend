/**
 * Created by user on 2015/8/24.
 */

backendApp.controller("LoginController", LoginController);
function LoginController($scope, $translatePartialLoader, $translate, $log, $modal, LoginService) {
    $scope.loginUser = {
        login_id:"superAdmin",
        password:"123"
    };
    $scope.login = function () {
        LoginService.post($scope.loginUser).then(function (data) {
            $scope.onLogin (data);
        });
    }
}