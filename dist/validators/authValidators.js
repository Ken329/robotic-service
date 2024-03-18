"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const constant_1 = require("../utils/constant");
const signUp = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required'
        })
            .email('Email is not valid'),
        password: zod_1.z.string({
            required_error: 'Password is required'
        }),
        center: zod_1.z.string({
            required_error: 'Center is required'
        }),
        role: zod_1.z.enum([constant_1.ROLE.STUDENT, constant_1.ROLE.CENTER], {
            required_error: 'Role is required',
            invalid_type_error: 'Role is is not match'
        })
    })
});
const verifyUser = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required'
        })
            .email('Email is not valid'),
        password: zod_1.z.string({
            required_error: 'Password is required'
        })
    })
});
exports.default = { signUp, verifyUser };
