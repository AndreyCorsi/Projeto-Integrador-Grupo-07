import { app } from "../server";
import { EmpresaService } from "../service/Empresa";
import { Empresa } from "../model/Empresa";

export function EmpresaController() {
  const service = new EmpresaService();

  const formatarEmpresa = (empresa: Empresa) => ({
    empresa: empresa.getempresa(),
    cnpj: empresa.getcnpj(),
    endereco: empresa.getendereco(),
    email: empresa.getemail(),
  });

  app.post("/api/empresas", (req, res) => {
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

  app.get("/api/empresas", (req, res) => {
    const empresas = service.getEmpresas();
    const empresasFormatadas = empresas.map(formatarEmpresa);
    res.json(empresasFormatadas);
  });


  app.post("/api/empresas/autenticacao", (req, res) => {
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