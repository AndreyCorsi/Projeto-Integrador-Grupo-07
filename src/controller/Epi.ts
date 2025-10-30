

import { Epi } from "../model/Epi";
import { app } from "../server"; 
import { EPIService } from "../service/Epi";


const formatarEPI = (epi: Epi) => ({
    epi: epi.getepi(),
    tipo: epi.gettipo(),
    CA: epi.getCA(),
    validade: epi.getvalidade(),

    modo_uso: epi.getemodo_uso(), 
    fabricante: epi.getfabricante(),
    data_entrada: epi.getdata_entrada(),

});


export function EPIController() {
    // Instancia o serviço de EPI
    const service = new EPIService();

    // Rota: Listar todos os EPIs
    // GET /epis
    app.get("/epis", (req, res) => {
        const epis = service.getEPIs();
        // Formatando a lista para padronizar a saída
        const episFormatados = epis.map(formatarEPI); 
        res.json(episFormatados);
    });


    app.post("/epis", (req, res) => {
        try {

            const dadosEPI = req.body;
            const novoEPI = service.createEPI(dadosEPI);
            
            res.status(201).json({
                status: "EPI cadastrado com sucesso",
                CA: novoEPI.getCA(),
                dados: formatarEPI(novoEPI),
            });
        } catch (e: any) {
            // Captura erros de validação
            return res.status(400).json({ erro: e.message });
        }
    });

    // Rota: Buscar EPI através do CA
    // GET /epis/ca/:caNumero
    app.get("/epis/ca/:caNumero", (req, res) => {
        const { caNumero } = req.params;


        const Epi = service.getEPIByCA(caNumero);

        if (!Epi) {
            // Correção: Usando template literals (backticks) para interpolação
            return res.status(404).json({ mensagem: `Epi com CA ${caNumero} não encontrado.` });
        }
        
        // Usando a função auxiliar de formatação
        const epiFormatado = formatarEPI(Epi);

        return res.status(200).json(epiFormatado);
    });
    
    // Rota: Visualização de CA próximos de vencer
    // GET /epis/vencimento?diasLimite=XX
    app.get("/epis/vencimento", (req, res) => {
        const { diasLimite } = req.query;

        let limite = 90; 

        if (diasLimite) {
            limite = parseInt(diasLimite as string);
            if (isNaN(limite) || limite <= 0) {
                 return res.status(400).json({ mensagem: "diasLimite deve ser um número positivo." });
            }
        }

       
        const episVencendo = service.visualizarCAsProximosDeVencer(limite);
        
        const episFormatados = episVencendo.map((epi) => ({
            Epi: epi.getepi(),
            CA: epi.getCA(),
            validade: epi.getvalidade(),
         
            diasRestantes: Math.ceil((epi.getvalidade().getTime() - new Date().getTime()) / (1000 * 3600 * 24))
        }));

        res.status(200).json({ 
         
            mensagem: `Epi com validade do CA vencendo nos próximos ${limite} dias.`,
            data: episFormatados
        });
    });



    app.post("/epis/substituicao", (req, res) => {
        try {
            
            const { identificadorFuncionario, motivo, novoEpi } = req.body; 

            if (!identificadorFuncionario || !motivo || !novoEpi) {
                return res.status(400).json({ erro: "Dados de funcionário, motivo e novoEPI são obrigatórios." });
            }
            
            // O serviço tem o método substituirEPI
            const registroHistorico = service.substituirEPI(
                identificadorFuncionario, 
                novoEpi as any, // Garantindo a tipagem
                motivo
            );

            res.status(200).json({
                status: "Substituição registrada com sucesso",
                dados: {
                    idRegistro: registroHistorico.id,
                    funcionario: registroHistorico.identificadorFuncionario,
                    epiCA: registroHistorico.epi.getCA(),
                    dataEntrega: registroHistorico.dataEntrega,
                    motivo: registroHistorico.motivoSubstituicao,
                    dataVencimentoPrevisto: registroHistorico.dataVencimentoPrevisto // Adicionado
                },
            });
        } catch (e: any) {
            return res.status(400).json({ erro: e.message || "Erro ao registrar substituição." });
        }
    });

    app.get("/epis/historico/:identificadorFuncionario", (req, res) => {
        const { identificadorFuncionario } = req.params;
        

        const historico = service.getHistoricoEntregas(identificadorFuncionario);
        
        if (historico.length === 0) {
            return res.status(404).json({ mensagem: `Nenhum histórico encontrado para o funcionário: ${identificadorFuncionario}` });
        }
        
        const historicoFormatado = historico.map((registro: any) => ({
            id: registro.id,
            dataEntrega: registro.dataEntrega,
            motivo: registro.motivoSubstituicao,
            dataVencimentoPrevisto: registro.dataVencimentoPrevisto, // Adicionado
            epiCA: registro.epi.getCA(),
            nomeEPI: registro.epi.getepi(),
        }));
        
        res.status(200).json(historicoFormatado);
    });

    app.delete("/epis/:ca", (req, res) => {
        const { ca } = req.params;
        const removido = service.removeEPI(ca);

        if (removido) {
            return res.json({ status: `EPI com CA '${ca}' removido com sucesso.` });
        } else {
            return res.status(404).json({ erro: `EPI com CA '${ca}' não encontrado para remoção.` });
        }
    });
}
