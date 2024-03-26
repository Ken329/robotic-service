import { z } from 'zod';
import { USER_STATUS, RELATIONSHIP, ROLE } from '../utils/constant';

const users = z.object({
  query: z.object({
    status: z
      .enum(
        [
          USER_STATUS.PENDING_CENTER,
          USER_STATUS.PENDING_ADMIN,
          USER_STATUS.APPROVED,
          USER_STATUS.REJECT
        ],
        {
          required_error: 'Status is valid'
        }
      )
      .optional(),
    role: z
      .enum([ROLE.STUDENT, ROLE.CENTER, ROLE.ADMIN], {
        required_error: 'ROle is valid'
      })
      .optional()
  })
});

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
    nric: z
      .string({
        required_error: 'NRIC is required'
      })
      .min(1, { message: 'NRIC should not be empty' }),
    contact: z
      .string({
        required_error: 'Contact is required'
      })
      .min(1, { message: 'Contact should not be empty' }),
    race: z
      .string({
        required_error: 'Race is required'
      })
      .min(1, { message: 'Race should not be empty' }),
    personalEmail: z
      .string({
        required_error: 'Personal Email is required'
      })
      .email('Personal Email is not valid'),
    moeEmail: z
      .string({
        required_error: 'Moe Email is required'
      })
      .email('Moe Email is not valid'),
    school: z
      .string({
        required_error: 'School is required'
      })
      .min(1, { message: 'School should not be empty' }),
    nationality: z
      .string({
        required_error: 'Nationality is required'
      })
      .min(1, { message: 'Nationality should not be empty' }),
    parentName: z
      .string({
        required_error: 'Parent name is required'
      })
      .min(1, { message: 'Parent name should not be empty' }),
    relationship: z.enum(
      [RELATIONSHIP.FATHER, RELATIONSHIP.MOTHER, RELATIONSHIP.OTHERS],
      {
        required_error: 'Relationship is required'
      }
    ),
    parentEmail: z
      .string({
        required_error: 'Parent Email is required'
      })
      .email('Parent Email is not valid'),
    parentContact: z
      .string({
        required_error: 'Parent contact is required'
      })
      .min(1, { message: 'Parent contact should not be empty' }),
    center: z
      .string({
        required_error: 'Center is required'
      })
      .uuid('Center is not a valid UUID')
  })
});

const confirmSignUp = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Email is not valid'),
    code: z
      .string({
        required_error: 'Code is required'
      })
      .min(1, { message: 'Code should not be empty' })
  })
});

const adminCreation = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Email is not valid'),
    password: z
      .string({
        required_error: 'Password is required'
      })
      .min(1, { message: 'Password should not be empty' })
  })
});

const centerCreation = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Email is not valid'),
    password: z
      .string({
        required_error: 'Password is required'
      })
      .min(1, { message: 'Password should not be empty' }),
    center: z
      .string({
        required_error: 'Center is required'
      })
      .uuid('Center is not a valid UUID')
  })
});

const approval = z.object({
  body: z.object({
    nric: z
      .string({
        required_error: 'NRIC is required'
      })
      .min(1, { message: 'NRIC should not be empty' })
      .optional(),
    contact: z
      .string({
        required_error: 'Contact is required'
      })
      .min(1, { message: 'Contact should not be empty' })
      .optional(),
    race: z
      .string({
        required_error: 'Race is required'
      })
      .min(1, { message: 'Race should not be empty' })
      .optional(),
    personalEmail: z
      .string({
        required_error: 'Personal Email is required'
      })
      .email('Personal Email is not valid')
      .optional(),
    moeEmail: z
      .string({
        required_error: 'Moe Email is required'
      })
      .email('Moe Email is not valid')
      .optional(),
    school: z
      .string({
        required_error: 'School is required'
      })
      .min(1, { message: 'School should not be empty' })
      .optional(),
    nationality: z
      .string({
        required_error: 'Nationality is required'
      })
      .min(1, { message: 'Nationality should not be empty' })
      .optional(),
    parentName: z
      .string({
        required_error: 'Parent name is required'
      })
      .min(1, { message: 'Parent name should not be empty' })
      .optional(),
    relationship: z
      .enum([RELATIONSHIP.FATHER, RELATIONSHIP.MOTHER, RELATIONSHIP.OTHERS], {
        required_error: 'Relationship is required'
      })
      .optional(),
    parentEmail: z
      .string({
        required_error: 'Parent Email is required'
      })
      .email('Parent Email is not valid')
      .optional(),
    parentContact: z
      .string({
        required_error: 'Parent contact is required'
      })
      .min(1, { message: 'Parent contact should not be empty' })
      .optional()
  })
});

export default {
  users,
  signUp,
  confirmSignUp,
  adminCreation,
  centerCreation,
  approval
};
