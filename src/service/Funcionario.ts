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

Funcionarios: Funcionario[] = [];


listaEPIs: EPI[] = []; 


historicoEPI: HistoricoEPI[] = []; 


constructor(public armazenamentoFuncionario: Funcionario[] = []) {
    this.Funcionarios = armazenamentoFuncionario;
}



createFuncionario(data: { nome: string, cpf: string, setor: string, cargo: string }): Funcionario {


    const funcionarioCriado = Funcionario.create(
        data.nome, 
        data.cpf, 
        data.cargo,
        data.setor
    );
    
    this.Funcionarios.push(funcionarioCriado);
    
    return funcionarioCriado;
}

consultarFuncionario(cpf: string): Funcionario[] | undefined {
        return this.Funcionarios.filter((Funcionario) => Funcionario.getcpf() === cpf);
}

visualizarCAsProximosDeVencer(diasLimite: number = 90): EPI[] {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + diasLimite); 
    
    return this.listaEPIs.filter((epi) => {
        return epi.caValidade <= dataLimite && epi.caValidade >= new Date(); 
    });
}

substituirEPI(
    funcionarioCpf: string, 
    novoEpiData: { nomeEPI: string, caNumero: string, caValidade: Date }, 
    motivo: string
): HistoricoEPI {
    
    const funcionario = this.Funcionarios.find(Funcionario => Funcionario.getcpf() === funcionarioCpf);
    if (!funcionario) {
        throw new Error(`Funcionário com CPF ${funcionarioCpf} não encontrado.`);
    }
    

    const novoEpi: EPI = {
        ...novoEpiData,
        id: generateId()
    };
    this.listaEPIs.push(novoEpi);

    
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


getFuncionarios(): Funcionario[] {
    return this.Funcionarios;
}

getHistoricoEPI(funcionarioCpf: string): HistoricoEPI[] {
    return this.historicoEPI.filter(h => h.funcionarioCpf === funcionarioCpf);
}

}