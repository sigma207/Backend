/**
 * Created by user on 2015/8/13.
 */
function TableCheckbox(){
    return {
        scope: {
            selectedItems: '='
        },
        controller: function ($scope, $compile) {
            //console.log("tableCheckbox controller");
            //console.log($scope);
            var ctrl = this;
            this.itemSelect = function (item,selected) {
                if(selected){
                    if(!ctrl.itemHasBeenSelected(item)){
                        $scope.selectedItems.push(item);
                    }
                } else {
                    var index = $scope.selectedItems.indexOf(item);
                    $scope.selectedItems.splice(index,1);
                }
            };
            this.itemHasBeenSelected = function (item) {
                return ($scope.selectedItems.indexOf(item)!=-1);
            }
        }
    }
}

function RowCheckbox(){
    return {
        template: "<input ng-model='selected' type='checkbox'/>",
        require: "^tableCheckbox",
        scope: {
            row:"=",
            index:"="
        },
        link: function (scope, element, attr, tableCheckboxCtrl) {
            scope.selected = false;
            if(tableCheckboxCtrl.itemHasBeenSelected(scope.row)){
                scope.selected = true;
            }
            element.on('change', function (event) {
                tableCheckboxCtrl.itemSelect(scope.row,scope.selected);
            });
        }
    }
}

function DatePickerOpen($log){
    return{
        scope:{
            open:"=openStatus"
        },
        link: function (scope, element, attr) {
            element.on("click", function (event) {
                scope.open = true;
            });
        }
    }
}

function Focus($timeout){
    return {
        scope : {
            trigger : '@focus'
        },
        link : function(scope, element) {
            scope.$watch('trigger', function(value) {
                if (value === "true") {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        }
    };
}

function DateLowerThan(){
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl ) {
            var validateDateRange = function (inputValue) {

                if(ctrl.$modelValue){
                    var fromDate = ctrl.$modelValue;
                    var toDate = new Date(attrs.dateLowerThan.substring(1,11).replace(/\-/g,"/"));
                    //toDate.setMinutes(toDate.getMinutes() - toDate.getTimezoneOffset());
                    console.log(fromDate);
                    console.log(toDate);
                    var isValid = isValidDateRange(fromDate, toDate);
                    ctrl.$setValidity('dateLowerThan', isValid);
                }else{
                    ctrl.$setValidity('dateLowerThan', true);
                }

                return inputValue;
            };

            ctrl.$parsers.unshift(validateDateRange);
            ctrl.$formatters.push(validateDateRange);
            attrs.$observe('dateLowerThan', function () {
                validateDateRange(ctrl.$viewValue);
            });
        }
    };
}

function DateGreaterThan(){
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var validateDateRange = function (inputValue) {
                if(ctrl.$modelValue){
                    var fromDate = new Date(attrs.dateGreaterThan.substring(1,11).replace(/\-/g,"/"));
                    fromDate.setMinutes(fromDate.getMinutes() - fromDate.getTimezoneOffset());
                    var toDate = ctrl.$modelValue;
                    var isValid = isValidDateRange(fromDate, toDate);
                    ctrl.$setValidity('dateGreaterThan', isValid);
                }else{
                    ctrl.$setValidity('dateGreaterThan', true);
                }
                return inputValue;
            };

            ctrl.$parsers.unshift(validateDateRange);
            ctrl.$formatters.push(validateDateRange);
            attrs.$observe('dateGreaterThan', function () {
                validateDateRange(ctrl.$viewValue);
            });
        }
    };
}

var isValidDate = function (dateStr) {
    if (dateStr == undefined)
        return false;
    var dateTime = Date.parse(dateStr);
    //console.log(dateStr);
    //console.log(dateTime);
    if (isNaN(dateTime)) {
        return false;
    }
    return true;
};

var getDateDifference = function (fromDate, toDate) {
    return Date.parse(toDate) - Date.parse(fromDate);
};

var isValidDateRange = function (fromDate, toDate) {
    if (fromDate == "" || toDate == "")
        return true;
    if (isValidDate(fromDate) == false) {
        return false;
    }
    if (isValidDate(toDate) == true) {
        var days = getDateDifference(fromDate, toDate);
        if (days < 0) {
            return false;
        }
    }
    return true;
};