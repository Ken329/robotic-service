import { z } from 'zod';

const emptyStringToNull = z.literal('').transform(() => null);

const centerUpdate = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Center name is required' })
      .optional()
      .or(emptyStringToNull),
    location: z
      .string({ required_error: 'Center location is required' })
      .optional()
      .or(emptyStringToNull)
  })
});

export default {
  centerUpdate
};
