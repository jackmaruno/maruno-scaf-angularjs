angular.module('maskMoney', [])
    .directive('maskMoney', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                model: '=ngModel',
                mmOptions: '=?',
                prefix: '=',
                suffix: '=',
                affixesStay: '=',
                thousands: '=',
                decimal: '=',
                precisoin: '=',
                allowZero: '=',
                allowNegative: '='
            },
            link: function(scope, el, attr, ctrl) {

                scope.$watch(checkOptions, init, true);

                scope.$watch(attr.ngModel, eventHandler, true); 

                function checkOptions() { 
                    return scope.mmOptions;
                }

                function checkModel() { 
                    return scope.model;
                } 
                function parser() {
                    return $(el).maskMoney('unmasked')[0];
                }
                ctrl.$parsers.push(parser);

                function eventHandler() {
                    $timeout(function() {
                        scope.$apply(function() {
                            ctrl.$setViewValue($(el).val());
                        });
                    });
                }

                function init(options) {
                    $timeout(function() {
                        elOptions = {
                            prefix: scope.prefix || '',
                            suffix: scope.suffix,
                            affixesStay: scope.affixesStay,
                            thousands: scope.thousands,
                            decimal: scope.decimal,
                            precision: scope.precision,
                            allowZero: scope.allowZero,
                            allowNegative: scope.allowNegative
                        };

                        if (!scope.mmOptions) {
                            scope.mmOptions = {};
                        }

                        for (elOption in elOptions) {
                            if (elOptions[elOption]) {
                                scope.mmOptions[elOption] = elOptions[elOption];
                            }
                        }

                        $(el).maskMoney(scope.mmOptions);
                        $(el).maskMoney('mask');
                        eventHandler();

                    }, 0);

                    $timeout(function() {
                        scope.$apply(function() {
                            ctrl.$setViewValue($(el).val());
                        });
                    });

                }
            }
        };
    }); 