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

        const EmpresaCreated = Empresa.create(
        empresa.empresa,
        empresa.cnpj,
        empresa.endereco,
        empresa.email,
        empresa.senha
        );
        this.Empresas.push(EmpresaCreated);
        return EmpresaCreated
    }

    getEmpresas(): Empresa[] {
        return this.Empresas;
    }
    getEmpresaByemail(email: string): Empresa | undefined {
        return this.Empresas.find((Empresa) => Empresa.getemail() === email)
    }
}