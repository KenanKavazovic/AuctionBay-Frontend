import * as yup from 'yup'

export const PasswordSchema = yup.object().shape({
    current_password: yup.string().required('Enter your current password'),
    password: yup.string()
    .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
      'Your new password must have at least one number, lower and upper case letter and it has to be longer than 5 characters',
    ).required('Enter your new password'),
    confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords do not match.').required('Confirm your new password'),
})