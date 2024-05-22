import { z } from 'zod';
import {
  GENDER,
  DOB_REGEX,
  NRIC_REGEX,
  TSHIRT_SIZE,
  USER_STATUS,
  RELATIONSHIP,
  CONTACT_REGEX
} from '../utils/constant';

const emptyStringToNull = z.literal('').transform(() => null);

const getUsers = z.object({
  query: z.object({
    status: z
      .enum(
        [
          USER_STATUS.PENDING_VERIFICATION,
          USER_STATUS.PENDING_CENTER,
          USER_STATUS.PENDING_ADMIN,
          USER_STATUS.APPROVED,
          USER_STATUS.REJECT
        ],
        { required_error: 'Status is valid' }
      )
      .optional()
      .or(emptyStringToNull)
  })
});

const studentCreation = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Email is not valid'),
    password: z.string({ required_error: 'Password is required' }),
    fullName: z.string({ required_error: 'Full name is required' }),
    gender: z.enum([GENDER.MALE, GENDER.FEMALE, GENDER.OTHERS], {
      required_error: 'Gender is required'
    }),
    size: z.enum(
      [
        TSHIRT_SIZE['4xs'],
        TSHIRT_SIZE['3xs'],
        TSHIRT_SIZE['2xs'],
        TSHIRT_SIZE['xs'],
        TSHIRT_SIZE['s'],
        TSHIRT_SIZE['m'],
        TSHIRT_SIZE['l'],
        TSHIRT_SIZE['xl']
      ],
      { required_error: 'Size is required' }
    ),
    dob: z
      .string({ required_error: 'Date of Birth is required' })
      .regex(DOB_REGEX, 'Invalid DOB format eg: 20/01/2000'),
    nric: z
      .string({ required_error: 'NRIC is required' })
      .regex(NRIC_REGEX, 'Invalid NRIC format eg: ******-**-****')
      .optional()
      .or(emptyStringToNull),
    passport: z
      .string({ required_error: 'Passport is required' })
      .optional()
      .or(emptyStringToNull),
    contact: z
      .string({ required_error: 'Contact is required' })
      .regex(CONTACT_REGEX, 'Invalid contact number format eg: +60123456789')
      .optional()
      .or(emptyStringToNull),
    race: z
      .string({ required_error: 'Race is required' })
      .min(1, { message: 'Race should not be empty' }),
    moeEmail: z
      .string({ required_error: 'Moe Email is required' })
      .email('Moe Email is not valid')
      .optional()
      .or(emptyStringToNull),
    school: z
      .string({ required_error: 'School is required' })
      .min(1, { message: 'School should not be empty' }),
    nationality: z
      .string({ required_error: 'Nationality is required' })
      .min(1, { message: 'Nationality should not be empty' }),
    parentName: z
      .string({ required_error: 'Parent name is required' })
      .min(1, { message: 'Parent name should not be empty' }),
    relationship: z.enum(
      [RELATIONSHIP.FATHER, RELATIONSHIP.MOTHER, RELATIONSHIP.OTHERS],
      { required_error: 'Relationship is required' }
    ),
    parentEmail: z
      .string({ required_error: 'Parent Email is required' })
      .email('Parent Email is not valid'),
    parentContact: z
      .string({ required_error: 'Parent contact is required' })
      .regex(CONTACT_REGEX, 'Invalid contact number format eg: +60123456789'),
    parentConsent: z.boolean({ required_error: 'Parent consent is required' }),
    center: z
      .string({ required_error: 'Center is required' })
      .uuid('Center is not a valid UUID')
  })
});

const adminCreation = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Email is not valid'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, { message: 'Password should not be empty' })
  })
});

const centerCreation = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Email is not valid'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, { message: 'Password should not be empty' }),
    name: z.string({ required_error: 'Name is required' }),
    location: z.string({ required_error: 'Location is required' })
  })
});

const approval = z.object({
  body: z.object({
    nric: z
      .string({ required_error: 'NRIC is required' })
      .regex(NRIC_REGEX, 'Invalid NRIC format eg: ******-**-****')
      .optional()
      .or(emptyStringToNull),
    fullName: z
      .string({ required_error: 'Full name is required' })
      .optional()
      .or(emptyStringToNull),
    gender: z
      .enum([GENDER.MALE, GENDER.FEMALE, GENDER.OTHERS], {
        required_error: 'Gender is required'
      })
      .optional()
      .or(emptyStringToNull),
    dob: z
      .string({ required_error: 'Date of Birth is required' })
      .regex(DOB_REGEX, 'Invalid DOB format eg: 12/12/2000')
      .optional()
      .or(emptyStringToNull),
    contact: z
      .string({ required_error: 'Contact is required' })
      .regex(CONTACT_REGEX, 'Invalid contact number format eg: +60123456789')
      .optional()
      .or(emptyStringToNull),
    race: z
      .string({ required_error: 'Race is required' })
      .min(1, { message: 'Race should not be empty' })
      .optional()
      .or(emptyStringToNull),
    moeEmail: z
      .string({ required_error: 'Moe Email is required' })
      .email('Moe Email is not valid')
      .optional()
      .or(emptyStringToNull),
    school: z
      .string({ required_error: 'School is required' })
      .min(1, { message: 'School should not be empty' })
      .optional()
      .or(emptyStringToNull),
    nationality: z
      .string({ required_error: 'Nationality is required' })
      .min(1, { message: 'Nationality should not be empty' })
      .optional()
      .or(emptyStringToNull),
    parentName: z
      .string({ required_error: 'Parent name is required' })
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
      .string({ required_error: 'Parent Email is required' })
      .email('Parent Email is not valid')
      .optional()
      .or(emptyStringToNull),
    parentContact: z
      .string({ required_error: 'Parent contact is required' })
      .regex(CONTACT_REGEX, 'Invalid contact number format eg: +6012-3456789')
      .optional()
      .or(emptyStringToNull),
    level: z
      .string({ required_error: 'Level is required' })
      .uuid('Level is not valid')
      .optional()
      .or(emptyStringToNull)
  })
});

export default {
  getUsers,
  studentCreation,
  adminCreation,
  centerCreation,
  approval
};
