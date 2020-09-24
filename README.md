# Sky Teste

Teste para a Sky.

### Endpoints

##### /sign_up

Cadastro de usuário

Body:

```JSON
{
    "nome": "Nome completo",
    "email": "email@email.com.br",
    "senha": "senha",
    "telefones": [
         {
             "numero": "123456789",
             "ddd": "11"
         }
    ]
}
```

##### /sign_in

Login de usuário

Body:

```JSON
{
    "email": "email@email.com.br",
    "senha": "senha"
}
```

##### /user/:user_id

Busca de usuário
Header - Bearer token
user_id - ID do usuário a ser buscado
