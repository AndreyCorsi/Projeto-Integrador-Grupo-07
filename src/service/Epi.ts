// src/service/epi.ts

import { Epi } from "../model/Epi"; // Importa a classe EPI que você forneceu

type HistoricoEPI = any;


const generateId = () => crypto.randomUUID();

export class EPIService {
    // Lista de EPIs 
    lista: Epi[] = []; 
    
    // Lista de Histórico de substituições e entregas (
    historico: HistoricoEPI[] = []; 

    // O construtor segue o padrão de injeção de dependência/inicialização do PDF
    constructor(public armazenamentoEPI: Epi[] = []) {
        this.lista = armazenamentoEPI;
    }

    // 1. Cadastro de EPI
    createEPI(data: {
        epi: string,
        tipo: string,
        CA: string,
        validade: Date,
        modouso: string,
        fabricante: string,
        data_entrada: Date
        cpfdofuncionario: string
    }): Epi {
        
        // Uso do static create da sua classe EPI para validação e criação
        const epiCreated = Epi.create(
            data.epi,
            data.tipo,
            data.CA,
            data.validade,
            data.modouso,
            data.fabricante,
            data.data_entrada,
            
            data.cpfdofuncionario
        );
        
        this.lista.push(epiCreated);
        
        return epiCreated;
    }
    
    // Visualização de EPI (Todos os Epi's)
    getEPIs(): Epi[] {
        return this.lista;
    }

    // Consulta de EPI através do CA
    getEPIByCA(caNumero: string): Epi | undefined {
        return this.lista.find((epi) => epi.getCA() === caNumero);
    }

    // Visualização de CA próximos de vencer
    visualizarCAsProximosDeVencer(diasLimite: number = 90): Epi[] {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + diasLimite); 
        
        return this.lista.filter((epi) => {
            // Filtra os EPIs cuja validade está entre hoje e a data limite
            return epi.getvalidade() <= dataLimite && epi.getvalidade() >= new Date(); 
        });
    }

    // Substituição de EPI perto do vencimento com histórico
    substituirEPI(
        identificadorFuncionario: string, // CPF do funcionário
        novoEpiData: {
            epi: string,
            tipo: string,
            CA: string,
            validade: Date,
            modouso: string,
            fabricante: string,
            data_entrada: Date
            cpfdofuncionario: string
        }, 
        motivoSubstituicao: string
    ): any { // Retorna 'any' para não criar nova tipagem
        
        // Cria e registra o novo EPI (usando a função de cadastro)
        const novoEpi = this.createEPI(novoEpiData);

        // Cria e registra o histórico da substituição como um objeto anônimo 
        const historicoRegistro = {
            id: generateId(),
            identificadorFuncionario: identificadorFuncionario,
            epi: novoEpi, // O objeto EPI
            dataEntrega: new Date(),
            motivoSubstituicao: motivoSubstituicao, 
            dataVencimentoPrevisto: novoEpi.getvalidade()
        };

        this.historico.push(historicoRegistro);
        
        return historicoRegistro;
    }
    
    // Função auxiliar para consultar o histórico 
    getHistoricoEntregas(identificadorFuncionario: string): any[] {
        return this.historico.filter(h => h.identificadorFuncionario === identificadorFuncionario);
    }
}