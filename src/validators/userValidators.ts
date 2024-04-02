import { z } from 'zod';
import {
  ROLE,
  GENDER,
  DOB_REGEX,
  USER_STATUS,
  NRIC_REGEX,
  RELATIONSHIP,
  CONTACT_REGEX
} from '../utils/constant';

const emptyStringToNull = z.literal('').transform(() => null);

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
      .optional()
      .or(emptyStringToNull),
    role: z
      .enum([ROLE.STUDENT, ROLE.CENTER, ROLE.ADMIN], {
        required_error: 'ROle is valid'
      })
      .optional()
      .or(emptyStringToNull)
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
    fullName: z.string({
      required_error: 'Full name is required'
    }),
    gender: z.enum([GENDER.MALE, GENDER.FEMALE, GENDER.OTHERS], {
      required_error: 'Relationship is required'
    }),
    dob: z
      .string({
        required_error: 'Date of Birth is required'
      })
      .regex(DOB_REGEX, 'Invalid DOB format eg: 12/12/2000'),
    nric: z
      .string({
        required_error: 'NRIC is required'
      })
      .regex(NRIC_REGEX, 'Invalid NRIC format eg: ******-**-****')
      .optional()
      .or(emptyStringToNull),
    passport: z
      .string({
        required_error: 'Passport is required'
      })
      .optional()
      .or(emptyStringToNull),
    contact: z
      .string({
        required_error: 'Contact is required'
      })
      .regex(CONTACT_REGEX, 'Invalid contact number format eg: +60123456789')
      .optional()
      .or(emptyStringToNull),
    race: z
      .string({
        required_error: 'Race is required'
      })
      .min(1, { message: 'Race should not be empty' }),
    moeEmail: z
      .string({
        required_error: 'Moe Email is required'
      })
      .email('Moe Email is not valid')
      .optional()
      .or(emptyStringToNull),
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
      .regex(CONTACT_REGEX, 'Invalid contact number format eg: +60123456789'),
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
      .regex(NRIC_REGEX, 'Invalid NRIC format eg: ******-**-****')
      .optional()
      .or(emptyStringToNull),
    fullName: z
      .string({
        required_error: 'Full name is required'
      })
      .optional()
      .or(emptyStringToNull),
    gender: z
      .enum([GENDER.MALE, GENDER.FEMALE, GENDER.OTHERS], {
        required_error: 'Relationship is required'
      })
      .optional()
      .or(emptyStringToNull),
    dob: z
      .string({
        required_error: 'Date of Birth is required'
      })
      .regex(DOB_REGEX, 'Invalid DOB format eg: 12/12/2000')
      .optional()
      .or(emptyStringToNull),
    contact: z
      .string({
        required_error: 'Contact is required'
      })
      .regex(CONTACT_REGEX, 'Invalid contact number format eg: +60123456789')
      .optional()
      .or(emptyStringToNull),
    race: z
      .string({
        required_error: 'Race is required'
      })
      .min(1, { message: 'Race should not be empty' })
      .optional()
      .or(emptyStringToNull),
    moeEmail: z
      .string({
        required_error: 'Moe Email is required'
      })
      .email('Moe Email is not valid')
      .optional()
      .or(emptyStringToNull),
    school: z
      .string({
        required_error: 'School is required'
      })
      .min(1, { message: 'School should not be empty' })
      .optional()
      .or(emptyStringToNull),
    nationality: z
      .string({
        required_error: 'Nationality is required'
      })
      .min(1, { message: 'Nationality should not be empty' })
      .optional()
      .or(emptyStringToNull),
    parentName: z
      .string({
        required_error: 'Parent name is required'
      })
      .min(1, { message: 'Parent name should not be empty' })
      .optional()
      .or(emptyStringToNull),
    relationship: z
      .enum([RELATIONSHIP.FATHER, RELATIONSHIP.MOTHER, RELATIONSHIP.OTHERS], {
        required_error: 'Relationship is required'
      })
      .optional()
      .or(emptyStringToNull),
    parentEmail: z
      .string({
        required_error: 'Parent Email is required'
      })
      .email('Parent Email is not valid')
      .optional()
      .or(emptyStringToNull),
    parentContact: z
      .string({
        required_error: 'Parent contact is required'
      })
      .regex(CONTACT_REGEX, 'Invalid contact number format eg: +6012-3456789')
      .optional()
      .or(emptyStringToNull)
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
