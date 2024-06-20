import * as yup from 'yup'

export const ProfileSchema = yup.object().shape({
    firstName: yup.string().required('You must enter a valid first name.'),
    lastName: yup.string().required('You must enter a valid last name.'),
    email: yup.string().email().required('You must enter a valid email.')
})