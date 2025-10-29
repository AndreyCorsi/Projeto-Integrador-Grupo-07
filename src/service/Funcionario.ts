// src/service/funcionario.ts

import { Funcionario } from "../model/Funcionario"; 


type EPI = {
id: string;
nomeEPI: string;
caNumero: string;
caValidade: Date; 
};

type HistoricoEPI = {
id: string;
funcionarioCpf: string;
epi: EPI;
dataEntrega: Date;
dataVencimentoPrevisto: Date;
motivoSubstituicao: string;
};

const generateId = () => crypto.randomUUID();

export class FuncionarioService {
// Lista de Funcionários (Armazenamento em memória, como no PDF)
lista: Funcionario[] = [];

// Lista de EPIs/CA 
listaEPIs: EPI[] = []; 

// Lista de Histórico de substituições 
historicoEPI: HistoricoEPI[] = []; 


constructor(public armazenamentoFuncionario: Funcionario[] = []) {
    this.lista = armazenamentoFuncionario;
}

    // 1. Cadastrado de Funcionários

createFuncionario(data: { nome: string, cpf: string, setor: string, cargo: string }): Funcionario {

    // Pega o Funcionário criado e coloca dentro de uma lista
    const funcionarioCriado = Funcionario.create(
        data.nome, 
        data.cpf, 
        data.cargo,
        data.setor
    );
    
    this.lista.push(funcionarioCriado);
    
    return funcionarioCriado;
}

    // Consulta do funcionário utilizando CPF do funcionário
consultarFuncionario(identificador: { cpf?: string }): Funcionario | undefined {
    if (identificador.cpf) {
        // Consulta pelo CPF
        return this.lista.find((Funcionario) => Funcionario.getcpf() === identificador.cpf);
    }
    
}

    // Visualização dos EPI's perto de vencer
visualizarCAsProximosDeVencer(diasLimite: number = 90): EPI[] {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + diasLimite); 
    
    // Filtra todos os EPI's que estão perto do vencimento
    return this.listaEPIs.filter((epi) => {
        return epi.caValidade <= dataLimite && epi.caValidade >= new Date(); 
    });
}

// Substituição do EPI perto do vencimento com histórico
substituirEPI(
    funcionarioCpf: string, 
    novoEpiData: { nomeEPI: string, caNumero: string, caValidade: Date }, 
    motivo: string
): HistoricoEPI {
    
    const funcionario = this.lista.find(Funcionario => Funcionario.getcpf() === funcionarioCpf);
    if (!funcionario) {
        throw new Error(`Funcionário com CPF ${funcionarioCpf} não encontrado.`);
    }
    
    // Cria um novo EPI
    const novoEpi: EPI = {
        ...novoEpiData,
        id: generateId()
    };
    this.listaEPIs.push(novoEpi);

    // Registra o histórico da substituição do EPI, a data do ocorrido
    const dataAtual = new Date();
    const historico: HistoricoEPI = {
        id: generateId(),
        funcionarioCpf: funcionarioCpf,
        epi: novoEpi,
        dataEntrega: dataAtual,
        dataVencimentoPrevisto: novoEpi.caValidade,
        motivoSubstituicao: motivo,
    };

    this.historicoEPI.push(historico);
    
    return historico;
}

// lista os funcionarios
getFuncionarios(): Funcionario[] {
    return this.lista;
}

// Pesquisa por CPF, ou seja, busca pelo cpf do funcionario
getHistoricoEPI(funcionarioCpf: string): HistoricoEPI[] {
    return this.historicoEPI.filter(h => h.funcionarioCpf === funcionarioCpf);
}

}