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
  var signin: (id?: string) => string[];
}
jest.mock("../nats-wrapper");
/* jest.mock("../stripe"); */
process.env.STRIPE_KEY =
  "sk_test_51NGzG2HvqFNoDdQIIuf6gspz76yokqinIW69UiwWCaAwMZ5jS9FilpGzpTT3d10wJAIohakA8W9iDPf6x8m7dDUC00MVBhugyq";
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

global.signin = (id?: string) => {
  // build a jsonwebtoken payload, {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
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
