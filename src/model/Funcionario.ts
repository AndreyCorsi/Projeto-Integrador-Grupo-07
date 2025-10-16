export class Funcionario{
    constructor(
        private nome: string,
        private cpf: string,
        private setor: string,
        private cargo: string
    ) {
    if(!nome)throw new Error("Nome do funcionário Obrigatório");
    if(!cpf)throw new Error("CPF do funcionário Obrigatório");
    if(!setor)throw new Error("Setor do funcionário Obrigatório");
    if(!cargo)throw new Error("Cargo do funcionário Obrigatório");

    if (nome.length > 100) throw new Error("Nome muito grande");
    if (cpf.length > 11) throw new Error(" Necessário 11 digitos");
    if (setor.length > 100) throw new Error("Setor muito grande");
    if (cargo.length > 100) throw new Error("Cargo muito grande");
    }
    static create(
        nome: string,
        cpf: string,
        setor: string,
        cargo: string
    )
    return new Funcionario(nome,)


}