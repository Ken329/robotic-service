import { z } from 'zod';

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
    nric: z.string({
      required_error: 'NRIC is required'
    }),
    contact: z.string({
      required_error: 'Contact is required'
    }),
    race: z.string({
      required_error: 'Race is required'
    }),
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
    school: z.string({
      required_error: 'School is required'
    }),
    nationality: z.string({
      required_error: 'Nationality is required'
    }),
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
    code: z.string({
      required_error: 'Code is required'
    })
  })
});

const adminCreation = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Email is not valid'),
    password: z.string({
      required_error: 'Password is required'
    })
  })
});

const centerCreation = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Email is not valid'),
    password: z.string({
      required_error: 'Password is required'
    }),
    center: z
      .string({
        required_error: 'Center is required'
      })
      .uuid('Center is not a valid UUID')
  })
});

export default { signUp, confirmSignUp, adminCreation, centerCreation };
