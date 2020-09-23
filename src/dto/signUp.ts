import * as yup from 'yup';

const signUpDTO : yup.ObjectSchema = yup.object().shape({
    nome: yup.string().required().min(5),
    email: yup.string().email().required().min(5),
    senha: yup.string().required().min(8),
    telefones: yup.array(
        yup.object({
            numero: yup.string().required().min(9).max(9),
            ddd: yup.string().required().min(2).max(2)
        })
    ).min(1)
});

export default signUpDTO;