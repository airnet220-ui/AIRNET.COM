<?php
include __DIR__ . '/php/db.php';

$usersResult = $conn->query('SELECT id, name, email, provider, created_at FROM users ORDER BY created_at DESC');
$contactsResult = $conn->query('SELECT id, name, email, phone, subject, message, created_at FROM contact_messages ORDER BY created_at DESC');

$users = [];
$contacts = [];

if ($usersResult) {
    while ($row = $usersResult->fetch_assoc()) {
        $users[] = $row;
    }
}

if ($contactsResult) {
    while ($row = $contactsResult->fetch_assoc()) {
        $contacts[] = $row;
    }
}

$usersCount = count($users);
$contactsCount = count($contacts);
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin AirNet</title>
    <link rel="stylesheet" href="Asserts/Css/stylr.css">
    <style>
        body { background: #f3f7fb; }
        .admin-header { padding: 2rem 1rem; text-align: center; }
        .admin-header h1 { color: #127afd; margin-bottom: 0.5rem; }
        .admin-summary { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin-bottom: 2rem; }
        .summary-card { background: white; border-radius: 14px; padding: 1.5rem; min-width: 240px; box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
        .summary-card h2 { margin: 0 0 0.5rem; color: #127afd; }
        .summary-card p { color: #555; }
        .admin-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
        .admin-table th, .admin-table td { padding: 1rem; border: 1px solid #e0e0e0; text-align: left; }
        .admin-table th { background: #f7fbff; color: #127afd; }
        .admin-section { max-width: 1200px; margin: 0 auto 3rem; padding: 0 1rem; }
        .section-title { font-size: 1.8rem; color: #127afd; margin-bottom: 1rem; }
        .admin-nav { display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem; }
        .admin-nav a { text-decoration: none; color: #127afd; border: 1px solid #127afd; padding: 0.8rem 1.2rem; border-radius: 10px; transition: all 0.3s; }
        .admin-nav a:hover { background: #127afd; color: #fff; }
        @media (max-width: 768px) { .admin-summary { flex-direction: column; align-items: center; } .admin-table th, .admin-table td { font-size: 0.95rem; } }
    </style>
</head>
<body>
    <header class="cabecalho">
        <nav class="nav-bar">
            <a href="Index.html" id="nav-logo">AirNet</a>
            <div class="nav-mobile">
                <span class="nav-toggle" aria-label="Abrir menu">&#9776;</span>
                <ul class="nav-lista">
                    <li class="nav-item"><a href="Index.html">Início</a></li>
                    <li class="nav-item"><a href="serviços.html">Serviços</a></li>
                    <li class="nav-item"><a href="contactos.html">Contactos</a></li>
                    <li class="nav-item"><a href="parceiros.html">Parceiros</a></li>
                    <li class="nav-item"><a href="sites.html">Sites</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <main>
        <section class="admin-header">
            <h1>Painel de Administração AirNet</h1>
            <p>Visualize usuários registados e mensagens recebidas pelo site.</p>
        </section>

        <div class="admin-nav">
            <a href="admin.php">Dashboard</a>
            <a href="Increve-se.html">Criar Conta</a>
            <a href="contactos.html">Contactos</a>
        </div>

        <section class="admin-section">
            <div class="admin-summary">
                <div class="summary-card">
                    <h2>Usuários</h2>
                    <p>Total: <?php echo $usersCount; ?></p>
                </div>
                <div class="summary-card">
                    <h2>Mensagens</h2>
                    <p>Total: <?php echo $contactsCount; ?></p>
                </div>
            </div>

            <div>
                <h2 class="section-title">Usuários Registrados</h2>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Provider</th>
                            <th>Criado em</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $user): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($user['id']); ?></td>
                                <td><?php echo htmlspecialchars($user['name']); ?></td>
                                <td><?php echo htmlspecialchars($user['email']); ?></td>
                                <td><?php echo htmlspecialchars($user['provider']); ?></td>
                                <td><?php echo htmlspecialchars($user['created_at']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <div>
                <h2 class="section-title">Mensagens de Contacto</h2>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Assunto</th>
                            <th>Mensagem</th>
                            <th>Criada em</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($contacts as $contact): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($contact['id']); ?></td>
                                <td><?php echo htmlspecialchars($contact['name']); ?></td>
                                <td><?php echo htmlspecialchars($contact['email']); ?></td>
                                <td><?php echo htmlspecialchars($contact['phone']); ?></td>
                                <td><?php echo htmlspecialchars($contact['subject']); ?></td>
                                <td><?php echo nl2br(htmlspecialchars($contact['message'])); ?></td>
                                <td><?php echo htmlspecialchars($contact['created_at']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </section>
    </main>
    <script src="Asserts/js/script.js"></script>
</body>
</html>








