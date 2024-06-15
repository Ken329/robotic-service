import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name should not be empty' }),
    description: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name should not be empty' })
  })
});

const update = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name should not be empty' })
      .optional(),
    description: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name should not be empty' })
      .optional()
  })
});

const assign = z.object({
  body: z.object({
    achievementIds: z.array(z.string().uuid())
  })
});

export default {
  create,
  update,
  assign
};
