"use strict";
/* eslint-disable no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE = exports.USER_STATUS = exports.CENTER_STATUS = void 0;
var CENTER_STATUS;
(function (CENTER_STATUS) {
    CENTER_STATUS["NOT_ASSIGN"] = "Not Assign";
    CENTER_STATUS["ASSIGNED"] = "Assigned";
})(CENTER_STATUS || (exports.CENTER_STATUS = CENTER_STATUS = {}));
var USER_STATUS;
(function (USER_STATUS) {
    USER_STATUS["PENDING"] = "pending";
    USER_STATUS["REQUEST_UPDATE"] = "request update";
    USER_STATUS["APPROVED"] = "approved";
})(USER_STATUS || (exports.USER_STATUS = USER_STATUS = {}));
var ROLE;
(function (ROLE) {
    ROLE["STUDENT"] = "student";
    ROLE["CENTER"] = "center";
    ROLE["ADMIN"] = "admin";
})(ROLE || (exports.ROLE = ROLE = {}));
