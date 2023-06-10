import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@vikaskumarnegi/ticketing-common";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";
import { newOrderRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.get("*", async (req, res, next) => {
  next(new NotFoundError());
});
app.use(errorHandler);

export { app };
