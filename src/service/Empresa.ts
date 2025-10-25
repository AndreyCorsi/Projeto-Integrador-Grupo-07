import { Empresa } from "../model/Empresa";

export class EmpresaService{
    Empresas: Empresa[] = [];

    constructor(public armazenamento: Empresa[]){
        this.Empresas = armazenamento;
    }

    createEmpresa(empresa:{
        empresa: string,
        endereco: string,
        cnpj: string,
        email: string,
        senha: string}): Empresa {
    // Coloca a empresa criada na lista Empresa
        const EmpresaCriado = Empresa.create(
        empresa.empresa,
        empresa.cnpj,
        empresa.endereco,
        empresa.email,
        empresa.senha
        );
        this.Empresas.push(EmpresaCriado);
        return EmpresaCriado
    }

    getEmpresas(): Empresa[] {
        return this.Empresas;
    }
    getEmpresaByemail(email: string): Empresa | undefined {
        return this.Empresas.find((Empresa) => Empresa.getemail() === email)
    }
}