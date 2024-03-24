import { z } from 'zod';
import { CENTER_STATUS } from '../utils/constant';

const getCenters = z.object({
  query: z.object({
    status: z
      .enum([CENTER_STATUS.ASSIGNED, CENTER_STATUS.NOT_ASSIGN], {
        required_error: 'Status is required'
      })
      .optional()
  })
});

const createCenter = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required'
    }),
    location: z.string({
      required_error: 'Location is required'
    })
  })
});

export default { getCenters, createCenter };
