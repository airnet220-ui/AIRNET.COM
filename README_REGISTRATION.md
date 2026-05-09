# 🎯 Sistema de Registo AirNet - Documentação Completa

## ✅ Alterações Realizadas

### 1. **Backend PHP** (`php/pagina.php`)
✨ **Arquivo criado com funcionalidades completas:**

- ✓ Conexão à base de dados MySQL
- ✓ Registo de utilizadores com validação
- ✓ Login de utilizadores
- ✓ Listar todos os utilizadores
- ✓ Hash seguro de palavras-passe (PASSWORD_DEFAULT)
- ✓ Validação de email duplicado
- ✓ Suporte para múltiplos provedores (local, Google, etc)
- ✓ Resposta JSON estruturada

### 2. **JavaScript Frontend** (`Asserts/js/script.js`)
✨ **Atualizado com integração completa:**

- ✓ Função `sendRegister()` - Regista novo utilizador
- ✓ Função `googleSignup()` - Inscrição via Google
- ✓ Validação de formulário no frontend
- ✓ Mensagens de erro inteligentes
- ✓ Armazenamento em localStorage
- ✓ Redirecionamento após sucesso
- ✓ Suporte para Enter no formulário

### 3. **Página de Inscrição** (`Increve-se.html`)
✨ **Recriada com design profissional:**

- ✓ Formulário completo com validação
- ✓ Integração com backend
- ✓ Botão Google Sign-in
- ✓ Seção de benefícios da conta
- ✓ Responsivo em mobile
- ✓ Header com navegação
- ✓ Footer com botões

### 4. **Estilos CSS** (`Asserts/Css/stylr.css`)
✨ **Adicionados estilos para inscrição:**

- ✓ `.section-inscricao` - Seção principal
- ✓ `.inscricao-card` - Card de título
- ✓ `.inscricao-form` - Contêiner do formulário
- ✓ `.form-group` - Grupos de input
- ✓ `.btn-register` - Botão de registo
- ✓ `.btn-google` - Botão Google
- ✓ `.inscricao-info` - Informações sobre benefícios
- ✓ Responsive media queries

### 5. **Página de Testes** (`test-api.html`)
✨ **Criada para facilitar testes:**

- ✓ Teste de conexão à BD
- ✓ Teste de registo
- ✓ Teste de login
- ✓ Listar utilizadores
- ✓ Requisições personalizadas
- ✓ Interface visual intuitiva

### 6. **Documentação** (`SETUP_DATABASE.md`)
✨ **Guia completo de setup:**

- ✓ Instruções de configuração
- ✓ SQL para criar tabela
- ✓ Credenciais da BD
- ✓ Endpoints disponíveis
- ✓ Validações implementadas
- ✓ Troubleshooting

### 7. **Base de Dados** (`Asserts/sql/pagina.sql`)
✓ Tabela `users` com:
- ID (Auto increment)
- Name (VARCHAR 120)
- Email (VARCHAR 180, UNIQUE)
- Password_hash (VARCHAR 255)
- Provider (VARCHAR 30)
- Created_at (DATETIME)

---

## 🚀 Como Usar

### Passo 1: Configurar Base de Dados
```bash
# No phpMyAdmin ou MySQL CLI
CREATE DATABASE airnet;
USE airnet;
# Execute o conteúdo de Asserts/sql/pagina.sql
```

### Passo 2: Verificar Credenciais PHP
Edite `php/pagina.php` linhas 8-11:
```php
$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = '';
$dbName = 'airnet';
```

### Passo 3: Testar a Inscrição
1. Acesse `Increve-se.html` no navegador
2. Preencha o formulário
3. Clique em "Criar Conta"
4. Verificar na base de dados: `SELECT * FROM users;`

---

## 🔍 Fluxo de Funcionamento

```
┌─────────────────────────────────────────────────────────┐
│ Incrementação Utilizador (Increve-se.html)              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Validação Frontend   │
      │ - Nome               │
      │ - Email              │
      │ - Palavra-passe      │
      │ - Confirmação        │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ JavaScript (script) │
      │ sendRegister()      │
      │ Fetch POST          │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Backend PHP          │
      │ php/pagina.php       │
      │ action: 'register'   │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Validações PHP       │
      │ - Email válido       │
      │ - Email único        │
      │ - Palavra-passe 6+   │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Hash Palavra-passe   │
      │ password_hash()      │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Inserir BD MySQL     │
      │ INSERT INTO users    │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Resposta JSON        │
      │ {success, message,   │
      │  user}               │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ localStorage         │
      │ Armazenar sessão     │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Redirecionamento     │
      │ → Index.html         │
      └──────────────────────┘
```

---

## 📋 Endpoints da API

### 1️⃣ Registo
**URL:** `POST /php/pagina.php`

**Request:**
```json
{
    "action": "register",
    "name": "João Silva",
    "email": "airnet220@gmail.com",
    "password": "ABC@123456",
    "provider": "local"
}
```

**Response (Sucesso):**
```json
{
    "success": true,
    "message": "Conta criada com sucesso! Bem-vindo à AirNet",
    "user": {
        "id": 1,
        "name": "João Silva",
        "email": "airnet220@gmail.com",
        "provider": "local",
        "created_at": "2026-04-19 10:30:45"
    }
}
```

### 2️⃣ Login
**Request:**
```json
{
    "action": "login",
    "email": "airnet220@gmail.com",
    "password": "ABC@123456"
}
```

### 3️⃣ Listar Utilizadores
**Request:**
```json
{"action": "listUsers"}
```

---

## ⚡ Recursos Ativos

| Arquivo | Tipo | Status | Descrição |
|---------|------|--------|-----------|
| `Increve-se.html` | HTML | ✅ Operacional | Página de inscrição |
| `php/pagina.php` | PHP | ✅ Operacional | Backend da API |
| `Asserts/js/script.js` | JavaScript | ✅ Operacional | Frontend logic |
| `Asserts/Css/stylr.css` | CSS | ✅ Operacional | Estilos |
| `Asserts/sql/pagina.sql` | SQL | ✅ Operacional | Schema da BD |
| `test-api.html` | HTML | ✅ Teste | Página de testes |
| `SETUP_DATABASE.md` | Markdown | 📖 Docs | Guia de setup |

---

## 🔐 Segurança Implementada

✅ **Hash de Palavras-passe:** `PASSWORD_DEFAULT` (bcrypt)
✅ **Validação de Email:** `filter_var(..., FILTER_VALIDATE_EMAIL)`
✅ **Email Único:** Verificação antes de inserir
✅ **Prepared Statements:** Proteção contra SQL injection
✅ **JSON Response:** Sem exposição de dados sensíveis
✅ **CORS Headers:** Permitir requisições cross-origin

---

## 🐛 Troubleshooting

### ❌ "Erro ao conectar com a base de dados"
**Solução:**
1. Verifique se MySQL está a correr
2. Confirme credenciais em `php/pagina.php`
3. Execute: `mysql -u root -p`
4. Crie: `CREATE DATABASE airnet;`

### ❌ "Email já registado"
**Solução:** Use um email diferente ou limpe a tabela

### ❌ "Falha ao conectar com o servidor"
**Solução:**
1. Abra DevTools (F12)
2. Vá à aba Network
3. Veja o erro na requisição para `php/pagina.php`
4. Verifique path relativo

---

## 📱 Responsividade

✅ Testado em:
- Desktop (1920x1080)
- Tablet (768px)
- Mobile (375x667)

---

## 📞 Funcionalidades Futuras

- [ ] Email de confirmação
- [ ] Recuperação de palavra-passe
- [ ] Autenticação 2FA
- [ ] Integração real com Google Login
- [ ] Dashboard do utilizador
- [ ] Perfil editável

---

**Última atualização:** 19 de abril de 2026
**Status:** ✅ Pronto para uso




