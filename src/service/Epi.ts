// src/service/epi.ts

import { Epi } from "../model/Epi"; // Importa a classe EPI que você forneceu
import { Funcionario } from "../model/Funcionario";
import { FuncionarioService } from "./Funcionario";

type HistoricoEPI = any;


const generateId = () => crypto.randomUUID();

export class EPIService {
    // Lista de EPIs 
    EPIs: Epi[] = []; 
    
    // Lista de Histórico de substituições  
    historico: HistoricoEPI[] = []; 

    // O construtor segue o padrão de injeção de dependência/inicialização do PDF
    constructor(public armazenamentoEPI: Epi[] = []) {
        this.EPIs = armazenamentoEPI;
    }

    // Cadastro de EPI
    createEPI(data: {
        epi: string,
        CA: string,
        modo_uso: string,
        validade: Date,
        tipo: string,
        fabricante: string,
        data_entrada: Date
    }): Epi {
        
        // Uso do static create da classe EPI para validação e criação
        const epiCriado = Epi.create(
            data.epi,
            data.CA,
            data.modo_uso,
            data.validade,
            data.tipo,
            data.fabricante,
            data.data_entrada,   
        );
        
        this.EPIs.push(epiCriado);
        
        return epiCriado;
    }
    
    // Visualização de EPI (Todos os Epi's)
    getEPIs(): Epi[] {
        return this.EPIs;
    }

    // Consulta de EPI através do CA
    getEPIByCA(caNumero: string): Epi | undefined {
        return this.EPIs.find((epi) => epi.getCA() === caNumero);
    }


    // Visualização de CA próximos de vencer
    visualizarCAsProximosDeVencer(diasLimite: number = 90): Epi[] {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + diasLimite); 
        
        return this.EPIs.filter((epi) => {
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
            modo_uso: string,
            fabricante: string,
            data_entrada: Date
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

removeEPI(caNumero: string): boolean {
        // Guarda a lista antes de tirar
        const ListaAntes = this.EPIs.length;
        
        // Mantém o EPI, tirando somente o deletado
        this.EPIs = this.EPIs.filter((epi) => epi.getCA() !== caNumero);

        // Retorna se o tamanho da lista diminuiu (remoção bem-sucedida).
        return this.EPIs.length < ListaAntes;
    }
}
