"use strict";
exports.__esModule = true;
// const debug = require('debug')('natalya:context');
var debug_1 = require("debug");
var log = (0, debug_1["default"])('natalya:core');
var Context = /** @class */ (function () {
    function Context(name) {
        var steps = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            steps[_i - 1] = arguments[_i];
        }
        this.steps = steps;
        this.currentStep = 0;
        this.storage = {};
        this.name = name;
    }
    Context.prototype.nextStep = function (text) {
        if (text == '@start@') {
            log('Запущен контекст: %s', this.name);
        }
        var answer = this.steps[this.currentStep](this.storage, text);
        log('Шаг: %i', this.currentStep);
        if (this.currentStep >= this.steps.length - 1) {
            this.currentStep = 0;
            log('Контекст "%s" завершён', this.name);
            return { state: 'ended', answer: answer };
        }
        this.currentStep++;
        return { state: 'running', answer: answer };
    };
    return Context;
}());
exports["default"] = Context;
