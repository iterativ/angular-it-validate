/*!
 * *
 * https://github.com/iterativ/angular-it-validate.git
 * Version: 0.0.1 - 2015-02-23T12:23:24.019Z
 * License: MIT
 */
!function(){"use strict";angular.module("itValidate",[]),angular.module("itValidate").directive("itValidate",[function(){return{restrict:"A",require:"?ngModel",link:function(t,i,a,e){function n(t,i){angular.forEach(i,function(i,a){t.$validators[a]=i})}if(e){var l=t.$eval(a.itValidate);n(e,l)}}}}]),angular.module("itValidate").directive("itValidateWatch",function(){return{restrict:"A",require:"?ngModel",scope:{itValidateWatch:"="},link:function(t,i,a,e){e&&t.$watchCollection("itValidateWatch",function(t,i){angular.equals(t,i)||e.$validate()})}}})}();