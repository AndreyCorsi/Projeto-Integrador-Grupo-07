import express from "express";
import { EmpresaController } from "./controller/Empresa";
import { EPIController } from "./controller/Epi";
import { FuncionarioController } from "./controller/Funcionario";
export const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

EmpresaController();
EPIController();
FuncionarioController();

app.listen(3007, () => {
  console.log("Server is running on port 3000");
});