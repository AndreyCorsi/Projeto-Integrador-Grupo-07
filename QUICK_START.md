# Guia Rápido - Sistema de Gerenciamento de EPIs

## Início Rápido

### Passo 1: Instalar Dependências

```bash
# Terminal 1 - Backend
cd api
npm install

# Terminal 2 - Frontend
cd front
npm install
```

### Passo 2: Iniciar o Sistema

```bash
# Terminal 1 - Backend (porta 3000)
cd api
npm run dev

# Terminal 2 - Frontend (porta 5173)
cd front
npm run dev
```

### Passo 3: Acessar o Sistema

Abra o navegador em: `http://localhost:5173`

## Uso do Sistema

### 1. Cadastrar EPIs

1. Clique na aba **"Cadastro de EPI"**
2. Preencha todos os campos:
   - Nome do EPI
   - Validade (data)
   - CA (número do Certificado de Aprovação)
   - Tipo/Finalidade
   - Modo de Uso
   - Fabricante
   - Data de Entrega
3. Clique em **"Cadastrar EPI"**

### 2. Cadastrar Funcionários

1. Clique na aba **"Cadastro de Funcionário"**
2. Preencha todos os campos:
   - Nome completo
   - CPF (será formatado automaticamente)
   - Cargo
   - Setor
3. Clique em **"Cadastrar Funcionário"**

### 3. Atribuir EPIs a Funcionários

1. Clique na aba **"Funcionários e EPIs"**
2. Encontre o funcionário na lista
3. No dropdown, selecione o EPI a ser atribuído
4. Clique no botão **"+"**
5. O EPI aparecerá na lista do funcionário

### 4. Visualizar EPIs Vencidas

1. Clique na aba **"EPIs Vencidas"**
2. Veja duas listas:
   - **EPIs Vencidas** (vermelho): EPIs que já passaram da validade
   - **EPIs Próximas de Vencer** (amarelo): EPIs que vencem em até 30 dias

### 5. Gerar Ficha de EPI (PDF)

1. Na aba **"Funcionários e EPIs"**
2. Clique no ícone de **documento** ao lado do nome do funcionário
3. O PDF será gerado automaticamente com todos os EPIs atribuídos

### 6. Editar Dados do Funcionário

1. Na aba **"Funcionários e EPIs"**
2. Clique no ícone de **usuário** ao lado do nome
3. Edite os dados no modal
4. Clique em **"Salvar Alterações"**

### 7. Atualizar Validade do EPI

1. Na lista de EPIs do funcionário
2. Clique no ícone de **editar** ao lado do EPI
3. Altere a data de validade
4. Clique em **"Salvar Alterações"**

### 8. Buscar Funcionário ou CA

1. Use o campo de busca no topo da lista
2. Digite o nome do funcionário ou número do CA
3. A lista será filtrada automaticamente

## Integração API-Frontend

### Como funciona?

1. **Cadastro**: Quando você cadastra um funcionário ou EPI, os dados são enviados para a API
2. **Listagem**: Ao abrir o sistema, todos os dados são carregados da API
3. **Atualização**: Após cada operação, a lista é recarregada da API
4. **Validação**: A API valida todos os dados antes de salvar

### Testando a Integração

1. Cadastre um funcionário
2. Cadastre um EPI
3. Recarregue a página (F5)
4. Os dados devem continuar aparecendo (vêm da API)

### Importante

- Os dados são armazenados **em memória** na API
- Se você reiniciar o backend (`npm run dev`), os dados serão perdidos
- As atribuições são salvas no **localStorage** do navegador

## Estrutura de Dados

### Funcionário
```json
{
  "nome": "João Silva",
  "cpf": "12345678900",
  "cargo": "Operador",
  "setor": "Produção"
}
```

### EPI
```json
{
  "epi": "Capacete de Segurança",
  "CA": "12345",
  "modo_uso": "Uso obrigatório em áreas de risco",
  "validade": "2025-12-31",
  "tipo": "Proteção da cabeça",
  "fabricante": "EPI Ltda",
  "data_entrada": "2024-01-15"
}
```

### Atribuição de EPI
```json
{
  "identificadorFuncionario": "12345678900",
  "motivo": "Atribuição de EPI",
  "novoEpi": { /* dados do EPI */ }
}
```

## Solução de Problemas

### Frontend não conecta com o Backend

1. Verifique se o backend está rodando na porta 3000
2. Veja o terminal do backend para mensagens de erro
3. Confira se não há firewall bloqueando

### Erro ao cadastrar

1. Verifique se todos os campos estão preenchidos
2. No caso de CPF, use 11 dígitos
3. Veja o console do navegador (F12) para erros

### Dados não aparecem após recarregar

1. Para funcionários e EPIs: verifique se o backend está rodando
2. Para atribuições: podem ter sido perdidas se o localStorage foi limpo

### API retorna erro 400

1. Verifique os logs no terminal do backend
2. Confirme que os campos obrigatórios estão preenchidos
3. Verifique se o formato dos dados está correto

## Dicas

- Use o **Chrome DevTools** (F12) para ver requisições à API
- Aba **Network** mostra todas as chamadas HTTP
- Console mostra erros do JavaScript
- Mantenha os dois terminais (backend e frontend) abertos

## Atalhos

- **Ctrl + C**: Parar servidor (backend ou frontend)
- **F5**: Recarregar página
- **F12**: Abrir ferramentas de desenvolvedor
- **Ctrl + Shift + R**: Recarregar ignorando cache

## Próximos Passos

1. Adicione alguns funcionários de teste
2. Cadastre EPIs variados
3. Atribua EPIs aos funcionários
4. Teste a busca e os filtros
5. Gere PDFs
6. Experimente editar dados

## Contato e Suporte

Para dúvidas, consulte:
- README.md (documentação completa)
- Código-fonte comentado
- Logs do servidor (terminal do backend)
