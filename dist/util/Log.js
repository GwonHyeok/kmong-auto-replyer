"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var Log = /** @class */ (function () {
    function Log() {
    }
    Log.createProductionLogger = function () {
        return this.createDevelopmentLogger();
    };
    Log.createDevelopmentLogger = function () {
        return winston.createLogger({
            level: 'silly',
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.align(), winston.format.printf(function (info) {
                        var timestamp = info.timestamp, level = info.level, message = info.message, args = __rest(info, ["timestamp", "level", "message"]);
                        var ts = timestamp.slice(0, 19).replace('T', ' ');
                        return ts + " [" + level + "]: " + message + " " + (Object.keys(args).length ? JSON.stringify(args, null, 2) : '');
                    }))
                })
            ]
        });
    };
    Log.d = function (message) {
        this.logger.log({ level: 'debug', message: message });
    };
    Log.e = function (message) {
        this.logger.log({ level: 'error', message: message });
    };
    Log.logger = process.env.NODE_ENV === 'production'
        ? Log.createProductionLogger() : Log.createDevelopmentLogger();
    return Log;
}());
exports.default = Log;
