"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.InitializationError = exports.Brains = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var debug_1 = require("debug");
var log = (0, debug_1["default"])('natalya:core');
var InitializationError = /** @class */ (function (_super) {
    __extends(InitializationError, _super);
    function InitializationError(msg) {
        var _this = _super.call(this) || this;
        _this.name = 'InitializationError';
        _this.message = msg;
        return _this;
    }
    return InitializationError;
}(Error));
exports.InitializationError = InitializationError;
var Brains = /** @class */ (function () {
    function Brains(sinonimsFile, answersFile) {
        if (sinonimsFile === void 0) { sinonimsFile = 'sinonims.json'; }
        if (answersFile === void 0) { answersFile = 'answers.json'; }
        this.sinonimsFile = (0, path_1.join)(__dirname, sinonimsFile);
        this.answersFile = (0, path_1.join)(__dirname, answersFile);
        this.sinonims = {};
        this.answers = {};
        this.contexts = {};
        this.sessions = [];
        this.loadConfiguration();
    }
    Brains.prototype.getSession = function (id) {
        return this.sessions[id - 1];
    };
    Brains.prototype.tokenize = function (text) {
        var _this = this;
        var synonimsKeys = Object.keys(this.sinonims);
        synonimsKeys.forEach(function (synonimKey) {
            var synonims = _this.sinonims[synonimKey];
            synonims.forEach(function (synonim) {
                if (!new RegExp(synonim, 'ig').test(text))
                    return;
                log('Найдено и заменено совпадение с синонимом: %s -> %s', new RegExp("(?<word>".concat(synonim, ")")).exec(text).groups.word, synonimKey);
                text = text.replace(synonim, synonimKey);
            });
        });
        return text;
    };
    Brains.prototype.startContext = function (contextName, sid) {
        if (this.getSession(sid).currentContext != null)
            return;
        var ctx = this.contexts[contextName];
        this.getSession(sid).currentContext = ctx;
        return ctx.nextStep('@start@').answer;
    };
    Brains.prototype.processAnswer = function (key, sid) {
        var daysOfWeek = [
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятнца",
            "Суббота",
            "Воскресенье"
        ];
        var variables = {
            hours: new Date(Date.now()).getHours(),
            minutes: new Date(Date.now()).getMinutes(),
            date: new Date(Date.now()).getDate(),
            day: daysOfWeek[new Date(Date.now()).getDay() - 1]
        };
        var answer = this.answers[key];
        answer = answer[Math.floor(Math.random() * answer.length)];
        log("\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442: %s", answer);
        answer = answer.replace(/\$\{(.+?)\}/ig, function (_, code) {
            try {
                var res = eval(code);
                if (res == undefined || res == NaN || res == null)
                    return '';
                return res.toString();
            }
            catch (err) {
                return 'Произошла ошибка при обработке вопроса. Обратитесь к моему создателю.';
            }
        });
        return answer;
    };
    Brains.prototype.getAnswer = function (queryObj) {
        var text = queryObj.text, sid = queryObj.sid;
        log('Получен вопрос: %s', text);
        if (this.getSession(sid).currentContext != null) {
            var context = this.getSession(sid).currentContext;
            var res = context.nextStep(text);
            if (res.state = 'ended') {
                this.getSession(sid).currentContext = null;
            }
            return res.answer;
        }
        var tokenizedText = this.tokenize(text);
        log("\u0422\u0435\u043A\u0441\u0442 \u0441 \u0437\u0430\u043C\u0435\u043D\u0451\u043D\u043D\u044B\u043C\u0438 \u0441\u0438\u043D\u043E\u043D\u0438\u043C\u0430\u043C\u0438: %s", tokenizedText);
        var answersKeys = Object.keys(this.answers);
        var answers = [];
        for (var _i = 0, answersKeys_1 = answersKeys; _i < answersKeys_1.length; _i++) {
            var key = answersKeys_1[_i];
            if (!new RegExp(key).test(tokenizedText))
                continue;
            answers.push(this.processAnswer(key, sid));
        }
        log("\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442: %j", answers);
        return answers.length > 0 ? answers.join(' ') : "Извините, я вас не поняла. Можете повторить?";
    };
    Brains.prototype.loadConfiguration = function () {
        log('Инициализация.\nЗагрузка конфигурации...');
        if (!(0, fs_1.existsSync)(this.sinonimsFile))
            throw new InitializationError('Инициализация провалена: Файл синонимов не найден');
        this.sinonims = JSON.parse((0, fs_1.readFileSync)(this.sinonimsFile, 'utf-8'));
        if (!(0, fs_1.existsSync)(this.answersFile))
            throw new InitializationError('Инициализация провалена: Файл ответов не найден');
        this.answers = JSON.parse((0, fs_1.readFileSync)(this.answersFile, 'utf-8'));
        log('Инициализация закончена.');
    };
    Brains.prototype.addSession = function (sid) {
        this.sessions.push({ sid: sid, currentContext: null });
    };
    Brains.prototype.removeSession = function (sid) {
        this.sessions.splice(sid - 1, 1);
    };
    return Brains;
}());
exports.Brains = Brains;
