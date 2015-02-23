/*!
 * *
 * https://github.com/iterativ/angular-it-validate.git
 * Version: 0.0.1 - 2015-02-23T12:57:22.233Z
 * License: MIT
 */


(function() {
  'use strict';

  angular.module('itValidate', []);

  angular.module('itValidate').directive('itValidate', [function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, elm, attr, ctrl) {
        if (!ctrl) {
          return;
        }

        var validationObject = scope.$eval(attr.itValidate);

        addValidators(ctrl, validationObject);

        function addValidators(modelController, validationObject) {
          angular.forEach(validationObject, function(validationFn, key) {
            modelController.$validators[key] = validationFn;
          });
        }

      }
    };
  }]);

  angular.module('itValidate').directive('itValidateWatch', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        itValidateWatch: '='
      },

      link: function(scope, elm, attr, ctrl) {
        if (!ctrl) {
          return;
        }

        scope.$watchCollection('itValidateWatch', function(newValue, oldValue) {
          if(!angular.equals(newValue, oldValue)) {
            ctrl.$validate();
          }
        });
      }
    };
  });

}());
