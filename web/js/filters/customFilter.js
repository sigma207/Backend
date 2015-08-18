/**
 * Created by user on 2015/8/18.
 */
var customFilter = ['$filter', function ($filter) {
    return function(array, predicate){
        console.log(array);
        console.log(predicate);

        return array;
    }
}];