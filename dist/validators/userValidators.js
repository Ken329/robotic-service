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
        }),
        nric: zod_1.z.string({
            required_error: 'NRIC is required'
        }),
        contact: zod_1.z.string({
            required_error: 'Contact is required'
        }),
        race: zod_1.z.string({
            required_error: 'Race is required'
        }),
        personalEmail: zod_1.z
            .string({
            required_error: 'Personal Email is required'
        })
            .email('Personal Email is not valid'),
        moeEmail: zod_1.z
            .string({
            required_error: 'Moe Email is required'
        })
            .email('Moe Email is not valid'),
        school: zod_1.z.string({
            required_error: 'School is required'
        }),
        nationality: zod_1.z.string({
            required_error: 'Nationality is required'
        }),
        center: zod_1.z
            .string({
            required_error: 'Center is required'
        })
            .uuid('Center is not a valid UUID')
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
const adminCreation = zod_1.z.object({
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
const centerCreation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required'
        })
            .email('Email is not valid'),
        password: zod_1.z.string({
            required_error: 'Password is required'
        }),
        center: zod_1.z
            .string({
            required_error: 'Center is required'
        })
            .uuid('Center is not a valid UUID')
    })
});
exports.default = { signUp, confirmSignUp, adminCreation, centerCreation };
