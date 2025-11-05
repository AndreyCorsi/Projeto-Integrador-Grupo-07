// src/service/epi.ts

import { Epi } from "../model/Epi"; // Importa a classe EPI que você forneceu
import { Funcionario } from "../model/Funcionario";
import { FuncionarioService } from "./Funcionario";

type HistoricoEPI = any;


const generateId = () => crypto.randomUUID();

export class EPIService {
 
    EPIs: Epi[] = []; 
    

    historico: HistoricoEPI[] = []; 


    constructor(public armazenamentoEPI: Epi[] = []) {
        this.EPIs = armazenamentoEPI;
    }


    createEPI(data: {
        epi: string,
        CA: string,
        modo_uso: string,
        validade: Date,
        tipo: string,
        fabricante: string,
        data_entrada: Date
    }): Epi {
        

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
    

    getEPIs(): Epi[] {
        return this.EPIs;
    }


    getEPIByCA(caNumero: string): Epi | undefined {
        return this.EPIs.find((epi) => epi.getCA() === caNumero);
    }



    visualizarCAsProximosDeVencer(diasLimite: number = 90): Epi[] {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + diasLimite); 
        
        return this.EPIs.filter((epi) => {

            return epi.getvalidade() <= dataLimite && epi.getvalidade() >= new Date(); 
        });
    }


    substituirEPI(
        identificadorFuncionario: string, 
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
    ): any { 
        
    
        const novoEpi = this.createEPI(novoEpiData);


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
    

    getHistoricoEntregas(identificadorFuncionario: string): any[] {
        return this.historico.filter(h => h.identificadorFuncionario === identificadorFuncionario);
    }

removeEPI(caNumero: string): boolean {

        const ListaAntes = this.EPIs.length;
        

        this.EPIs = this.EPIs.filter((epi) => epi.getCA() !== caNumero);


        return this.EPIs.length < ListaAntes;
    }
}
