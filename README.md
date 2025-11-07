# Sistema de Gerenciamento de EPIs

Sistema completo para gerenciamento de Equipamentos de Proteção Individual (EPIs) e funcionários, com frontend em React e backend em Node.js + TypeScript.

## Estrutura do Projeto

```
Projeto-Integrador-Grupo-07/
├── api/           # Backend Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controller/    # Controllers da API
│   │   ├── service/       # Lógica de negócio
│   │   ├── model/         # Modelos de dados
│   │   └── server.ts      # Servidor Express
│   └── package.json
│
└── front/         # Frontend React + TypeScript + Vite
    ├── src/
    │   ├── components/    # Componentes React
    │   ├── lib/          # Utilitários e API client
    │   ├── pages/        # Páginas da aplicação
    │   └── types/        # Tipos TypeScript
    └── package.json
```

## Requisitos

- Node.js 16+
- npm ou yarn

## Instalação

### 1. Backend (API)

```bash
cd api
npm install
```

### 2. Frontend

```bash
cd front
npm install
```

## Executando o Sistema

### 1. Iniciar o Backend

```bash
cd api
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### 2. Iniciar o Frontend

Em outro terminal:

```bash
cd front
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Funcionalidades Integradas

### 1. Cadastro de Funcionários
- **Endpoint**: `POST /funcionarios`
- **Campos**: Nome, CPF, Setor, Cargo
- O CPF é usado como identificador único
- Validações automáticas no backend

### 2. Listagem de Funcionários
- **Endpoint**: `GET /funcionarios`
- Retorna todos os funcionários cadastrados
- Formatação automática do CPF no frontend

### 3. Busca de Funcionário por CPF
- **Endpoint**: `GET /funcionarios/buscar?cpf={cpf}`
- Busca funcionário específico pelo CPF

### 4. Cadastro de EPIs
- **Endpoint**: `POST /epis`
- **Campos**: Nome, CA, Tipo, Modo de Uso, Validade, Fabricante, Data de Entrada
- O CA é usado como identificador único
- Validações de obrigatoriedade no backend

### 5. Listagem de EPIs
- **Endpoint**: `GET /epis`
- Retorna todos os EPIs cadastrados
- Conversão automática de datas

### 6. Busca de EPI por CA
- **Endpoint**: `GET /epis/buscar/ca?ca={ca}`
- Busca EPI específico pelo número do CA

### 7. EPIs Próximas de Vencer
- **Endpoint**: `GET /epis/vencimento?diasLimite={dias}`
- Retorna EPIs que estão próximas de vencer
- Padrão: 90 dias
- Interface específica mostra EPIs vencidas e próximas de vencer (30 dias)

### 8. Atribuição de EPIs a Funcionários
- **Endpoint**: `POST /epis/substituicao`
- Registra a entrega/substituição de EPI para funcionário
- Cria histórico de entregas
- Interface permite vincular EPIs a funcionários

### 9. Remoção de EPIs
- **Endpoint**: `DELETE /epis/{ca}`
- Remove EPI pelo número do CA

## Estrutura da API

### Models

#### Funcionario
```typescript
{
  nome: string;
  cpf: string;
  setor: string;
  cargo: string;
}
```

#### EPI
```typescript
{
  epi: string;
  CA: string;
  modo_uso: string;
  validade: Date;
  tipo: string;
  fabricante: string;
  data_entrada: Date;
}
```

### Services

- **FuncionarioService**: Gerencia funcionários e histórico de EPIs
- **EPIService**: Gerencia EPIs e substituições

### Controllers

- **FuncionarioController**: Rotas de funcionários
- **EPIController**: Rotas de EPIs

## Fluxo de Dados

1. **Frontend** → Chamadas HTTP → **Backend API**
2. **Backend** → Validação via Models → Services → Controllers
3. **Controllers** → Resposta JSON → **Frontend**
4. **Frontend** → Atualização de estado → Renderização

## Tecnologias Utilizadas

### Backend
- Node.js
- Express 5
- TypeScript
- ts-node

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Query (React Query)
- Shadcn/ui (componentes)
- Tailwind CSS
- Sonner (notificações toast)
- date-fns (manipulação de datas)
- jsPDF (geração de PDFs)

## CORS

O backend está configurado para aceitar requisições de qualquer origem durante o desenvolvimento:

```typescript
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // ...
});
```

## Armazenamento de Dados

### Backend
- Armazenamento em memória (arrays)
- Dados são perdidos ao reiniciar o servidor
- Para produção, recomenda-se integrar um banco de dados

### Frontend
- As atribuições de EPIs são salvas temporariamente no localStorage
- Os dados principais (funcionários e EPIs) vêm da API
- Sincronização automática após operações

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /funcionarios | Cadastrar funcionário |
| GET | /funcionarios | Listar funcionários |
| GET | /funcionarios/buscar?cpf={cpf} | Buscar por CPF |
| POST | /epis | Cadastrar EPI |
| GET | /epis | Listar EPIs |
| GET | /epis/buscar/ca?ca={ca} | Buscar por CA |
| GET | /epis/vencimento?diasLimite={dias} | EPIs vencendo |
| POST | /epis/substituicao | Atribuir/Substituir EPI |
| DELETE | /epis/{ca} | Remover EPI |

## Observações Importantes

1. **CPF**: Usado como identificador único de funcionários (sem formatação no backend)
2. **CA**: Usado como identificador único de EPIs
3. **Datas**: Backend usa Date, frontend converte para string (YYYY-MM-DD)
4. **Validações**: Campos obrigatórios são validados no backend via Models
5. **Histórico**: A API mantém histórico de substituições/entregas de EPIs

## Próximas Melhorias

- [ ] Integração com banco de dados (PostgreSQL/MongoDB)
- [ ] Autenticação e autorização
- [ ] Endpoints para edição de funcionários e EPIs
- [ ] Endpoint específico para atribuições (sem usar substituição)
- [ ] Relatórios mais detalhados
- [ ] Notificações por email para EPIs vencendo
- [ ] Testes unitários e de integração

## Suporte

Para dúvidas ou problemas, consulte a documentação dos endpoints ou verifique os logs do servidor.
