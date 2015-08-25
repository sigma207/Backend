/**
 * Created by user on 2015/8/24.
 */

backendApp.controller("LoginController", LoginController);
function LoginController($scope, $translatePartialLoader, $translate, $log, LoginService, OrganizationService) {
    $scope.loginUser = {
        login_id:"superAdmin",
        password:"123"
    };
    $scope.login = function () {
        LoginService.post($scope.loginUser).then(function (user) {
            if(user.organization_id!=0){
                OrganizationService.one(user.organization_id).get().then(function (organization) {
                    user.organization = organization;
                });
            }else{
                $scope.onLogin(user);
            }
        });
    }
}