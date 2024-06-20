import * as yup from 'yup'

export const RegisterSchema = yup.object().shape({
    email: yup.string().email().required('Please enter your email'),
    firstName: yup.string().required('Please enter your name'),
    lastName: yup.string().required('Please enter your last name'),
    password: yup.string()
    .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
      'Password must have at least one number, lower and upper case letter and it has to be longer than 5 characters.',
    )
    .required(),
    confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords do not match.').required('Please confirm your password.'),
})