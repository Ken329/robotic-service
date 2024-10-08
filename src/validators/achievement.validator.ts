import { z } from 'zod';
import { DOB_REGEX } from '../utils/constant';

const create = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name should not be empty' }),
    description: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name should not be empty' }),
    createdDate: z
      .string({ required_error: 'Created date is required' })
      .regex(DOB_REGEX, 'Invalid created date format eg: 20/01/2000')
      .optional()
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
