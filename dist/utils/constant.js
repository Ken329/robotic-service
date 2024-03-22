"use strict";
/* eslint-disable no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE = exports.STATUS = void 0;
var STATUS;
(function (STATUS) {
    STATUS["PENDING"] = "pending";
    STATUS["REQUEST_UPDATE"] = "request update";
    STATUS["APPROVED"] = "approved";
})(STATUS || (exports.STATUS = STATUS = {}));
var ROLE;
(function (ROLE) {
    ROLE["STUDENT"] = "student";
    ROLE["CENTER"] = "center";
    ROLE["ADMIN"] = "admin";
})(ROLE || (exports.ROLE = ROLE = {}));
