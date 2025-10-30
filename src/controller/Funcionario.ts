// src/controller/FuncionarioController.ts

import { app } from "../server";
// Tipagens e Serviço importados corretamente. 
import { FuncionarioService } from "../service/Funcionario";
import { Funcionario } from "../model/Funcionario";


/**
 * Função utilitária para formatar a resposta do Funcionário, expondo apenas os dados essenciais.
 */
const formatarFuncionario = (funcionario: Funcionario) => ({
    nome: funcionario.getnome(),
    cpf: funcionario.getcpf(),
    setor: funcionario.getsetor(),
    cargo: funcionario.getcargo(),
});

/**
 * Gerencia as rotas HTTP para operações relacionadas a Funcionários (Cadastro, Consulta, Histórico, Substituição de EPI).
 */
export function FuncionarioController() {
    // Instancia o serviço de Funcionário
    const service = new FuncionarioService();

    // Rota: Cadastrar um novo Funcionário
    // POST /funcionarios
    app.post("/funcionarios", (req, res) => {
        try {
            // Usa FuncionarioCreateData que é a interface de entrada de dados
            const dadosFuncionario: any = req.body;
            
            // Validação mínima de dados obrigatórios
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

        if (!cpf || typeof cpf !== 'string') {
            return res.status(400).json({
                mensagem: "Parâmetro de busca inválido. Use: cpf (string de 11 dígitos).",
            });
        }

        try {
            // Usa o método correto para consulta por CPF
            const funcionario = service.consultarFuncionario(cpf);
        
            if (!funcionario) {
                return res.status(404).json({ mensagem: "Funcionário não encontrado com o CPF fornecido." });
            }

            return res.status(200).json(formatarFuncionario(funcionario));
        } catch (e: any) {
            // Captura erros de validação do CPF (ex: tamanho incorreto)
            return res.status(400).json({ mensagem: e.message });
        }
    });
    
    // Rota: Substituir EPI de um Funcionário e registrar o histórico
    // POST /funcionarios/substituir-epi
    app.post("/funcionarios/substituir-epi", (req, res) => {
        try {
            const { funcionarioCpf, novoEpiData, motivoSubstituicao } = req.body;

            // Validação básica dos dados de entrada
            if (!funcionarioCpf || typeof funcionarioCpf !== 'string' || funcionarioCpf.length !== 11) {
                throw new Error("CPF do funcionário inválido ou ausente.");
            }
            if (!novoEpiData || !motivoSubstituicao) {
                throw new Error("Dados do novo EPI ou motivo da substituição incompletos.");
            }
            
            // Assume-se que novoEpiData segue a interface NovoEpiSubstituicaoData
            const novoHistorico = service.substituirEPI(
                funcionarioCpf,
                novoEpiData as any,
                motivoSubstituicao
            );

            res.status(201).json({
                status: "Substituição de EPI registrada com sucesso.",
                registro: {
                    id: novoHistorico.id,
                    funcionarioCpf: novoHistorico.funcionarioCpf,
                    dataEntrega: novoHistorico.dataEntrega,
                    motivoSubstituicao: novoHistorico.motivoSubstituicao,
                    vencimentoEPI: novoHistorico.dataVencimentoPrevisto,
                    epi: {
                        nomeEPI: novoHistorico.epi.nomeEPI,
                        caNumero: novoHistorico.epi.caNumero,
                    }
                }
            });

        } catch (e: any) {
            // Retorna 404 se o funcionário não for encontrado (erro lançado no service)
            if (e.message.includes("não encontrado")) {
                return res.status(404).json({ erro: e.message });
            }
            return res.status(400).json({ erro: e.message });
        }
    });


    // Rota: Consultar Histórico de Entregas/Substituições de EPI (Adicionado do PDF)
    // GET /funcionarios/:cpf/historico-epi
    app.get("/funcionarios/:cpf/historico-epi", (req, res) => {
        const { cpf } = req.params;
        
        // Validação de formato (11 dígitos) antes de chamar o service
        if (cpf.length !== 11) {
             return res.status(400).json({ mensagem: "O CPF deve ter exatamente 11 dígitos para consulta do histórico." });
        }
        
        // Usa o método getHistoricoEPI do Service
        const historico = service.getHistoricoEPI(cpf);
        
        if (historico.length === 0) {
            // Retorna 200 com lista vazia se não houver histórico, o que é comum
            return res.status(200).json([]); 
        }
        
        // Formata o histórico para uma resposta mais limpa (assumindo a estrutura HistoricoEPI)
        const historicoFormatado = historico.map((registro: any) => ({
            id: registro.id,
            dataEntrega: registro.dataEntrega,
            motivoSubstituicao: registro.motivoSubstituicao,
            dataVencimentoPrevisto: registro.dataVencimentoPrevisto,
            epi: {
                caNumero: registro.epi.caNumero,
                nomeEPI: registro.epi.nomeEPI,
                caValidade: registro.epi.caValidade,
            }
        }));
        
        res.status(200).json(historicoFormatado);
    });
}
