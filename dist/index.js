"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var app = new app_1.default();
app.start()
    .then(function (_) { return console.log('exit with 0;'); })
    .catch(function (error) {
    console.error("exit with error : " + error.message);
    console.error(error);
});
