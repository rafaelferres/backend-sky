import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    id: {
        require: true,
        type: String
    },
    nome: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    senha: {
        required: true,
        type: String
    },
    telefones: [{
        _id: false,
        numero: {
            required: true,
            type: String
        },
        ddd: {
            required: true,
            type: String
        }
    }, {
        required: true
    }],
    ultimo_login: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: {
         createdAt: 'data_criacao',
         updatedAt: 'data_atualizacao'
    }
});

export default model("User", UserSchema);