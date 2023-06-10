import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

/* declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string>[];
    }
  }
} */
declare global {
  var signin: () => string[];
}
jest.mock("../nats-wrapper");
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdasdas";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // build a jsonwebtoken payload, {id, email}
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: "test@test.com",
  };
  //create JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build session object { jwt: MYJWT}
  const session = { jwt: token };
  //Turn that session in json
  const sessionJSON = JSON.stringify(session);
  //take json and encode it base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  //returns a string thats the cookie with encoded data
  return [`session=${base64}`];
};
