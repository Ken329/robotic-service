/* eslint-disable no-unused-vars */

export type FileProviderRequest = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

export enum USER_STATUS {
  PENDING_VERIFICATION = 'pending verification',
  PENDING_CENTER = 'pending center',
  PENDING_ADMIN = 'pending admin',
  APPROVED = 'approved',
  REJECT = 'rejected',
  EXPIRED = 'expired'
}

export enum ROLE {
  STUDENT = 'student',
  CENTER = 'center',
  ADMIN = 'admin'
}

export enum RELATIONSHIP {
  FATHER = 'father',
  MOTHER = 'mother',
  OTHERS = 'others'
}

export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others'
}

export enum TSHIRT_SIZE {
  '4xs' = '4XS',
  '3xs' = '3XS',
  '2xs' = '2XS',
  'xs' = 'XS',
  's' = 'S',
  'm' = 'M',
  'l' = 'L',
  'xl' = 'XL'
}

export enum BLOG_CATEGORY {
  GENERAL = 'general',
  EXERCISE = 'exercise',
  COMPETITION = 'competition'
}

export enum BLOG_TYPE {
  NORMAL = 'normal',
  PRIORITY = 'priority'
}

export const CONTACT_REGEX = new RegExp(
  /^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/
);

export const NRIC_REGEX = new RegExp(
  /^((\d{2}(?!0229))|([02468][048]|[13579][26])(?=0229))(0[1-9]|1[0-2])(0[1-9]|[12]\d|(?<!02)30|(?<!02|4|6|9|11)31)-(\d{2})-(\d{4})$/
);

export const DOB_REGEX = new RegExp(
  /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/
);

export const VALID_FILE_TYPE = ['.jpg', '.png', '.pdf'];

export const VALID_FILE_MIME_TYPE = ['image/jpeg', 'application/pdf'];
