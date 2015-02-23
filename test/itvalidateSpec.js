(function () {
  'use strict';

  describe('itValidate', function () {

    var scope, compileAndDigest;

    beforeEach(module('itValidate'));
    beforeEach(inject(function ($rootScope, $compile) {

      scope = $rootScope.$new();
      compileAndDigest = function (inputHtml, scope) {
        var inputElm = angular.element(inputHtml);
        var formElm = angular.element('<form name="form"></form>');
        formElm.append(inputElm);
        $compile(formElm)(scope);
        scope.$digest();

        return inputElm;
      };
    }));

    describe('itValidate directive', function () {

      describe('initial validation', function () {

        it('should mark input as valid if initial model is valid', inject(function () {

          compileAndDigest('<input name="input" ng-model="value">', scope);
          expect(scope.form.input.$valid).toBeTruthy();
          expect(scope.form.input.$error).toEqual({});
        }));

        it('should mark input as valid if it-validate is empty', inject(function () {
          compileAndDigest('<input name="input" ng-model="value" it-validate>', scope);
          expect(scope.form.input.$valid).toBeTruthy();
          expect(scope.form.input.$error).toEqual({});
        }));

        it('should mark input as valid if provided element to it-validate is empty', function () {

          scope.validateFn = function () {
            return {};
          };

          compileAndDigest('<input name="input" ng-model="value" it-validate="validateFn()">', scope);
          expect(scope.form.input.$valid).toBeTruthy();
          expect(scope.form.input.$error).toEqual({});
        });

        it('should mark input as valid if initial model is valid', function () {
          scope.validateFn = function () {
            return {
              initialvalid: function (modelValue, viewValue) {
                return true;
              }
            };
          };

          compileAndDigest('<input name="input" ng-model="value" it-validate="validateFn()">', scope);
          expect(scope.form.input.$valid).toBeTruthy();
          expect(scope.form.input.$error).toEqual({});
        });

        it('should mark input as invalid if initial model is invalid', function () {
          scope.validateFn = function () {
            return {
              initialinvalid: function (modelValue, viewValue) {
                return viewValue === 'testValue';
              }
            };
          };
          scope.value = '';

          compileAndDigest('<input name="input" ng-model="value" it-validate="validateFn()">', scope);

          expect(scope.form.input.$valid).toBeFalsy();
          expect(scope.form.input.$error).toEqual({
            initialinvalid: true
          });
        });
      });

      describe('validation on model change', function () {

        it('should change valid state in response to model changes', inject(function () {

          scope.validateFn = function () {
            return {
              initialinvalid: function (modelValue, viewValue) {
                return viewValue === 'testValue';
              }
            };
          };
          scope.value = '';

          compileAndDigest('<input name="input" ng-model="value" it-validate="validateFn()">', scope);
          expect(scope.form.input.$valid).toBeFalsy();

          scope.value = 'testValue';
          scope.$apply();
          expect(scope.form.input.$valid).toBeTruthy();
        }));
      });

      describe('validation on element change', function () {

        var sniffer;
        beforeEach(inject(function ($sniffer) {
          sniffer = $sniffer;
        }));

        it('should change valid state in response to element events', function () {

          scope.validateFn = function () {
            return {
              initialinvalid: function (modelValue, viewValue) {
                return viewValue === 'testValue';
              }
            };
          };
          scope.value = '';

          var inputElm = compileAndDigest('<input name="input" ng-model="value" it-validate="validateFn()">', scope);
          expect(scope.form.input.$valid).toBeFalsy();

          inputElm.val('testValue');
          inputElm.triggerHandler((sniffer.hasEvent('input') ? 'input' : 'change'));
          expect(scope.form.input.$valid).toBeTruthy();
        });
      });

      describe('multiple validators with custom keys', function () {

        it('should support multiple validators with custom keys', function () {

          scope.validateFn = function () {
            return {
              trueValidator: function (modelValue, viewValue) {
                return true;
              },
              falseValidator: function (modelValue, viewValue) {
                return false;
              },
              thirdValidator: function (modelValue, viewValue) {
                return false;
              }
            };
          };
          scope.value = '';

          compileAndDigest('<input name="input" ng-model="value" it-validate="validateFn()">', scope);
          expect(scope.form.input.$valid).toBeFalsy();
          expect(scope.form.input.$error).toEqual({
            falseValidator: true,
            thirdValidator: true
          });
        });
      });
    });


    describe('uiValidateWatch directive', function () {

      it('should watch the single model and refire the validition if it changes', function () {
        scope.watchMe = false;
        scope.validateFn = function () {
          return {
            validator: function (viewValue, modelValue) {
              return scope.watchMe;
            }
          };
        };

        compileAndDigest('<input name="input" ng-model="value" it-validate="validateFn()" it-validate-watch="watchMe">', scope);

        expect(scope.form.input.$valid).toBeFalsy();
        expect(scope.form.input.$error.validator).toBeTruthy();

        scope.$apply('watchMe=true');
        expect(scope.form.input.$valid).toBeTruthy();
      });

      it('should watch the array of models and refire the validation if it changes', function () {
        scope.watchMe1 = true;
        scope.watchMe2 = false;
        scope.validateFn = function () {
          return {
            validator1: function (viewValue, modelValue) {
              return scope.watchMe1;
            },
            validator2: function (viewValue, modelValue) {
              return scope.watchMe2;
            }
          };
        };

        compileAndDigest('<input name="input" ng-model="value" it-validate="validateFn()" it-validate-watch="[watchMe1, watchMe2]">', scope);

        expect(scope.form.input.$valid).toBeFalsy();
        expect(scope.form.input.$error.validator2).toBeTruthy();

        scope.$apply('watchMe2=true');
        expect(scope.form.input.$valid).toBeTruthy();
      });
    });
  });

}());
