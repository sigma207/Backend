/**
 * Created by user on 2015/8/13.
 */
function TableSelectCheckbox(){
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

function RowSelectCheckbox(){
    return {
        template: "<input ng-model='selected' type='checkbox'/>",
        require: "^tableSelectCheckbox",
        scope: {
            row:"=",
            index:"="
        },
        link: function (scope, element, attr, ctrl) {
            scope.selected = false;
            if(ctrl.itemHasBeenSelected(scope.row)){
                scope.selected = true;
            }
            element.on('change', function (event) {
                ctrl.itemSelect(scope.row,scope.selected);
            });
        }
    }
}

function HeadCheckbox(){
    return {
        restrict: 'E',
        template: "<input ng-model='selected' type='checkbox'/>",
        scope:{
            collection:"=collection"
        },
        link: function (scope, element, attr) {
            var field = attr.field;
            scope.selected = false;
            element.on('change', function (event) {
                scope.$apply(function () {
                    for(var i= 0,count=scope.collection.length;i<count;i++){
                        scope.collection[i][field] = (scope.selected)?1:0;
                    }
                });
            });
        }
    }
}

function RowCheckbox(){
    return {
        restrict: 'E',
        template: "<input type='checkbox' ng-model='selectValue' parse-int  ng-true-value='1' ng-false-value='0' ng-checked='selectValue===1'/>",
        scope:{
            selectValue:"=selectValue"
        }
    }
}

function ParseInt(){
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, controller) {
            //console.log("DEF");
            controller.$formatters.push(function (modelValue) {
                //console.log('model', modelValue, typeof modelValue);
                return '' + modelValue;
            });

            controller.$parsers.push(function (viewValue) {
                //console.log('view', viewValue, typeof viewValue);
                return parseInt(viewValue,10);
            });
        }
    }
}

function TextStartWith(stConfig, $timeout, $parse, $log){
    return {
        require:"^stTable",
        link: function (scope, element, attr, ctrl) {
            var tableCtrl = ctrl;
            var inputs = element.find('input');
            var input = angular.element(inputs[0]);
            var predicateName = attr.predicate;
            $log.info(element);
            element.bind('change', function () {

                //$log.info(element.val());
                var query = {};
                query.startWith = element.val();

                scope.$apply(function () {
                    ctrl.search(query, predicateName)
                });
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