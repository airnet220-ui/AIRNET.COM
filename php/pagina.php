<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/db.php';

// Função para enviar resposta JSON
function sendResponse($success, $message, $user = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'user' => $user
    ]);
    exit;
}

// Verificar método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Método não permitido');
}

// Obter dados JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendResponse(false, 'Dados inválidos recebidos');
}

$action = $input['action'] ?? null;

// ===== AÇÃO: REGISTRO =====
if ($action === 'register') {
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $provider = $input['provider'] ?? 'local';

    // Validações
    if (empty($name)) {
        sendResponse(false, 'Nome é obrigatório');
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Email inválido');
    }

    if ($provider === 'local' && strlen($password) < 6) {
        sendResponse(false, 'Palavra-passe deve ter no mínimo 6 caracteres');
    }

    // Verificar se email já existe
    $checkStmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
    if (!$checkStmt) {
        sendResponse(false, 'Erro ao preparar consulta: ' . $conn->error);
    }

    $checkStmt->bind_param('s', $email);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {
        $checkStmt->close();
        sendResponse(false, 'Email já registado. Tente outro email ou faça login');
    }

    $checkStmt->close();

    // Hash da palavra-passe (apenas para local)
    $passwordHash = ($provider === 'local') ? password_hash($password, PASSWORD_DEFAULT) : null;

    // Inserir novo utilizador
    $insertStmt = $conn->prepare('INSERT INTO users (name, email, password_hash, provider, created_at) VALUES (?, ?, ?, ?, NOW())');
    
    if (!$insertStmt) {
        sendResponse(false, 'Erro ao preparar inserção: ' . $conn->error);
    }

    $insertStmt->bind_param('ssss', $name, $email, $passwordHash, $provider);

    if (!$insertStmt->execute()) {
        sendResponse(false, 'Erro ao criar conta: ' . $insertStmt->error);
    }

    $userId = $insertStmt->insert_id;
    $insertStmt->close();

    $user = [
        'id' => $userId,
        'name' => $name,
        'email' => $email,
        'provider' => $provider,
        'created_at' => date('Y-m-d H:i:s')
    ];

    sendResponse(true, 'Conta criada com sucesso! Bem-vindo à AirNet', $user);
}

// ===== AÇÃO: LOGIN =====
else if ($action === 'login') {
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        sendResponse(false, 'Email e palavra-passe são obrigatórios');
    }

    // Buscar utilizador
    $stmt = $conn->prepare('SELECT id, name, email, password_hash, provider FROM users WHERE email = ?');
    if (!$stmt) {
        sendResponse(false, 'Erro ao consultar: ' . $conn->error);
    }

    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        sendResponse(false, 'Email ou palavra-passe incorretos');
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    // Verificar palavra-passe
    if (!password_verify($password, $user['password_hash'])) {
        sendResponse(false, 'Email ou palavra-passe incorretos');
    }

    unset($user['password_hash']);

    sendResponse(true, 'Login realizado com sucesso', $user);
}

// ===== AÇÃO: MENSAGEM DE CONTACTO =====
else if ($action === 'contact') {
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $subject = trim($input['subject'] ?? '');
    $message = trim($input['message'] ?? '');

    if (empty($name)) {
        sendResponse(false, 'Nome é obrigatório');
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Email inválido');
    }

    if (empty($subject)) {
        sendResponse(false, 'Assunto é obrigatório');
    }

    if (empty($message)) {
        sendResponse(false, 'Mensagem é obrigatória');
    }

    $insertStmt = $conn->prepare('INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())');
    if (!$insertStmt) {
        sendResponse(false, 'Erro ao preparar inserção: ' . $conn->error);
    }

    $insertStmt->bind_param('sssss', $name, $email, $phone, $subject, $message);
    if (!$insertStmt->execute()) {
        sendResponse(false, 'Erro ao enviar mensagem: ' . $insertStmt->error);
    }

    $insertStmt->close();
    sendResponse(true, 'Mensagem recebida com sucesso!', ['name' => $name, 'email' => $email]);
}

// ===== AÇÃO: LISTAR UTILIZADORES (apenas para testes) =====
else if ($action === 'listUsers') {
    $result = $conn->query('SELECT id, name, email, provider, created_at FROM users ORDER BY created_at DESC');
    
    if (!$result) {
        sendResponse(false, 'Erro ao listar utilizadores: ' . $conn->error);
    }

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode([
        'success' => true,
        'users' => $users,
        'total' => count($users)
    ]);
    exit;
}

// ===== AÇÃO: BUSCA =====
else if ($action === 'search') {
    $type = $input['type'] ?? 'general';
    $query = trim($input['query'] ?? '');

    if (empty($query)) {
        sendResponse(false, 'Termo de busca é obrigatório');
    }

    $results = [];

    switch ($type) {
        case 'general':
            // Busca geral - combina resultados de diferentes áreas
            $results = performGeneralSearch($query);
            break;
        case 'service':
            // Busca específica de serviços
            $results = performServiceSearch($query);
            break;
        case 'project':
            // Busca de projetos
            $results = performProjectSearch($query);
            break;
        case 'contact':
            // Busca de informações de contato
            $results = performContactSearch($query);
            break;
        default:
            sendResponse(false, 'Tipo de busca inválido');
    }

    sendResponse(true, 'Busca realizada com sucesso', ['results' => $results]);
}

// ===== FUNÇÕES DE BUSCA =====

function performGeneralSearch($query) {
    $results = [];

    // Busca em serviços
    $serviceResults = performServiceSearch($query);
    $results = array_merge($results, $serviceResults);

    // Busca em projetos
    $projectResults = performProjectSearch($query);
    $results = array_merge($results, $projectResults);

    // Busca em contatos
    $contactResults = performContactSearch($query);
    $results = array_merge($results, $contactResults);

    return $results;
}

function performServiceSearch($query) {
    $services = [
        [
            'title' => 'Desenvolvimento Web Full Stack',
            'description' => 'Desenvolvimento completo de aplicações web com frontend e backend.',
            'link' => 'serviços.html'
        ],
        [
            'title' => 'E-Commerce Solutions',
            'description' => 'Soluções completas de loja online com integração de pagamentos.',
            'link' => 'serviços.html'
        ],
        [
            'title' => 'Documentação Técnica',
            'description' => 'Criação de documentação profissional para projetos.',
            'link' => 'serviços.html'
        ],
        [
            'title' => 'Segurança e Compliance',
            'description' => 'Implementação de práticas de segurança e conformidade.',
            'link' => 'serviços.html'
        ],
        [
            'title' => 'Criação de Sites com IA',
            'description' => 'Serviço premium de criação de sites usando inteligência artificial AirNet.',
            'link' => 'sites.html'
        ]
    ];

    $results = [];
    $queryLower = strtolower($query);

    foreach ($services as $service) {
        if (strpos(strtolower($service['title']), $queryLower) !== false ||
            strpos(strtolower($service['description']), $queryLower) !== false) {
            $results[] = $service;
        }
    }

    return $results;
}

function performProjectSearch($query) {
    $projects = [
        [
            'title' => 'E-Commerce Profissional',
            'description' => 'Loja online moderna com carrinho de compras e gestão de inventário.',
            'link' => 'sites.html'
        ],
        [
            'title' => 'Portal Informativo',
            'description' => 'Site corporativo com blog integrado e sistema de contato.',
            'link' => 'sites.html'
        ],
        [
            'title' => 'Sistema de Gestão',
            'description' => 'Plataforma para gestão de clientes e relatórios analíticos.',
            'link' => 'sites.html'
        ],
        [
            'title' => 'Sistema de Registro AirNet',
            'description' => 'Sistema completo de registro e autenticação de usuários.',
            'link' => 'Increve-se.html'
        ]
    ];

    $results = [];
    $queryLower = strtolower($query);

    foreach ($projects as $project) {
        if (strpos(strtolower($project['title']), $queryLower) !== false ||
            strpos(strtolower($project['description']), $queryLower) !== false) {
            $results[] = $project;
        }
    }

    return $results;
}

function performContactSearch($query) {
    $contacts = [
        [
            'title' => 'WhatsApp Suporte',
            'description' => 'Contato direto via WhatsApp: +244 956 239 945',
            'link' => 'http://wa.me/+244956239945'
        ],
        [
            'title' => 'Formulário de Contato',
            'description' => 'Envie sua mensagem através do formulário de contato do site.',
            'link' => 'contactos.html'
        ],
        [
            'title' => 'Link Oficial AirNet',
            'description' => 'Site oficial: https://airnet-angola.com',
            'link' => 'https://airnet-angola.com'
        ],
        [
            'title' => 'Suporte Técnico',
            'description' => 'Equipe especializada em resolução de problemas técnicos.',
            'link' => 'contactos.html'
        ]
    ];

    $results = [];
    $queryLower = strtolower($query);

    foreach ($contacts as $contact) {
        if (strpos(strtolower($contact['title']), $queryLower) !== false ||
            strpos(strtolower($contact['description']), $queryLower) !== false) {
            $results[] = $contact;
        }
    }

    return $results;
}

else {
    sendResponse(false, 'Ação não reconhecida');
}

$conn->close();
?>







