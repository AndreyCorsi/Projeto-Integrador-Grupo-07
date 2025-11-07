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


        // Buscar EPI existente pelo CA ao invés de criar um novo
        let epi = this.getEPIByCA(novoEpiData.CA);

        // Se o EPI não existir, criar um novo
        if (!epi) {
            epi = this.createEPI(novoEpiData);
        }


        const historicoRegistro = {
            id: generateId(),
            identificadorFuncionario: identificadorFuncionario,
            epi: epi, // O objeto EPI existente
            dataEntrega: new Date(),
            motivoSubstituicao: motivoSubstituicao,
            dataVencimentoPrevisto: epi.getvalidade()
        };

        this.historico.push(historicoRegistro);

        return historicoRegistro;
    }
    

    getHistoricoEntregas(identificadorFuncionario: string): any[] {
        return this.historico.filter(h => h.identificadorFuncionario === identificadorFuncionario);
    }

    updateEPI(caNumero: string, data: {
        epi?: string,
        CA?: string,
        modo_uso?: string,
        validade?: Date,
        tipo?: string,
        fabricante?: string,
        data_entrada?: Date
    }): Epi | null {
        const epiIndex = this.EPIs.findIndex((epi) => epi.getCA() === caNumero);

        if (epiIndex === -1) {
            return null;
        }

        const epiAtual = this.EPIs[epiIndex];

        // Criar novo EPI com dados atualizados
        const epiAtualizado = Epi.create(
            data.epi !== undefined ? data.epi : epiAtual.getepi(),
            data.CA !== undefined ? data.CA : epiAtual.getCA(),
            data.modo_uso !== undefined ? data.modo_uso : epiAtual.getemodo_uso(),
            data.validade !== undefined ? data.validade : epiAtual.getvalidade(),
            data.tipo !== undefined ? data.tipo : epiAtual.gettipo(),
            data.fabricante !== undefined ? data.fabricante : epiAtual.getfabricante(),
            data.data_entrada !== undefined ? data.data_entrada : epiAtual.getdata_entrada()
        );

        // Se o CA mudou, remove o antigo
        if (data.CA && data.CA !== caNumero) {
            this.EPIs = this.EPIs.filter((epi) => epi.getCA() !== caNumero);
            this.EPIs.push(epiAtualizado);
        } else {
            this.EPIs[epiIndex] = epiAtualizado;
        }

        return epiAtualizado;
    }

removeEPI(caNumero: string): boolean {

        const ListaAntes = this.EPIs.length;


        this.EPIs = this.EPIs.filter((epi) => epi.getCA() !== caNumero);


        return this.EPIs.length < ListaAntes;
    }
}
