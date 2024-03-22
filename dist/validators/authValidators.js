"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const signUp = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required'
        })
            .email('Email is not valid'),
        password: zod_1.z.string({
            required_error: 'Password is required'
        })
        // nric: z.string({
        //   required_error: 'NRIC is required'
        // }),
        // center: z.string({
        //   required_error: 'Center is required'
        // }),
        // nationality: z.string({
        //   required_error: 'Nationality is required'
        // }),
        // role: z.enum([ROLE.STUDENT, ROLE.CENTER], {
        //   required_error: 'Role is required',
        //   invalid_type_error: 'Role is is not match'
        // }),
        // moeEmailAddress: z
        //   .string({
        //     required_error: 'Moe Email Address is required'
        //   })
        //   .email('Moe Email Address is not valid')
    })
});
const confirmSignUp = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required'
        })
            .email('Email is not valid'),
        code: zod_1.z.string({
            required_error: 'Code is required'
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
exports.default = { signUp, confirmSignUp, verifyUser };
