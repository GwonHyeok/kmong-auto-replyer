"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var Log_1 = require("./util/Log");
var app = new app_1.default();
app.start()
    .then(function (_) { return Log_1.default.d('exit with 0;'); })
    .catch(function (error) {
    Log_1.default.e(error.message);
    console.error(error);
});
