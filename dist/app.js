"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var HttpClient_1 = require("./network/HttpClient");
var LoginApi_1 = require("./api/LoginApi");
var InboxApi_1 = require("./api/InboxApi");
var Log_1 = require("./util/Log");
var Application = /** @class */ (function () {
    function Application() {
        this.kmongApiClient = HttpClient_1.default.createClient({
            baseUri: 'https://kmong.com/'
        });
        // 작업 정보
        this.isAppRunning = true;
        this.pollingTime = 5000;
    }
    Application.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loginApi, inboxApi, loginResponse, inboxList, inbox, messageDetails;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Log_1.default.d('크몽 자동 메세지 응답기 실행');
                        loginApi = new LoginApi_1.default(this.kmongApiClient);
                        inboxApi = new InboxApi_1.default(this.kmongApiClient);
                        // 로그인 요청
                        if (process.env.KMONG_EMAIL == null)
                            throw Error('크몽 이메일이 설정 되어 있지 않습니다');
                        if (process.env.KMONG_PASSWORD == null)
                            throw Error('크몽 비밀번호가 설정 되어 있지 않습니다');
                        return [4 /*yield*/, loginApi.login(process.env.KMONG_EMAIL, process.env.KMONG_PASSWORD)];
                    case 1:
                        loginResponse = _a.sent();
                        if (loginResponse.meta.status !== 1)
                            throw Error('크몽 로그인에 실패하였습니다');
                        _a.label = 2;
                    case 2:
                        if (!this.isAppRunning) return [3 /*break*/, 8];
                        if (Date.now() - this.recentRunningTime < this.pollingTime)
                            return [3 /*break*/, 2];
                        return [4 /*yield*/, inboxApi.list(1)];
                    case 3:
                        inboxList = _a.sent();
                        Log_1.default.d('인박스 리스트 검색');
                        // 유저 아이디 저장과, 읽지 않은 메세지 정보 저장
                        this.userId = inboxList.data.USERID;
                        this.unreadInboxMessages = inboxList.data.inboxGroups.filter(function (inbox) {
                            return inbox.unreadCnt > 0;
                        });
                        Log_1.default.d("\uD544\uD130\uB9C1\uB41C \uC778\uBC15\uC2A4 \uAC2F\uC218 : " + this.unreadInboxMessages.length);
                        _a.label = 4;
                    case 4:
                        if (!(this.unreadInboxMessages.length > 0)) return [3 /*break*/, 7];
                        inbox = this.unreadInboxMessages.pop();
                        return [4 /*yield*/, inboxApi.getMessages(inbox.username)];
                    case 5:
                        messageDetails = _a.sent();
                        return [4 /*yield*/, inboxApi.send(messageDetails.data.inboxGroupId, this.userId, messageDetails.data.partner.USERID, '현재 부재중입니다. 잠시후 연락 드리도록 하겠습니다!!')];
                    case 6:
                        _a.sent();
                        Log_1.default.d("\uC790\uB3D9 \uC751\uB2F5 \uBA54\uC138\uC9C0 \uC804\uC1A1 : (" + this.userId + ") -> (" + messageDetails.data.partner.USERID + ")");
                        return [3 /*break*/, 4];
                    case 7:
                        // 최근 작업 완료시간 업데이트
                        this.recentRunningTime = Date.now();
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return Application;
}());
exports.default = Application;
