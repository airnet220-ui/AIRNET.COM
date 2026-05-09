# Guia de Configuração - AirNet Registration System

## 1. Configuração do Ambiente

### Pré-requisitos
- PHP 7.2 ou superior
- MySQL/MariaDB
- Servidor web (Apache, Nginx, ou similar)

### Arquivos necessários
- `php/pagina.php` - Backend PHP para registros
- `Increve-se.html` - Página de inscrição
- `Asserts/js/script.js` - JavaScript do frontend
- `Asserts/sql/pagina.sql` - Schema da base de dados

---

## 2. Configuração da Base de Dados

### Passo 1: Criar base de dados
1. Abra phpMyAdmin ou acesse MySQL em linha de comando
2. Execute o comando:
```sql
CREATE DATABASE IF NOT EXISTS airnet;
```

### Passo 2: Criar tabela de utilizadores
1. Selecione a base de dados 'airnet'
2. Vá à aba SQL e execute:

```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) DEFAULT NULL,
    provider VARCHAR(30) NOT NULL DEFAULT 'local',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Ou importe o arquivo: `Asserts/sql/pagina.sql`

---

## 3. Verificar Configuração do PHP

Edite o arquivo `php/pagina.php` e verifique as credenciais:

```php
$dbHost = 'localhost';    // Servidor MySQL
$dbUser = 'root';         // Utilizador MySQL
$dbPass = '';             // Palavra-passe (vazio se não houver)
$dbName = 'airnet';       // Nome da base de dados
```

### Nota:
Se está a usar outro utilizador ou palavra-passe, atualize estes valores!

---

## 4. Testar o Sistema

### Via Página Web:
1. Abra `Increve-se.html` no navegador
2. Preencha o formulário com:
   - Nome: `João Silva`
   - Email: `airnet220@gmail.com`
   - Palavra-passe: `ABC@123456`
   - Confirmar: `ABC@123456`
3. Clique em "Criar Conta"

### Via Console do Navegador:
1. Abra o Developer Tools (F12)
2. Console
3. Execute:
```javascript
sendRegister({
    action: 'register',
    name: 'Teste',
    email: 'airnet220@gmail.com',
    password: 'ABC123456',
    provider: 'local'
});
```

### Verificar na Base de Dados:
1. phpMyAdmin → base de dados `airnet` → tabela `users`
2. Ou execute em MySQL:
```sql
SELECT * FROM users;
```

---

## 5. Endpoints Disponíveis

### POST `/php/pagina.php`

#### ✅ Registro (register)
**Payload:**
```json
{
    "action": "register",
    "name": "Nome Completo",
    "email": "airnet220@gmail.com",
    "password": "ABC@123456",
    "provider": "local"
}
```

**Resposta Sucesso:**
```json
{
    "success": true,
    "message": "Conta criada com sucesso! Bem-vindo à AirNet",
    "user": {
        "id": 1,
        "name": "Nome Completo",
        "email": "airnet220@gmail.com",
        "provider": "local",
        "created_at": "2026-04-19 10:30:45"
    }
}
```

#### 🔓 Login (login)
**Payload:**
```json
{
    "action": "login",
    "email": "airnet220@gmail.com",
    "password": "ABC@123456"
}
```

#### 📋 Listar Utilizadores (listUsers)
**Payload:**
```json
{
    "action": "listUsers"
}
```

---

## 6. Validações

### Validações de Registro:
- ✓ Nome obrigatório
- ✓ Email válido
- ✓ Email único (não pode estar duplicado)
- ✓ Palavra-passe mínimo 6 caracteres
- ✓ Palavra-passe confirmada

### Tratamento de Erros:
| Erro | Causa |
|------|-------|
| "Email já registado" | Email existe na base de dados |
| "Email inválido" | Formato de email não válido |
| "Palavra-passe deve ter mínimo 6 caracteres" | Palavra-passe muito curta |
| "Erro ao conectar com a base de dados" | Credenciais da BD incorretas |

---

## 7. Problemas Comuns

### ❌ "Erro ao conectar com a base de dados"
**Solução:** Verifique as credenciais em `php/pagina.php`

### ❌ "Email já registado"
**Solução:** Use um email diferente ou limpe a tabela em phpMyAdmin

### ❌ "Falha ao conectar com o servidor"
**Solução:** 
- Verifique se PHP está instalado
- Teste com: `php -v`
- Verifique o caminho para `php/pagina.php`

### ❌ Página branca ao submeter
**Solução:**
- Abra Developer Tools (F12) → Console
- Veja o erro específico
- Verifique a resposta do servidor em Network

---

## 8. Segurança

### ✅ Implementado:
- Hash de palavras-passe com `password_hash()` (PHP)
- Validação de email
- Verificação de duplicatas
- Prepared statements contra SQL injection

### 🔒 Recomendações Futuras:
- Rate limiting para tentativas de login
- Email de confirmação
- HTTPS em produção
- Tokens JWT para sessão

---

## 9. Dados dos Utilizadores

### O que é armazenado:
```
ID (Auto)
Nome
Email (UNIQUE)
Hash da Palavra-passe
Provider (local/google/etc)
Data de criação
```

### Onde é armazenado:
- Base de dados MySQL → tabela `users`
- Browser localStorage (para sessão atual)

---

## Suporte

Para erros específicos, verifique:
1. Arquivo de logs do PHP: `/var/log/apache2/error.log` (Linux)
2. Console do navegador (F12)
3. Resposta JSON do servidor em Network

---

**Última atualização:** 19 de abril de 2026




