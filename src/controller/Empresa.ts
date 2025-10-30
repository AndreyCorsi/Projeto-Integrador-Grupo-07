Empresa

import { app } from "../server";
import { EmpresaService } from "../service/Empresa";
import { Empresa } from "../model/Empresa";

export function EmpresaController() {
  const service = new EmpresaService([]);

  const formatarEmpresa = (empresa: Empresa) => ({
    empresa: empresa.getempresa(),
    cnpj: empresa.getcnpj(),
    endereco: empresa.getendereco(),
    email: empresa.getemail(),
  });

  app.post("/empresas", (req, res) => {
    try {
      const dadosEmpresa = req.body;
      
      if (!dadosEmpresa.empresa || !dadosEmpresa.cnpj || !dadosEmpresa.email || !dadosEmpresa.senha) {
          throw new Error("Dados de cadastro incompletos. Nome, CNPJ, Email e Senha são obrigatórios.");
      }
      
      const novaEmpresa = service.createEmpresa(dadosEmpresa);
      
      res.status(201).json({
        status: "Empresa cadastrada com sucesso",
        dados: formatarEmpresa(novaEmpresa),
      });
    } catch (e: any) {
      return res.status(400).json({ erro: e.message });
    }
  });

  app.get("/empresas", (req, res) => {
    const empresas = service.getEmpresas();
    const empresasFormatadas = empresas.map(formatarEmpresa);
    res.json(empresasFormatadas);
  });

  app.get("/empresas/email/:email", (req, res) => {
    const { email } = req.params; 

    if (!email) {
      return res.status(400).json({
        mensagem: "Parâmetro de busca inválido. Use: email.",
      });
    }

    const empresa = service.getEmpresaByemail(email as string);

    if (!empresa) {
      return res.status(404).json({ mensagem: "Empresa não encontrada com o email fornecido." });
    }

    return res.status(200).json(formatarEmpresa(empresa));
  });

  app.post("/empresas/autenticacao", (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios para autenticação.");
      }
      
      const empresaAutenticada = service.autenticar(email, senha);

      res.json({
        status: "Autenticado com sucesso",
        dados: formatarEmpresa(empresaAutenticada),
      });
    } catch (e: any) {
      return res.status(401).json({ erro: e.message || "Email ou senha inválidos" });
    }
  });
}