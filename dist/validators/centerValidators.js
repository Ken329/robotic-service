"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const constant_1 = require("../utils/constant");
const getCenters = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z
            .enum([constant_1.CENTER_STATUS.ASSIGNED, constant_1.CENTER_STATUS.NOT_ASSIGN], {
            required_error: 'Status is required'
        })
            .optional()
    })
});
const createCenter = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required'
        }),
        location: zod_1.z.string({
            required_error: 'Location is required'
        })
    })
});
exports.default = { getCenters, createCenter };
