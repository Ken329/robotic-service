import { z } from 'zod';
import { EMAIL_REGEX } from '../utils/constant';

const generateToken = z.object({
  body: z.object({
    accessToken: z.string({ required_error: 'Access token is required' })
  })
});

const verifyOtp = z.object({
  body: z.object({
    id: z
      .string({ required_error: 'ID is required' })
      .uuid('ID is not a valid UUID')
      .optional(),
    email: z
      .string({ required_error: 'Email is required' })
      .regex(EMAIL_REGEX, 'Email is not valid')
      .optional(),
    code: z
      .string({ required_error: 'Code is required' })
      .min(1, { message: 'Code should not be empty' })
  })
});

const refreshToken = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: 'Access token is required' })
  })
});

export default {
  generateToken,
  verifyOtp,
  refreshToken
};
