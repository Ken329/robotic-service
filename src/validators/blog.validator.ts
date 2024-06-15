import { z } from 'zod';
import { BLOG_TYPE, BLOG_CATEGORY } from '../utils/constant';

const create = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name should not be empty' }),
    category: z.enum(
      [
        BLOG_CATEGORY.GENERAL,
        BLOG_CATEGORY.EXERCISE,
        BLOG_CATEGORY.COMPETITION
      ],
      { required_error: 'Category is required' }
    ),
    type: z.enum([BLOG_TYPE.NORMAL, BLOG_TYPE.PRIORITY], {
      required_error: 'Type is required'
    }),
    assigned: z
      .string({ required_error: 'Assigned is required' })
      .min(1, { message: 'Assigned should not be empty' }),
    coverImage: z
      .string({ required_error: 'Cover Image is required' })
      .uuid('Cover Image is not a valid UUID'),
    content: z
      .string({ required_error: 'Content is required' })
      .min(1, { message: 'Content should not be empty' })
  })
});

const update = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name should not be empty' })
      .optional(),
    category: z
      .enum(
        [
          BLOG_CATEGORY.GENERAL,
          BLOG_CATEGORY.EXERCISE,
          BLOG_CATEGORY.COMPETITION
        ],
        { required_error: 'Category is required' }
      )
      .optional(),
    type: z
      .enum([BLOG_TYPE.NORMAL, BLOG_TYPE.PRIORITY], {
        required_error: 'Type is required'
      })
      .optional(),
    assigned: z
      .string({ required_error: 'Assigned is required' })
      .min(1, { message: 'Assigned should not be empty' })
      .optional(),
    coverImage: z
      .string({ required_error: 'Cover Image is required' })
      .uuid('Cover Image is not a valid UUID')
      .optional(),
    content: z
      .string({ required_error: 'Content is required' })
      .min(1, { message: 'Content should not be empty' })
      .optional()
  })
});

export default { create, update };
