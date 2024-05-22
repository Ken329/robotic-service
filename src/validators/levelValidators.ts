import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name should not be empty' })
  })
});

export default {
  create
};
