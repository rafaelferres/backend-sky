import * as yup from 'yup';

const signInDTO : yup.ObjectSchema = yup.object().shape({
    email: yup.string().email().required().min(5),
    senha: yup.string().required().min(8)
});

export default signInDTO;