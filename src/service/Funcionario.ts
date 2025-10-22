import { Funcionario } from "../model/Funcionario";

export class FuncionarioService{
    FuncionarioLista: Funcionario[] = [];

    constructor(public armazenamento: Funcionario){
        this.FuncionarioLista = armazenamento;
    }

    CreateFuncionario(funcionario:{
        nome: string,
        cpf: string,
        setor: string,
        cargo: string}):
}