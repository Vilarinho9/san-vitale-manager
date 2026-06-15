San Vitale Manager
Descrição do Projeto

O San Vitale Manager é um sistema de gestão desenvolvido para a empresa San Vitale Beleza & Bem-Estar, com o objetivo de centralizar e automatizar processos administrativos, operacionais e comerciais da empresa.

A plataforma foi projetada para oferecer uma experiência moderna, intuitiva e eficiente, permitindo o gerenciamento completo de clientes, serviços, agendamentos, pagamentos, relatórios e demais recursos necessários para o funcionamento do negócio.

Objetivos do Sistema

O projeto tem como finalidade:

Centralizar informações em uma única plataforma.
Automatizar processos internos.
Melhorar o controle financeiro.
Facilitar o gerenciamento de clientes e serviços.
Reduzir erros operacionais.
Aumentar a produtividade da equipe.
Melhorar a experiência dos clientes.
Tecnologias Utilizadas
Front-end
Vue.js 3
Vite
JavaScript
HTML5
CSS3
Pinia
Axios
Back-end
Node.js
Express.js
Banco de Dados
PostgreSQL
Supabase
Segurança
Row Level Security (RLS)
Autenticação de usuários
Controle de permissões
Variáveis de ambiente protegidas
Comunicação via HTTPS
Proteção contra acessos não autorizados
Estrutura do Banco de Dados

O sistema utiliza um banco de dados relacional composto pelas seguintes tabelas principais:

Clientes

Armazena informações dos clientes:

Nome
Telefone
E-mail
Data de nascimento
Observações
Data de cadastro
Serviços

Responsável pelo cadastro dos serviços oferecidos pela empresa:

Nome do serviço
Categoria
Descrição
Duração
Valor
Status ativo/inativo
Agendamentos

Controla todos os atendimentos realizados:

Cliente
Serviço
Data
Horário
Status do atendimento
Observações
Combos Semanais

Gerencia promoções e pacotes especiais:

Título
Descrição
Valor
Validade
Status
Funcionalidades Implementadas
Dashboard
Indicadores em tempo real
Visão geral do negócio
Métricas operacionais
Resumo financeiro
Gestão de Clientes
Cadastro de clientes
Edição de informações
Histórico de atendimentos
Observações internas
Controle de aniversários
Gestão de Serviços
Cadastro de serviços
Organização por categorias
Controle de preços
Controle de duração
Ativação e desativação de serviços
Agenda Inteligente
Agendamento de atendimentos
Controle de horários
Confirmação de consultas
Atualização de status
Recepção

Acompanhamento em tempo real dos atendimentos:

Cliente agendado
Cliente confirmado
Cliente presente
Atendimento em andamento
Atendimento finalizado
Pagamento realizado
Financeiro
Controle de receitas
Relatórios financeiros
Histórico de pagamentos
Indicadores de faturamento
API do Sistema

O sistema possui uma API REST responsável pela comunicação entre o front-end e o banco de dados.

Principais Endpoints
Clientes
GET /clientes
GET /clientes/:id
POST /clientes
PUT /clientes/:id
DELETE /clientes/:id
Serviços
GET /servicos
GET /servicos/:id
POST /servicos
PUT /servicos/:id
DELETE /servicos/:id
Agendamentos
GET /agendamentos
GET /agendamentos/:id
POST /agendamentos
PUT /agendamentos/:id
DELETE /agendamentos/:id
Segurança dos Dados

O sistema foi desenvolvido seguindo boas práticas de segurança:

Controle de acesso por autenticação.
Proteção de rotas privadas.
Restrição de acesso aos dados através do RLS do Supabase.
Armazenamento seguro das credenciais.
Validação de dados no front-end e back-end.
Tratamento de erros e exceções.
Benefícios para a Empresa

Com a utilização do San Vitale Manager, a empresa passa a ter:

Maior organização operacional.
Controle centralizado das informações.
Redução de processos manuais.
Melhor acompanhamento dos atendimentos.
Controle financeiro mais eficiente.
Melhor relacionamento com os clientes.
Escalabilidade para futuras funcionalidades.
Possíveis Expansões Futuras

O sistema foi estruturado para permitir a implementação de novos módulos, como:

E-commerce integrado.
Checkout online.
Área exclusiva do cliente.
Programa de fidelidade.
Integração com WhatsApp.
Integração com gateways de pagamento.
Relatórios avançados.
Aplicativo mobile.
Automações de marketing.
Controle de estoque.
Autor

Projeto: San Vitale Manager
Tipo: Sistema Web de Gestão Empresarial
Tecnologias: Vue.js, Node.js, Express, PostgreSQL e Supabase
Versão: 1.0.0

San Vitale Manager foi desenvolvido para proporcionar uma gestão moderna, segura e eficiente, alinhada às necessidades operacionais da San Vitale Beleza & Bem-Estar.
