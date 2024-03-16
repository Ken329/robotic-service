import { z } from 'zod';
import { ROLE } from '../utils/constant';

const signUp = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Email is not valid'),
    password: z.string({
      required_error: 'Password is required'
    }),
    center: z.string({
      required_error: 'Center is required'
    }),
    role: z.enum([ROLE.STUDENT, ROLE.CENTER], {
      required_error: 'Role is required',
      invalid_type_error: 'Role is is not match'
    })
  })
});

const verifyUser = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Email is not valid'),
    password: z.string({
      required_error: 'Password is required'
    })
  })
});

export default { signUp, verifyUser };
