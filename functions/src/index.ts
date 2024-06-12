/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
// import * as functions from "firebase-functions";
import modules from "./routes/module/module";
import system from "./routes/system/system";

// exports.module = functions.https.onRequest(modules);
// exports.system = functions.https.onRequest(system);

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(modules);
app.use(system);

app.listen(3000, () =>
  console.log("Servidor iniciado na porta 3000")
);

