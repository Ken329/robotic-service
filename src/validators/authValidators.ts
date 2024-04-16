import { z } from 'zod';

const verifyOtp = z.object({
  body: z.object({
    id: z
      .string({
        required_error: 'ID is required'
      })
      .uuid('ID is not a valid UUID'),
    code: z
      .string({
        required_error: 'Code is required'
      })
      .min(1, { message: 'Code should not be empty' })
  })
});

export default {
  verifyOtp
};
