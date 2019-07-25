var app = angular.module('pmdbApp', ['nvd3']);

//getting key from other server pmdbmicro

app.factory("MyService", function ($http) {
    return {
        fighters: function () {
            return $http.get("https://pmdbmicro.appspot.com/getTMDB").then(function (response) {
                return response.data;
            });
        }
    }
})
