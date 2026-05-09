-- Base de dados AirNet
CREATE DATABASE IF NOT EXISTS airnet;
USE airnet;

-- Tabela de usuários para o sistema de cadastro
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) DEFAULT NULL,
    provider VARCHAR(30) NOT NULL DEFAULT 'local',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de mensagens de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL,
    phone VARCHAR(40) DEFAULT NULL,
    subject VARCHAR(120) NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Exemplo de consulta para verificar um usuário
-- SELECT * FROM users WHERE email = 'usuario@gmail.com';

-- Exemplo de consulta para verificar mensagens
-- SELECT * FROM contact_messages ORDER BY created_at DESC;
