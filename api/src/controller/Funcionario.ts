
import { app } from "../server";

import { FuncionarioService } from "../service/Funcionario";
import { Funcionario } from "../model/Funcionario";



const formatarFuncionario = (funcionario: Funcionario) => ({
    nome: funcionario.getnome(),
    cpf: funcionario.getcpf(),
    setor: funcionario.getsetor(),
    cargo: funcionario.getcargo(),
});


export function FuncionarioController() {
    
    const service = new FuncionarioService();

    
    app.post("/funcionarios", (req, res) => {
        try {
        
            const dadosFuncionario: any = req.body;
            
            
            if (!dadosFuncionario.nome || !dadosFuncionario.cpf || !dadosFuncionario.setor || !dadosFuncionario.cargo) {
                throw new Error("Dados de cadastro incompletos. Nome, CPF, Setor e Cargo são obrigatórios.");
            }
            
            const novoFuncionario = service.createFuncionario(dadosFuncionario);
            
            res.status(201).json({
                status: "Funcionário cadastrado com sucesso",
                dados: formatarFuncionario(novoFuncionario),
            });
        } catch (e: any) {
            return res.status(400).json({ erro: e.message });
        }
    });

    app.get("/funcionarios", (req, res) => {
        const funcionarios = service.getFuncionarios();
        const funcionariosFormatados = funcionarios.map(formatarFuncionario);
        res.json(funcionariosFormatados);
    });

    app.get("/funcionarios/buscar", (req, res) => {
        const { cpf } = req.query; 

        let funcionario: Funcionario[] | undefined;

if (cpf) {
      try {
         funcionario = service.consultarFuncionario(cpf as string);
         return res.status(200).json(funcionario);
      } catch (e: any) {
        return res.status(400   ).json({ mensagem: e.message });
      }
    } 

    else {
      return res.status(400).json({
        mensagem: "Parâmetro de busca inválido. Use: cpf.",
      });
    }
}
    )}
