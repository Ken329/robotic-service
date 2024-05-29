import { z } from 'zod';
import { VALID_FILE_TYPE, VALID_FILE_MIME_TYPE } from '../utils/constant';

const create = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name should not be empty' }),
    description: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name should not be empty' }),
    extNameValidator: z.boolean().refine((val) => val === true, {
      message: `Wrong file type being uploaded (${VALID_FILE_TYPE.join(', ')})`
    }),
    mimeTypeValidator: z.boolean().refine((val) => val === true, {
      message: `Wrong file mime type being uploaded (${VALID_FILE_MIME_TYPE.join(', ')})`
    })
  })
});

export default {
  create
};
