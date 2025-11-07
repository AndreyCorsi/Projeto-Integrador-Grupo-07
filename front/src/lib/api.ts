const API_URL = "http://localhost:3000";

// Tipos para as requisições
export interface FuncionarioCreateDTO {
  nome: string;
  cpf: string;
  setor: string;
  cargo: string;
}

export interface EPICreateDTO {
  epi: string;
  CA: string;
  modo_uso: string;
  validade: string;
  tipo: string;
  fabricante: string;
  data_entrada: string;
}

export interface SubstituicaoEPIDTO {
  identificadorFuncionario: string;
  motivo: string;
  novoEpi: EPICreateDTO;
}

// Serviços de Funcionário
export const FuncionarioAPI = {
  // Criar funcionário
  async criar(data: FuncionarioCreateDTO) {
    const response = await fetch(`${API_URL}/funcionarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || "Erro ao criar funcionário");
    }

    return response.json();
  },

  // Listar todos os funcionários
  async listar() {
    const response = await fetch(`${API_URL}/funcionarios`);

    if (!response.ok) {
      throw new Error("Erro ao listar funcionários");
    }

    return response.json();
  },

  // Buscar funcionário por CPF
  async buscarPorCpf(cpf: string) {
    const response = await fetch(`${API_URL}/funcionarios/buscar?cpf=${cpf}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensagem || "Erro ao buscar funcionário");
    }

    return response.json();
  },
};

// Serviços de EPI
export const EPIAPI = {
  // Criar EPI
  async criar(data: EPICreateDTO) {
    const response = await fetch(`${API_URL}/epis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || "Erro ao criar EPI");
    }

    return response.json();
  },

  // Listar todos os EPIs
  async listar() {
    const response = await fetch(`${API_URL}/epis`);

    if (!response.ok) {
      throw new Error("Erro ao listar EPIs");
    }

    return response.json();
  },

  // Buscar EPI por CA
  async buscarPorCA(ca: string) {
    const response = await fetch(`${API_URL}/epis/buscar/ca?ca=${ca}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensagem || "Erro ao buscar EPI");
    }

    return response.json();
  },

  // Buscar EPIs próximos de vencer
  async buscarProximosDeVencer(diasLimite: number = 90) {
    const response = await fetch(
      `${API_URL}/epis/vencimento?diasLimite=${diasLimite}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensagem || "Erro ao buscar EPIs vencendo");
    }

    return response.json();
  },

  // Registrar substituição de EPI
  async registrarSubstituicao(data: SubstituicaoEPIDTO) {
    const response = await fetch(`${API_URL}/epis/substituicao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || "Erro ao registrar substituição");
    }

    return response.json();
  },

  // Atualizar EPI
  async atualizar(ca: string, data: Partial<EPICreateDTO>) {
    const response = await fetch(`${API_URL}/epis/${ca}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || "Erro ao atualizar EPI");
    }

    return response.json();
  },

  // Remover EPI
  async remover(ca: string) {
    const response = await fetch(`${API_URL}/epis/${ca}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || "Erro ao remover EPI");
    }

    return response.json();
  },
};
