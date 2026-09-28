# ValiData Web 📦🌐

> Versão Web do **ValiData** — Sistema Inteligente de Gestão e Controle de Validades de Produtos para Varejo e Supermercados.

Desenvolvido com **ASP.NET Core Blazor Web App (.NET 10)** com renderização interativa do lado do servidor (`InteractiveServer`), permitindo acesso direto pelo navegador em qualquer dispositivo (Computador, Tablet ou Celular).

---

## 🚀 Funcionalidades Principais

* **Dashboard de Validades**:
  * Indicadores de produtos em dia, próximos ao vencimento, vencendo hoje e vencidos.
  * Filtros avançados por loja, status, categoria e busca textual.
  * Baixa rápida de lotes com histórico e motivo.
  * Compartilhamento instantâneo de relatórios via WhatsApp.

* **Gestão de Lojas e Unidades**:
  * Cadastro, edição e controle de múltiplas lojas/filiais.

* **Gestão de Equipes e Times**:
  * Convite de colaboradores por e-mail com permissões de acesso aos dados coletados.
  * Fluxo de primeiro acesso com senha inicial (123) e troca obrigatória na primeira conexão.

* **Importação Inteligente de Planilhas**:
  * Importação em lote via Excel (`.xlsx`) com mapeamento automático de colunas, detecção de formatos de data brasileiros e correção de acentuação (UTF-8 / Windows-1252).

* **Autenticação & Segurança**:
  * Criptografia de senhas com PBKDF2 (SHA-256 e Salt de 16 bytes).
  * Confirmação de e-mail e recuperação de senha.
  * Isolamento multi-inquilino (*multi-tenant*) por conta.

---

## 🛠️ Tecnologias Utilizadas

* **.NET 10 (C# 14)**
* **ASP.NET Core Blazor Web App (InteractiveServer)**
* **Entity Framework Core com SQLite**
* **MiniExcel** (leitura de alta performance de planilhas)
* **Bootstrap & CSS Moderno Responsivo**

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
* [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) ou superior instalado.

### Passos
1. Clone este repositório:
   ```bash
   git clone https://github.com/Enryk/appValidade-Web.git
   cd appValidade-Web
   ```

2. Restaure e compile a solução:
   ```bash
   dotnet build ValiData.Web.slnx
   ```

3. Inicie o servidor web:
   ```bash
   dotnet run --project MeuApp.Web
   ```

4. Abra no seu navegador:
   * **HTTP**: [http://localhost:5179](http://localhost:5179)
   * **HTTPS**: [https://localhost:7008](https://localhost:7008)

---

## 📁 Estrutura da Solução

* **`MeuApp.Web`**: Aplicação Web ASP.NET Core que hospeda os componentes Blazor, gerencia a injeção de dependência e configura os endpoints do servidor.
* **`MeuApp.Shared`**: Biblioteca Razor contendo todas as páginas, componentes visuais, serviços de regra de negócio, autenticação e modelos de dados.
