import { assert } from "console";
import request from "supertest";
import faker from "faker";
import App from "../app";

faker.locale = "pt_BR";

beforeEach(async (done) => {
  await App.listen();
  done();
});

afterEach((done) => {
  return App.server && App.server.close(done);
});

it("Registro vazio", async () => {
    await request(App.server)
      .post("/sign_up")
      .expect(400);
});

it("Registro e-mail já existente", async () => {
  await request(App.server)
    .post("/sign_up")
    .send({
      nome: "Rafael Ferrés",
      email: "raferres@outlook.com.br",
      senha: "acbd1234",
      telefones: [
        {
          numero: "123456789",
          ddd: "11",
        },
      ],
    })
    .expect(400)
    .then((response) => {
      assert(response.body, { mensagem: "E-mail já existente" });
    });
});

it("Registro json object invalido", async () => {
  await request(App.server)
    .post("/sign_up")
    .send({
      nome: "Rafael Ferrés",
      senha: "acbd1234",
      telefones: [
        {
          numero: "123456789",
          ddd: "11",
        },
      ],
    })
    .expect(400)
    .then((response) => {
      assert(response.body, { mensagem: "email is a required field" });
    });
});

it("Criar usuário com sucesso", async () => {
  await request(App.server)
    .post("/sign_up")
    .send({
      nome: faker.name.findName(),
      email: faker.internet.email(),
      senha: faker.internet.password(),
      telefones: [
        {
          numero: faker.phone.phoneNumber("#########"),
          ddd: "11",
        },
      ],
    })
    .expect(201);
});

it("Login com sucesso", async () => {
  await request(App.server)
    .post("/sign_in")
    .send({
      email: "raferres@outlook.com.br",
      senha: "acbd1234",
    })
    .expect(200);
});

it("Login com erro", async () => {
  await request(App.server)
    .post("/sign_in")
    .send({
      email: faker.internet.email(),
      senha: faker.internet.password(),
    })
    .expect(401);
});

it("Login vazio", async () => {
    await request(App.server)
      .post("/sign_in")
      .expect(400);
});

it("Registro json object invalido", async () => {
  await request(App.server)
    .post("/sign_up")
    .send({
      senha: faker.internet.password(),
    })
    .expect(400)
    .then((response) => {
      assert(response.body, { mensagem: "email is a required field" });
    });
});

it("Buscar usuário sem token", async () => {
  await request(App.server)
    .get("/user/8d71663a-fb24-4e2d-83dc-2a8a589c3280")
    .expect(401)
    .then((response) => {
      assert(response.body, { mensagem: "Não autorizado" });
    });
});

it("Buscar usuário com token invalido", async () => {
  await request(App.server)
    .get("/user/8d71663a-fb24-4e2d-83dc-2a8a589c3280")
    .set("Authorization", "Bearer abc123")
    .expect(403)
    .then((response) => {
      assert(response.body, { mensagem: "Sessão inválida" });
    });
});

it("Buscar usuário com token valido", async () => {
  await request(App.server)
    .post("/sign_in")
    .send({
      email: "raferres@outlook.com.br",
      senha: "acbd1234",
    })
    .expect(200).then(async (response) => {
        await request(App.server)
        .get(`/user/${response.body.id}`)
        .set("Authorization", `Bearer ${response.body.token}`)
        .expect(200);
    });
});
