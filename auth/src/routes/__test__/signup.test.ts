import request from "supertest";

import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "thisismypassword",
    })
    .expect(201);
});
it("returns a 400 for a invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "asd",
      password: "thisismypassword",
    })
    .expect(400);
});
it("returns a 400 for a invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "asd@gmail.com",
      password: "4",
    })
    .expect(400);
});
it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "abc@test.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ password: "thisispassword" })
    .expect(400);
});
it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "thisispassword",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "thisispassword",
    })
    .expect(400);
});
it("sets a cookie after a successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "thisispassword",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
