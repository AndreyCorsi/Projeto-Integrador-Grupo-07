export class Epi{
    constructor(
        private epi: string,
        private CA: string,
        private modo_uso: string,
        private validade: Date,
        private tipo: string,
        private fabricante: string,
        private data_entrada: Date,
        
    ){
        if(!Epi) throw new Error("Nome do EPI obrigatório");
        if(!CA) throw new Error("Número de CA obrigatório");
        if(!validade) throw new Error("Validade do EPI Obrigatório");
        if(!tipo) throw new Error("Tipo do EPI Obrigatório");
        if(!fabricante) throw new Error("Fabricante Obrigatório");
        if(!data_entrada) throw new Error("Data de entrada de EPI Obrigatório");
        if(!modo_uso) throw new Error("Modo de uso do EPI Obrigatório");
        
        if(epi.length > 100) throw new Error ("Nome de EPI muito grande");
        if(CA.length > 100) throw new Error ("Número de CA muito grande");
        if(tipo.length > 100) throw new Error ("Tipo de EPI muito grande");
        if(fabricante.length > 100) throw new Error ("Nome do fabricante muito grande");

    }
    static create(
        epi: string,
        CA: string,
        modo_uso: string,
        validade: Date,
        tipo: string,
        fabricante: string,
        data_entrada: Date,
    ){
        return new Epi(epi, CA, modo_uso, validade, tipo, fabricante, data_entrada)
    }
    
    getepi(): string{
        return this.epi;
    }

    getCA(): string{
    return this.CA;
    }

    getemodo_uso(): string{
        return this.modo_uso;
    }

    getvalidade(): Date{
        return this.validade;
    }

    gettipo(): string{
        return this.tipo;
    }

    getfabricante(): string{
        return this.fabricante;
    }

    getdata_entrada(): Date{
        return this.data_entrada;
    }




    //Alteração

    setvalidade(validade:Date): void{
        this.validade;
    }

}
