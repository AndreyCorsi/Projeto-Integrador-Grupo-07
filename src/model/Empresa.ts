export class Empresa {
    constructor(
        private empresa: string,
        private endereco: string,
        private cnpj: string,
        private email: string,
        private senha: string
    )  
    {
    if(!empresa)throw new Error("Nome da empresa Obrigatório");
    if(!endereco)throw new Error("Endereço Obrigatório");
    if(!cnpj)throw new Error("CNPJ da empresa Obrigatório");
    if(!email)throw new Error("Email Obrigatório");
    if(!senha)throw new Error("Senha Obrigatório");

    if(senha.length <= 6) throw new Error("Senha muito curta");
    if(email.length <= 100) throw new Error("Email muito grande");
    }
    
    static create(empresa: string, endereco:string, cpnj: string, email:string, senha:string){
        return new Empresa(empresa,endereco,cpnj,email,senha)
    }

    getempresa(): string{
        return this.empresa;
    }

    getcnpj(): string{
    return this.cnpj;
    }

    getendereco(): string{
        return this.endereco;
    }

    getemail(): string{
        return this.email;
    }

    getsenha(): string{
        return this.senha;
    }
  
}