<?php
$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = '';
$dbName = 'airnet';

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($conn->connect_error) {
    // Log do erro para debug
    error_log('Database connection failed: ' . $conn->connect_error);
    
    // Enviar resposta de erro ao frontend
    header('Content-Type: application/json');
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'message' => 'Banco de dados indisponível. Tentando modo offline...'
    ]);
    // Não fazer exit aqui, deixar o frontend lidar com fallback
}

if ($conn) {
    $conn->set_charset('utf8mb4');
}
?>






