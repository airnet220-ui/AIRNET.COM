const apiUrl = 'php/pagina.php';

// ===== GERENCIAR AUTENTICAÇÃO =====
function initAuthUI() {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // Encontrar a navbar para inserir o menu de perfil no centro
        const navBar = document.querySelector('.nav-bar');
        const navLogo = document.querySelector('#nav-logo');
        const navMobile = document.querySelector('.nav-mobile');
        
        if (navBar && navLogo && navMobile) {
            // Criar container de perfil
            const profileContainer = document.createElement('div');
            profileContainer.className = 'profile-container';
            profileContainer.id = 'profile-menu';
            profileContainer.innerHTML = `
                <div class="profile-avatar" id="profile-toggle">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="profile-dropdown" id="profile-dropdown" style="display:none;">
                    <div class="profile-header">
                        <h3>${sanitizeHtml(currentUser.name)}</h3>
                        <p>${sanitizeHtml(currentUser.email)}</p>
                    </div>
                    <div class="profile-menu-items">
                        <a href="#" class="profile-menu-item" onclick="goToProfile(event)"><i class="fas fa-user"></i> Meu Perfil</a>
                        <a href="#" class="profile-menu-item" onclick="addAnotherAccount(event)"><i class="fas fa-plus"></i> Adicionar Outra Conta</a>
                        <a href="#" class="profile-menu-item" onclick="viewSettings(event)"><i class="fas fa-cog"></i> Configurações</a>
                        <hr>
                        <a href="#" class="profile-menu-item logout" onclick="logout(event)"><i class="fas fa-sign-out-alt"></i> Sair</a>
                    </div>
                </div>
            `;
            
            // Inserir o menu de perfil entre a logo e nav-mobile (no centro)
            navBar.insertBefore(profileContainer, navMobile);
            
            // Adicionar evento para toggle do menu
            const profileToggle = document.getElementById('profile-toggle');
            const profileDropdown = document.getElementById('profile-dropdown');
            
            if (profileToggle) {
                profileToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    profileDropdown.style.display = profileDropdown.style.display === 'none' ? 'block' : 'none';
                });
                
                // Fechar ao clicar fora
                document.addEventListener('click', (e) => {
                    if (!profileContainer.contains(e.target)) {
                        profileDropdown.style.display = 'none';
                    }
                });
            }
        }
    }
}

// Função para sanitizar HTML (prevenir XSS)
function sanitizeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getCurrentUser() {
    try {
        const user = localStorage.getItem('airnetUser');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error('Erro ao obter usuário:', e);
        return null;
    }
}

function logout(event) {
    event.preventDefault();
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('airnetUser');
        window.location.href = 'Index.html';
    }
}

function goToProfile(event) {
    event.preventDefault();
    const user = getCurrentUser();
    if (user) {
        showProfileModal(user);
    }
}

function viewSettings(event) {
    event.preventDefault();
    const user = getCurrentUser();
    if (user) {
        showSettingsModal(user);
    }
}

function showProfileModal(user) {
    // Fechar qualquer modal aberto
    const existingModal = document.getElementById('profile-modal-overlay');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'profile-modal-overlay';
    overlay.className = 'profile-modal-overlay';
    
    const backgroundImg = user.backgroundImage || '#127afd';
    const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();
    
    overlay.innerHTML = `
        <div class="profile-modal">
            <button class="modal-close" onclick="closeProfileModal()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="profile-modal-header" style="background: ${backgroundImg.startsWith('#') ? backgroundImg : `url('${backgroundImg}')`}; background-size: cover; background-position: center;">
                <div class="profile-overlay-blur"></div>
                <button class="edit-background-btn" onclick="showBackgroundEditor()">
                    <i class="fas fa-image"></i> Editar Fundo
                </button>
            </div>
            
            <div class="profile-modal-body">
                <div class="profile-avatar-large">
                    <div class="avatar-initials">${initials}</div>
                </div>
                
                <h2 class="profile-name">${sanitizeHtml(user.name)}</h2>
                <p class="profile-email">${sanitizeHtml(user.email)}</p>
                
                <div class="profile-stats">
                    <div class="stat-item">
                        <div class="stat-number">1</div>
                        <div class="stat-label">Conta</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${user.projects || 0}</div>
                        <div class="stat-label">Projetos</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${user.followers || 0}</div>
                        <div class="stat-label">Seguidores</div>
                    </div>
                </div>
                
                <div class="profile-info-grid">
                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${sanitizeHtml(user.email)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Criado em:</span>
                        <span class="info-value">${new Date(user.created_at).toLocaleDateString('pt-PT')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Tipo:</span>
                        <span class="info-value">${user.provider === 'google' ? '🔗 Google' : '👤 Local'}</span>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button class="action-btn primary" onclick="showEditNameModal()">
                        <i class="fas fa-edit"></i> Alterar Nome
                    </button>
                    <button class="action-btn secondary" onclick="shareProfile()">
                        <i class="fas fa-share-alt"></i> Compartilhar Perfil
                    </button>
                    <button class="action-btn settings" onclick="showSettingsModal(getCurrentUser())">
                        <i class="fas fa-cog"></i> Configurações
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Fechar ao clicar fora
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeProfileModal();
        }
    });
}

function closeProfileModal() {
    const modal = document.getElementById('profile-modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => modal.remove(), 300);
    }
}

function showEditNameModal() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Verificar limite de 15 dias
    const lastNameChange = user.lastNameChange ? new Date(user.lastNameChange) : null;
    const now = new Date();
    const daysSinceChange = lastNameChange ? Math.floor((now - lastNameChange) / (1000 * 60 * 60 * 24)) : 15;
    
    if (daysSinceChange < 15) {
        const daysRemaining = 15 - daysSinceChange;
        alert(`Você pode alterar seu nome novamente em ${daysRemaining} dias.`);
        return;
    }
    
    const existingModal = document.getElementById('name-edit-modal-overlay');
    if (existingModal) existingModal.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'name-edit-modal-overlay';
    overlay.className = 'profile-modal-overlay';
    
    overlay.innerHTML = `
        <div class="profile-modal small">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="profile-modal-body">
                <h2>Alterar Nome</h2>
                <p class="modal-subtitle">Você pode alterar seu nome uma vez a cada 15 dias</p>
                
                <div class="form-group">
                    <label for="new-name">Novo Nome:</label>
                    <input type="text" id="new-name" value="${sanitizeHtml(user.name)}" placeholder="Digite seu novo nome" />
                </div>
                
                <div class="modal-actions">
                    <button class="btn-modal cancel" onclick="this.closest('.profile-modal-overlay').remove()">Cancelar</button>
                    <button class="btn-modal primary" onclick="saveName()">Salvar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

function saveName() {
    const newName = document.getElementById('new-name').value.trim();
    if (!newName) {
        alert('Nome não pode estar vazio');
        return;
    }
    
    const user = getCurrentUser();
    user.name = sanitizeInput(newName);
    user.lastNameChange = new Date().toISOString();
    
    localStorage.setItem('airnetUser', JSON.stringify(user));
    
    // Fechar modais
    document.getElementById('name-edit-modal-overlay').remove();
    closeProfileModal();
    
    // Reabrir perfil
    showProfileModal(user);
    
    alert('Nome alterado com sucesso!');
}

function showBackgroundEditor() {
    const user = getCurrentUser();
    if (!user) return;
    
    const existingModal = document.getElementById('bg-edit-modal-overlay');
    if (existingModal) existingModal.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'bg-edit-modal-overlay';
    overlay.className = 'profile-modal-overlay';
    
    const presetColors = [
        '#127afd', '#2899b3', '#5dd0da',
        '#ff6b6b', '#4ecdc4', '#45b7d1',
        '#FFA07A', '#98D8C8', '#6c5ce7'
    ];
    
    let colorButtons = presetColors.map(color => `
        <button class="color-preset" style="background-color: ${color}; border: 3px solid ${color === (user.backgroundImage || '#127afd') ? '#fff' : 'transparent'};" 
                onclick="setBackgroundColor('${color}')"></button>
    `).join('');
    
    overlay.innerHTML = `
        <div class="profile-modal small">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="profile-modal-body">
                <h2>Editar Fundo do Perfil</h2>
                <p class="modal-subtitle">Escolha uma cor ou faça upload de imagem</p>
                
                <div class="color-presets">
                    ${colorButtons}
                </div>
                
                <div class="form-group">
                    <label for="bg-upload">Ou faça upload de uma imagem:</label>
                    <input type="file" id="bg-upload" accept="image/*" onchange="handleBackgroundUpload(event)" />
                </div>
                
                <div class="modal-actions">
                    <button class="btn-modal cancel" onclick="this.closest('.profile-modal-overlay').remove()">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

function setBackgroundColor(color) {
    const user = getCurrentUser();
    user.backgroundImage = color;
    localStorage.setItem('airnetUser', JSON.stringify(user));
    
    document.getElementById('bg-edit-modal-overlay').remove();
    closeProfileModal();
    showProfileModal(user);
}

function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const user = getCurrentUser();
        user.backgroundImage = e.target.result;
        localStorage.setItem('airnetUser', JSON.stringify(user));
        
        document.getElementById('bg-edit-modal-overlay').remove();
        closeProfileModal();
        showProfileModal(user);
    };
    reader.readAsDataURL(file);
}

function shareProfile() {
    const user = getCurrentUser();
    const profileLink = window.location.origin + '/Index.html?profile=' + encodeURIComponent(user.email);
    
    const shareText = `Veja meu perfil na AirNet: ${user.name}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Perfil AirNet',
            text: shareText,
            url: profileLink
        });
    } else {
        // Fallback: Copiar para clipboard
        navigator.clipboard.writeText(profileLink).then(() => {
            alert('Link do perfil copiado para a área de transferência!');
        });
    }
}

function showSettingsModal(user) {
    const existingModal = document.getElementById('settings-modal-overlay');
    if (existingModal) existingModal.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'settings-modal-overlay';
    overlay.className = 'profile-modal-overlay';
    
    overlay.innerHTML = `
        <div class="profile-modal medium">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="profile-modal-body">
                <h2><i class="fas fa-cog"></i> Configurações</h2>
                
                <div class="settings-section">
                    <h3>Privacidade</h3>
                    <div class="setting-item">
                        <span>Perfil Público</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="public-profile" ${user.isPublic ? 'checked' : ''} onchange="togglePublicProfile()">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>Notificações</h3>
                    <div class="setting-item">
                        <span>Email de Atualizações</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="email-updates" ${user.emailUpdates !== false ? 'checked' : ''} onchange="toggleEmailUpdates()">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                
                <div class="settings-section danger">
                    <h3>Zona de Perigo</h3>
                    <button class="btn-modal danger" onclick="deleteAccount()">
                        <i class="fas fa-trash"></i> Eliminar Conta
                    </button>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-modal cancel" onclick="this.closest('.profile-modal-overlay').remove()">Fechar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

function togglePublicProfile() {
    const user = getCurrentUser();
    user.isPublic = document.getElementById('public-profile').checked;
    localStorage.setItem('airnetUser', JSON.stringify(user));
}

function toggleEmailUpdates() {
    const user = getCurrentUser();
    user.emailUpdates = document.getElementById('email-updates').checked;
    localStorage.setItem('airnetUser', JSON.stringify(user));
}

function deleteAccount() {
    if (confirm('Tem certeza? Esta ação não pode ser desfeita.')) {
        if (confirm('Digite "eliminar" para confirmar permanentemente:')) {
            localStorage.removeItem('airnetUser');
            window.location.href = 'Index.html';
        }
    }
}

// Inicializar autenticação quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    initAuthUI();
});

function showMessage(text, isError = false) {
    const message = document.getElementById('message') || document.getElementById('form-message') || document.getElementById('contact-message');
    if (!message) {
        alert(text);
        return;
    }
    message.textContent = text;
    message.className = 'form-message ' + (isError ? 'error' : 'success');
    message.style.display = 'block';
}

function clearMessage() {
    const message = document.getElementById('message') || document.getElementById('form-message') || document.getElementById('contact-message') || document.getElementById('contact-message');
    if (message) {
        message.className = 'form-message';
        message.style.display = 'none';
    }
}

function getUserTranslateLanguage() {
    const lang = navigator.language || navigator.userLanguage || 'en';
    return lang.split(/[-_]/)[0] || 'en';
}

function translateCurrentPage() {
    const userLang = getUserTranslateLanguage();
    const currentUrl = encodeURIComponent(window.location.href);
    const translateUrl = `https://translate.google.com/translate?sl=pt&tl=${encodeURIComponent(userLang)}&u=${currentUrl}`;
    alert(`A página será traduzida para ${userLang.toUpperCase()}.`);
    window.location.href = translateUrl;
}

async function sendRegister() {
    clearMessage();
    
    // Obter dados do formulário
    const form = document.getElementById('register-form');
    if (!form) {
        showMessage('Formulário não encontrado', true);
        return;
    }

    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const password = (document.getElementById('password')?.value || '').trim();
    const confirmPassword = (document.getElementById('password-confirm')?.value || '').trim();

    // Validações básicas
    if (!name) {
        showMessage('Nome é obrigatório', true);
        return;
    }

    if (!email || !email.includes('@')) {
        showMessage('Email válido é obrigatório', true);
        return;
    }

    if (!password || password.length < 6) {
        showMessage('Palavra-passe deve ter mínimo 6 caracteres', true);
        return;
    }

    if (password !== confirmPassword) {
        showMessage('As palavras-passe não coincidem', true);
        return;
    }

    try {
        showMessage('Processando inscrição...');
        
        const jsonData = {
            action: 'register',
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            password: password,
            provider: 'local'
        };
        
        console.log('Dados enviados:', jsonData);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        // Verificar se a resposta é válida
        if (!response.ok) {
            console.error('Resposta do servidor:', response.status, response.statusText);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            console.error('Erro ao parsear JSON:', jsonError);
            throw new Error('Resposta do servidor inválida (JSON)');
        }

        console.log('Resposta do servidor:', result);
        
        // Verificar estrutura da resposta
        if (typeof result !== 'object' || result === null) {
            throw new Error('Resposta inválida do servidor');
        }

        if (!result.success) {
            showMessage(result.message || 'Erro ao criar conta', true);
            return;
        }

        showMessage(result.message || 'Conta criada com sucesso!');
        
        if (result.user) {
            localStorage.setItem('airnetUser', JSON.stringify(result.user));
        }

        // Limpar formulário
        form.reset();

        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = 'Index.html';
        }, 2000);

    } catch (error) {
        console.error('Erro ao processar inscrição:', error);
        
        // Fallback: Criar conta localmente se houver erro de rede
        const localUser = {
            id: Date.now(),
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            provider: 'local',
            created_at: new Date().toISOString(),
            local: true,
            error: error.message
        };
        
        try {
            localStorage.setItem('airnetUser', JSON.stringify(localUser));
            showMessage('Conta criada no modo local. Sincronia quando online.');
            form.reset();
            
            setTimeout(() => {
                window.location.href = 'Index.html';
            }, 1500);
        } catch (storageError) {
            showMessage('Erro ao salvar conta: ' + storageError.message, true);
        }
    }
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>"']/g, (char) => {
        const escapeMap = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeMap[char] || char;
    });
}

async function googleSignup() {
    clearMessage();
    const googleEmail = prompt('Digite seu email Google para cadastro:');
    
    if (!googleEmail || !googleEmail.includes('@')) {
        if (googleEmail) showMessage('Email inválido', true);
        return;
    }

    try {
        showMessage('Registando com Google...');
        
        const jsonData = {
            action: 'register',
            name: 'Utilizador Google',
            email: sanitizeInput(googleEmail.trim()),
            password: '',
            provider: 'google'
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            throw new Error('Resposta inválida do servidor');
        }
        
        if (!result.success) {
            showMessage(result.message || 'Erro ao registar', true);
            return;
        }

        showMessage(result.message || 'Conta criada com sucesso!');
        
        if (result.user) {
            localStorage.setItem('airnetUser', JSON.stringify(result.user));
        }

        setTimeout(() => {
            window.location.href = 'Index.html';
        }, 2000);

    } catch (error) {
        console.error('Erro:', error);
        showMessage('Falha ao conectar: ' + error.message, true);
    }
}

// ===== FUNÇÕES DE BUSCA =====

async function performGeneralSearch() {
    const query = document.getElementById('general-search').value.trim();
    if (!query) {
        showSearchMessage('general-results', 'Digite um termo de busca', true);
        return;
    }

    try {
        showSearchMessage('general-results', 'Buscando...');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'search',
                type: 'general',
                query: query
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            throw new Error('Resposta inválida do servidor');
        }
        
        if (!result.success) {
            showSearchMessage('general-results', result.message || 'Erro na busca', true);
            return;
        }

        const results = result.user && result.user.results ? result.user.results : [];
        displaySearchResults('general-results', results);
        
    } catch (error) {
        console.error('Erro:', error);
        showSearchMessage('general-results', 'Falha ao conectar: ' + error.message, true);
    }
}

async function performServiceSearch() {
    const query = document.getElementById('service-search').value.trim();
    if (!query) {
        showSearchMessage('service-results', 'Digite um termo de busca', true);
        return;
    }

    try {
        showSearchMessage('service-results', 'Buscando serviços...');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'search',
                type: 'service',
                query: query
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            throw new Error('Resposta inválida');
        }
        
        if (!result.success) {
            showSearchMessage('service-results', result.message || 'Erro na busca', true);
            return;
        }

        const results = result.user && result.user.results ? result.user.results : [];
        displaySearchResults('service-results', results);
        
    } catch (error) {
        console.error('Erro:', error);
        showSearchMessage('service-results', 'Falha ao conectar: ' + error.message, true);
    }
}

async function performProjectSearch() {
    const query = document.getElementById('project-search').value.trim();
    if (!query) {
        showSearchMessage('project-results', 'Digite um termo de busca', true);
        return;
    }

    try {
        showSearchMessage('project-results', 'Buscando projetos...');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'search',
                type: 'project',
                query: query
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            throw new Error('Resposta inválida');
        }
        
        if (!result.success) {
            showSearchMessage('project-results', result.message || 'Erro na busca', true);
            return;
        }

        const results = result.user && result.user.results ? result.user.results : [];
        displaySearchResults('project-results', results);
        
    } catch (error) {
        console.error('Erro:', error);
        showSearchMessage('project-results', 'Falha ao conectar: ' + error.message, true);
    }
}

async function performContactSearch() {
    const query = document.getElementById('contact-search').value.trim();
    if (!query) {
        showSearchMessage('contact-results', 'Digite um termo de busca', true);
        return;
    }

    try {
        showSearchMessage('contact-results', 'Buscando contatos...');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'search',
                type: 'contact',
                query: query
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            throw new Error('Resposta inválida');
        }
        
        if (!result.success) {
            showSearchMessage('contact-results', result.message || 'Erro na busca', true);
            return;
        }

        const results = result.user && result.user.results ? result.user.results : [];
        displaySearchResults('contact-results', results);
        
    } catch (error) {
        console.error('Erro:', error);
        showSearchMessage('contact-results', 'Falha ao conectar: ' + error.message, true);
    }
}

function showSearchMessage(containerId, message, isError = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `<div class="search-message ${isError ? 'error' : 'loading'}">${message}</div>`;
}

function displaySearchResults(containerId, results) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!results || !Array.isArray(results) || results.length === 0) {
        container.innerHTML = '<div class="search-message">Nenhum resultado encontrado</div>';
        return;
    }
    
    let html = '<div class="search-results-list">';
    results.forEach(result => {
        const title = sanitizeHtml(result.title || 'Sem título');
        const description = sanitizeHtml(result.description || 'Sem descrição');
        const link = String(result.link || '#').startsWith('http') ? result.link : '#';
        
        html += `
            <div class="search-result-item">
                <h4>${title}</h4>
                <p>${description}</p>
                <a href="${link}" target="_blank" class="result-link">Ver mais →</a>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLista = document.querySelector('.nav-lista');
    const navLinks = document.querySelectorAll('.nav-lista .nav-item a');

    if (navToggle && navLista) {
        navToggle.addEventListener('click', () => {
            navLista.classList.toggle('open');
            const expanded = navLista.classList.contains('open');
            navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLista.classList.contains('open')) {
                navLista.classList.remove('open');
            }
        });
    });
});

// ===== AIRIA CHATBOT =====
document.addEventListener('DOMContentLoaded', () => {
    const airiaToggle = document.getElementById('airia-toggle');
    const airiaChat = document.getElementById('airia-chat');
    const airiaClose = document.getElementById('airia-close');
    const airiaInput = document.getElementById('airia-input');
    const airiaSend = document.getElementById('airia-send');
    const airiaMessages = document.getElementById('airia-messages');

    // Toggle chat window
    if (airiaToggle) {
        airiaToggle.addEventListener('click', () => {
            airiaChat.style.display = airiaChat.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Close chat
    if (airiaClose) {
        airiaClose.addEventListener('click', () => {
            airiaChat.style.display = 'none';
        });
    }

    // Send message
    function sendMessage() {
        const message = airiaInput.value.trim();
        if (!message) return;

        // Add user message with timestamp and check
        addMessage(message, 'user');
        airiaInput.value = '';

        // Show processing status
        const statusBubble = addStatusMessage('AirNet-IA Processing');

        setTimeout(() => {
            if (statusBubble && statusBubble.parentNode) {
                statusBubble.parentNode.removeChild(statusBubble);
            }
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 1200);
    }

    if (airiaSend) {
        airiaSend.addEventListener('click', sendMessage);
    }

    if (airiaInput) {
        airiaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `airia-message airia-${sender}`;
        
        const avatar = document.createElement('span');
        avatar.className = 'airia-avatar';
        avatar.textContent = sender === 'bot' ? '🤖' : '👤';
        
        const bubble = document.createElement('div');
        bubble.className = 'airia-bubble';
        bubble.textContent = text;

        const meta = document.createElement('div');
        meta.className = 'airia-meta';
        meta.textContent = `${sender === 'user' ? '✓ ' : ''}${formatTimestamp(new Date())}`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        messageDiv.appendChild(meta);
        airiaMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        airiaMessages.scrollTop = airiaMessages.scrollHeight;
    }

    function addStatusMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'airia-message airia-status';

        const bubble = document.createElement('div');
        bubble.className = 'airia-bubble';
        bubble.textContent = text;

        messageDiv.appendChild(bubble);
        airiaMessages.appendChild(messageDiv);
        airiaMessages.scrollTop = airiaMessages.scrollHeight;

        return messageDiv;
    }

    function formatTimestamp(date) {
        const formatter = new Intl.DateTimeFormat(undefined, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
        return formatter.format(date);
    }

    function getLearned() {
        try {
            const learned = localStorage.getItem('airiaLearned');
            return learned ? JSON.parse(learned) : [];
        } catch (e) {
            console.error('Erro ao carregar aprendizados:', e);
            return [];
        }
    }
    
    function saveLearned(keyword, response) {
        try {
            const learned = getLearned();
            learned.push({ keyword: keyword.toLowerCase(), response });
            localStorage.setItem('airiaLearned', JSON.stringify(learned));
            return true;
        } catch (e) {
            console.error('Erro ao salvar aprendizado:', e);
            return false;
        }
    }
    
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Sistema de aprendizado: processar comando "aprenda"
        if (lowerMessage.includes('aprenda:') && lowerMessage.includes('=')) {
            const parts = message.split('=');
            if (parts.length === 2) {
                const keyword = parts[0].replace(/aprenda:/i, '').trim();
                const response = parts[1].trim();
                
                if (keyword && response && keyword.length > 2 && response.length > 5) {
                    if (saveLearned(keyword, response)) {
                        return `✅ Aprendido! Agora respondo "${keyword}" com "${response}"`;
                    } else {
                        return '❌ Erro ao salvar o aprendizado. Tente novamente.';
                    }
                } else {
                    return '⚠️ Formato inválido. Use: "aprenda: [pergunta] = [resposta]"';
                }
            }
        }
        
        // Saudações
        if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
            return 'Olá! Sou a AirIA, sua assistente virtual da AirNet. Como posso ajudar você hoje?';
        }
        
        // Saudações
        if (lowerMessage.includes('tás bom') || lowerMessage.includes('como estás') || lowerMessage.includes('como estas') || lowerMessage.includes('tas bem') || lowerMessage.includes('how are you')) {
            return 'Olá! estou otimo😊. Como posso ajudar você hoje?';
        }
    
        // Serviços
        if (lowerMessage.includes('serviços') || lowerMessage.includes('serviço') || lowerMessage.includes('desenvolvimento') || lowerMessage.includes('web')) {
            return 'Oferecemos desenvolvimento web completo, incluindo sites responsivos, e-commerce, aplicações móveis e consultoria em TI. Visite nossa página de Serviços para mais detalhes ou entre em contato!';
        }
        //Quantos são
        if (lowerMessage.includes('quantos são') || lowerMessage.includes('elementos') || lowerMessage.includes('numero de integrantes') || lowerMessage.includes('pessoal')) {
            return 'Somos um Grupo de nove integrantes. E aínda temos os nossos Parceiros estrategicos e terceiros incluidos.';
        }
        
        //Quais são os serviços oferecidos
        if (lowerMessage.includes('quais') && lowerMessage.includes('serviços')) {
            return 'Nossos serviços incluem: Desenvolvimento de Sites, E-commerce, Aplicações Móveis, criação de Portais, Consultoria em TI, e muito mais! Para detalhes específicos, visite nossa página de Serviços ou entre em contato conosco.';
        }

        // Contato
        if (lowerMessage.includes('contato') || lowerMessage.includes('falar') || lowerMessage.includes('email') || lowerMessage.includes('whatsapp') || lowerMessage.includes('contactos') || lowerMessage.includes('quero numeros') || lowerMessage.includes('quero number') || lowerMessage.includes('number') || lowerMessage.includes('insta') || lowerMessage.includes('instagram') || lowerMessage.includes('instagrom') || lowerMessage.includes('twitter') || lowerMessage.includes('fb') || lowerMessage.includes('facebook') || lowerMessage.includes('tik') || lowerMessage.includes('tok') || lowerMessage.includes('Social')) {
            return 'Você pode nos contatar através da página de Contactos, WhatsApp: +244 956 239 945, email: airnet220@gmail.com ou visite nosso site oficial: airnet220-ui.github.io/AIRNET.COM/';
        }

        // Pesquisa na web
        if (lowerMessage.includes('pesquise') || lowerMessage.includes('google') || lowerMessage.includes('web') || lowerMessage.includes('internet') || lowerMessage.includes('pesquisar')) {
            window.open('https://www.google.com/search?q=' + encodeURIComponent(message), '_blank');
            return 'Estou abrindo uma pesquisa na web para você. Veja a nova aba do navegador para os resultados.';
        }
        
        // Busca
        if (lowerMessage.includes('busca') || lowerMessage.includes('procurar') || lowerMessage.includes('encontrar')) {
            return 'Use nossos motores de busca especializados na página Busca para encontrar informações sobre serviços, projetos e contatos. Temos buscas para geral, serviços, projetos e contatos!';
        }
        
        // Sobre a empresa
        if (lowerMessage.includes('airnet') || lowerMessage.includes('empresa') || lowerMessage.includes('sobre') || lowerMessage.includes('quem') || lowerMessage.includes('oq são')) {
            return 'AirNet é uma startup angolana especializada em desenvolvimento web e soluções digitais inovadoras. Oferecemos serviços de alta qualidade para transformar ideias em realidade digital.';
        }
        
        // Preços/Custos
        if (lowerMessage.includes('preço') || lowerMessage.includes('custo') || lowerMessage.includes('valor') || lowerMessage.includes('orçamento')) {
            return 'Nossos preços variam conforme o projeto. Entre em contato para um orçamento personalizado. Temos pacotes especiais para startups e pequenas empresas!';
        }
        
        // Suporte/Técnico
        if (lowerMessage.includes('suporte') || lowerMessage.includes('ajuda') || lowerMessage.includes('problema') || lowerMessage.includes('erro')) {
            return 'Para suporte técnico, visite nossa página de Contactos ou envie um email para airnet220@gmail.com. Estamos aqui para ajudar!';
        }
        
        // Projetos/Portfólio
        if (lowerMessage.includes('projeto') || lowerMessage.includes('portfólio') || lowerMessage.includes('trabalho') || lowerMessage.includes('feito')) {
            return 'Confira nossos projetos na página de Divulgações. Temos cases de sucesso em diversos setores, desde e-commerce até portais corporativos.';
        }
        
        // Parcerias
        if (lowerMessage.includes('parceria') || lowerMessage.includes('parceiro') || lowerMessage.includes('colaboração')) {
            return 'Estamos sempre abertos a parcerias estratégicas. Visite nossa página de Parceiros para saber mais sobre nosso programa de parceria.';
        }
        
        // Inscrição/Registro
        if (lowerMessage.includes('inscrever') || lowerMessage.includes('registrar') || lowerMessage.includes('conta') || lowerMessage.includes('cadastro')) {
            return 'Para se inscrever em nossa newsletter ou criar uma conta, visite a página Increve-se. Fique por dentro das novidades!';
        }
        
        // Apoiar/Doação
        if (lowerMessage.includes('apoiar') || lowerMessage.includes('doar') || lowerMessage.includes('ajudar') || lowerMessage.includes('contribuir')) {
            return 'Apoie nossa missão visitando a página Apoiar. Sua contribuição ajuda a manter e expandir nossos serviços de qualidade.';
        }
        
        // Localização/Endereço
        if (lowerMessage.includes('local') || lowerMessage.includes('endereço') || lowerMessage.includes('onde') || lowerMessage.includes('angola')) {
            return 'Somos uma empresa angolana, atuando digitalmente em todo o território nacional. Para projetos locais, podemos discutir presencialmente.';
        }
        
        // Tecnologias
        if (lowerMessage.includes('tecnologia') || lowerMessage.includes('ferramenta') || lowerMessage.includes('linguagem') || lowerMessage.includes('framework')) {
            return 'Trabalhamos com as melhores tecnologias: HTML5, CSS3, JavaScript, PHP, Node.js, React, WordPress, bancos de dados MySQL/PostgreSQL e muito mais!';
        }
        
        // Tempo/Prazos
        if (lowerMessage.includes('tempo') || lowerMessage.includes('prazo') || lowerMessage.includes('quanto') || lowerMessage.includes('demora')) {
            return 'Os prazos variam conforme a complexidade do projeto. Sites simples levam 1-2 semanas, projetos complexos podem levar 1-3 meses. Entre em contato para detalhes!';
        }
        
        // Perguntas gerais
        if (lowerMessage.includes('como') || lowerMessage.includes('o que') || lowerMessage.includes('por que') || lowerMessage.includes('quando')) {
            return 'Essa é uma ótima pergunta! Para respostas mais detalhadas, visite nossas páginas específicas ou entre em contato conosco. Estou aqui para ajudar!';
        }
        
        // Agradecimentos
        if (lowerMessage.includes('obrigado') || lowerMessage.includes('valeu') || lowerMessage.includes('thanks')) {
            return 'De nada! Fico feliz em ajudar. Se precisar de mais alguma coisa, é só chamar.';
        }
        
        // Despedidas
        if (lowerMessage.includes('tchau') || lowerMessage.includes('até logo') || lowerMessage.includes('bye')) {
            return 'Até logo! Não hesite em voltar se precisar de ajuda. A AirNet agradece sua visita!';
        }
        
        // Perguntas sobre criadores/team
        if (lowerMessage.includes('criador') || lowerMessage.includes('criadores') || lowerMessage.includes('team') || lowerMessage.includes('equipa') || lowerMessage.includes('quem criou') || lowerMessage.includes('desenvolvedor') || lowerMessage.includes('dev') || lowerMessage.includes('founders')) {
            return 'A AirNet foi criada por uma equipa talentosa: Patrice de Oliveira (Líder dos Desenvolvedores), Epifanio da Costa (CEO), Luane Papagaio (Marketing), Manuel de Carvalho (Desenvolvedor), e Eugênia, Feliciano Bismarck (Desenvolvedor), Renzo (Desiner UI, UX). Somos apaixonados por tecnologia e inovação!';
        }
        // Quem é o CEO        
        if (lowerMessage.includes('ceo') || lowerMessage.includes('epifanio da costa') || lowerMessage.includes('pifanêqo da costa')) {
            return 'O CEO da AirNet é Epifanio da Costa. Ele é responsável por liderar a visão e estratégia da empresa para o futuro.';
        }
        // Quem é o líder dos desenvolvedores
        if (lowerMessage.includes('patrice') || lowerMessage.includes('oliveira') || lowerMessage.includes('quem é patrice') || lowerMessage.includes('lider dos desenvolvidores')) {
            return 'Patrice de Oliveira é o Líder dos Desenvolvedores da AirNet. Ele lidera toda a equipa técnica e garante a qualidade e inovação nos nossos projetos.';
        }

        if (lowerMessage.includes('epifanio') || lowerMessage.includes('costa') || lowerMessage.includes('ceo')) {
            return 'Epifanio da Costa é o CEO da AirNet. Ele direciona a visão e estratégia da empresa para o futuro.';
        }
         // Quem é responsável pelo marketing
        if (lowerMessage.includes('luane') || lowerMessage.includes('papagaio') || lowerMessage.includes('marketing')) {
            return 'Luane Papagaio é responsável pelo Marketing da AirNet. Ela cuida de toda a comunicação e presença da marca no mercado.';
        }
        //dev
        if (lowerMessage.includes('manuel') || lowerMessage.includes('carvalho')) {
            return 'Manuel de Carvalho é um dos Desenvolvedores da AirNet. Ele trabalha na criação e manutenção dos nossos projetos de software.';
        }
        
        if (lowerMessage.includes('Eugênia') || lowerMessage.includes('secretária') || lowerMessage.includes('heogenea') || lowerMessage.includes('Escritas')) {
            return 'Eugênia é membro da equipa AirNet, contribuindo para o sucesso dos nossos projetos e inovações.';
        }
        
        // Design e UI/UX
        if (lowerMessage.includes('design') || lowerMessage.includes('ui') || lowerMessage.includes('ux') || lowerMessage.includes('renzo') || lowerMessage.includes('interface')) {
            return 'Renzo é nosso Designer UI/UX. Cria interfaces modernas e intuitivas que oferecem excelente experiência aos usuários. Temos expertise em design responsivo e user-centered design.';
        }
        
        // E-commerce
        if (lowerMessage.includes('ecommerce') || lowerMessage.includes('e-commerce') || lowerMessage.includes('loja online') || lowerMessage.includes('shopping') || lowerMessage.includes('compra online')) {
            return 'Desenvolvemos plataformas de e-commerce completas com carrinho de compras, gateway de pagamento integrado, gestão de estoque e relatórios de vendas. Temos experiência com WooCommerce, Magento e soluções customizadas!';
        }
        
        // Hospedagem
        if (lowerMessage.includes('hospedagem') || lowerMessage.includes('servidor') || lowerMessage.includes('hosting') || lowerMessage.includes('domínio')) {
            return 'Podemos auxiliar na escolha de hospedagem e registrar domínios para seu projeto. Recomendamos servidores confiáveis com suporte 24/7 e backups automáticos.';
        }
        
        // Segurança
        if (lowerMessage.includes('segurança') || lowerMessage.includes('ssl') || lowerMessage.includes('https') || lowerMessage.includes('proteção') || lowerMessage.includes('criptografia')) {
            return 'A segurança é prioridade! Implementamos certificados SSL/TLS, autenticação forte, proteção contra SQL injection, CSRF, XSS e outras vulnerabilidades. Seus dados estão seguros conosco!';
        }
        
        // SEO
        if (lowerMessage.includes('seo') || lowerMessage.includes('otimização') || lowerMessage.includes('google') || lowerMessage.includes('ranking') || lowerMessage.includes('busca')) {
            return 'Oferecemos otimização SEO completa: palavras-chave estratégicas, meta tags, sitemap, breadcrumbs, velocidade de carregamento e estratégia de conteúdo para melhorar seu ranking no Google!';
        }
        
        // Performance
        if (lowerMessage.includes('performance') || lowerMessage.includes('velocidade') || lowerMessage.includes('carregamento') || lowerMessage.includes('otimização') || lowerMessage.includes('rápido')) {
            return 'Otimizamos seus sites para máxima performance: compressão de imagens, cache, minificação, lazy loading e código limpo. Um site rápido melhora SEO e experiência do usuário!';
        }
        
        // Suporte e manutenção
        if (lowerMessage.includes('manutenção') || lowerMessage.includes('manter') || lowerMessage.includes('atualizar') || lowerMessage.includes('updates') || lowerMessage.includes('backup')) {
            return 'Oferecemos pacotes de manutenção que incluem atualizações regulares, backups diários, monitoramento 24/7 e suporte técnico. Seu site fica sempre seguro e atualizado!';
        }
        
        // Integração de API
        if (lowerMessage.includes('api') || lowerMessage.includes('integração') || lowerMessage.includes('conectar') || lowerMessage.includes('terceiros') || lowerMessage.includes('webhook')) {
            return 'Integramos qualquer API: pagamentos (Stripe, PayPal), redes sociais, CRM, email marketing e muito mais. Nossa equipa domina as principais integrações do mercado.';
        }
        
        // Treinamento
        if (lowerMessage.includes('treinamento') || lowerMessage.includes('ensinar') || lowerMessage.includes('curso') || lowerMessage.includes('documentação')) {
            return 'Oferecemos treinamento completo da sua equipa e documentação detalhada para que você saiba gerenciar o projeto. Você nunca fica preso a nós!';
        }
        
        // Mobile
        if (lowerMessage.includes('mobile') || lowerMessage.includes('celular') || lowerMessage.includes('aplicativo') || lowerMessage.includes('app') || lowerMessage.includes('ios') || lowerMessage.includes('android')) {
            return 'Desenvolvemos aplicações móveis nativas e cross-platform para iOS e Android. Temos experiência com React Native, Flutter e desenvolvimento nativo. Sua ideia fica acessível em qualquer smartphone!';
        }
        
        // WordPress
        if (lowerMessage.includes('wordpress') || lowerMessage.includes('blog') || lowerMessage.includes('cms')) {
            return 'Desenvolvemos sites e blogs em WordPress com temas customizados, plugins específicos e otimização completa. Perfeito para conteúdo dinâmico e fácil gerenciamento!';
        }
        
        // Consultoria
        if (lowerMessage.includes('consultoria') || lowerMessage.includes('estratégia') || lowerMessage.includes('plano') || lowerMessage.includes('roadmap')) {
            return 'Oferecemos consultoria em transformação digital, ajudando a planejar sua estratégia de TI. Analisamos suas necessidades e recomendamos soluções personalizadas.';
        }
        
        // Responsivo
        if (lowerMessage.includes('responsivo') || lowerMessage.includes('mobile first') || lowerMessage.includes('tela') || lowerMessage.includes('dispositivo')) {
            return 'Todos os nossos projetos são totalmente responsivos! Funcionam perfeitamente em smartphones, tablets e desktops. User experience é nossa prioridade em qualquer dispositivo.';
        }
        
        // Banco de dados
        if (lowerMessage.includes('banco de dados') || lowerMessage.includes('database') || lowerMessage.includes('sql') || lowerMessage.includes('mongodb')) {
            return 'Trabalhamos com MySQL, PostgreSQL, MongoDB e outros bancos de dados. Criamos estruturas otimizadas para performance e escalabilidade da sua aplicação.';
        }
        
        // Portais
        if (lowerMessage.includes('portal') || lowerMessage.includes('intranet') || lowerMessage.includes('plataforma')) {
            return 'Desenvolvemos portais corporativos completos com áreas restritas, gerenciamento de usuários, workflows e painéis administrativos poderosos.';
        }
        
        // Pagamentos
        if (lowerMessage.includes('pagamento') || lowerMessage.includes('gateway') || lowerMessage.includes('transação') || lowerMessage.includes('checkout')) {
            return 'Integramos múltiplos gateways de pagamento: cartão de crédito, Mbway, Paypal, Stripe e transferências bancárias. Transações seguras e sem complicações!';
        }
        
        // Gestão de conteúdo
        if (lowerMessage.includes('conteúdo') || lowerMessage.includes('editar') || lowerMessage.includes('admin') || lowerMessage.includes('painel')) {
            return 'Criar painel administrativo completo e intuitivo para você gerenciar todo o conteúdo sem conhecimentos técnicos. Simples e poderoso!';
        }
        
        // Landing page
        if (lowerMessage.includes('landing') || lowerMessage.includes('página de destino') || lowerMessage.includes('campanha')) {
            return 'Desenvolvemos landing pages high-converting otimizadas para conversão. Com design atrativo, call-to-action claro e formulários inteligentes para suas campanhas!';
        }
        
        // Redes sociais
        if (lowerMessage.includes('rede social') || lowerMessage.includes('facebook') || lowerMessage.includes('instagram') || lowerMessage.includes('twitter') || lowerMessage.includes('tiktok') || lowerMessage.includes('linkedin')) {
            return 'Integração completa com suas redes sociais: compartilhamento automático, feed social no site e links para suas páginas. Amplificamos seu alcance digital!';
        }
        
        // Email marketing
        if (lowerMessage.includes('email') || lowerMessage.includes('newsletter') || lowerMessage.includes('marketing')) {
            return 'Configuramos email marketing profissional com templates customizados, automação e análise de campanhas. Mantenha contato com seus clientes!';
        }
        
        // Analytics
        if (lowerMessage.includes('analytics') || lowerMessage.includes('estatísticas') || lowerMessage.includes('dados') || lowerMessage.includes('métricas') || lowerMessage.includes('relatório')) {
            return 'Configuramos Google Analytics, relatórios personalizados e dashboards de dados. Saiba exatamente como seus visitantes interagem com seu site!';
        }
        
        // Chat
        if (lowerMessage.includes('chat') || lowerMessage.includes('conversação') || lowerMessage.includes('atendimento')) {
            return 'Implementamos sistemas de chat ao vivo, chatbots inteligentes e suporte em tempo real para melhorar atendimento ao cliente.';
        }
        
        // Galeria
        if (lowerMessage.includes('galeria') || lowerMessage.includes('portfólio') || lowerMessage.includes('imagens')) {
            return 'Desenvolvemos galerias dinâmicas e portfólios interativos que destacam seus trabalhos com estilo e performance.';
        }
        
        // Formulários
        if (lowerMessage.includes('formulário') || lowerMessage.includes('form') || lowerMessage.includes('contato')) {
            return 'Criamos formulários customizados com validação, captcha, notificações por email e integração com CRM. Nunca mais perca um lead!';
        }
        
        // Escalabilidade
        if (lowerMessage.includes('escala') || lowerMessage.includes('crescer') || lowerMessage.includes('crescimento') || lowerMessage.includes('tráfego')) {
            return 'Desenvolvemos soluções escaláveis que crescem com seu negócio. Arquitetura preparada para suportar milhões de usuários sem problemas!';
        }
        
        // Prototipagem
        if (lowerMessage.includes('protótipo') || lowerMessage.includes('mockup') || lowerMessage.includes('wireframe')) {
            return 'Criamos protótipos e wireframes interativos para validar suas ideias antes do desenvolvimento completo. Economiza tempo e dinheiro!';
        }
        
        // Testes
        if (lowerMessage.includes('teste') || lowerMessage.includes('qualidade') || lowerMessage.includes('qa') || lowerMessage.includes('bug')) {
            return 'Fazemos testes completos: funcionais, de performance, segurança e compatibilidade. Seu projeto é lançado livre de bugs!';
        }
        
        // Documentação
        if (lowerMessage.includes('documentação') || lowerMessage.includes('manual')) {
            return 'Fornecemos documentação técnica completa, manuais de usuário e guias de administração para facilitar manutenção futura.';
        }
        
        // Suporte pós-projeto
        if (lowerMessage.includes('suporte pós') || lowerMessage.includes('pós-projeto') || lowerMessage.includes('após lançamento')) {
            return 'Oferecemos suporte contínuo após o lançamento: correções de bugs, melhorias, novas funcionalidades e assistência 24/7.';
        }
        
        // Metodologia
        if (lowerMessage.includes('metodologia') || lowerMessage.includes('agile') || lowerMessage.includes('scrum') || lowerMessage.includes('sprint')) {
            return 'Usamos metodologia Agile/Scrum para desenvolvimento ágil e iterativo. Você fica sempre informado com sprints regulares e entregas incrementais!';
        }
        
        // Começar projeto
        if (lowerMessage.includes('começar') || lowerMessage.includes('novo projeto') || lowerMessage.includes('proposta') || lowerMessage.includes('orçamento')) {
            return 'Ótimo! Entre em contato através da página de Contactos ou envie um email para airnet220@gmail.com. Faremos uma reunião para entender suas necessidades e criar uma proposta personalizada!';
        }
        
        // Portais/Intranet
        if (lowerMessage.includes('intranet') || lowerMessage.includes('extranet')) {
            return 'Desenvolvemos portais corporativos robustos com autenticação, áreas restritas, gestão de documentos e comunicação interna integrada.';
        }
        
        // Migrações
        if (lowerMessage.includes('migração') || lowerMessage.includes('migrar') || lowerMessage.includes('mudança')) {
            return 'Realizamos migrações completas: dados, domínio, email e arquivos. Sem downtime e com segurança de dados garantida!';
        }
        
        // CMS/Gerenciador
        if (lowerMessage.includes('gerenciador') || lowerMessage.includes('administrador')) {
            return 'Desenvolvemos gestores de conteúdo intuitivos onde você controla tudo sem precisar conhecer código. Liberdade total!';
        }
        
        // Customização
        if (lowerMessage.includes('customização') || lowerMessage.includes('personalização') || lowerMessage.includes('personalizar')) {
            return 'Cada projeto é 100% customizado para suas necessidades. Não usamos templates genéricos, criamos soluções únicas e alinhadas com sua marca!';
        }
        
        // DevOps/Infraestrutura
        if (lowerMessage.includes('devops') || lowerMessage.includes('infraestrutura') || lowerMessage.includes('deploy')) {
            return 'Configuramos infraestrutura robusta com CI/CD, Docker, Kubernetes e automação. Deploy confiável e sempre disponível!';
        }
        
        // Suporte multilíngue
        if (lowerMessage.includes('idioma') || lowerMessage.includes('multilíngue') || lowerMessage.includes('tradução') || lowerMessage.includes('português') || lowerMessage.includes('inglês')) {
            return 'Desenvolvemos sites multilíngues com suporte para português, inglês e outros idiomas. Alcance audiência global!';
        }
        
        // Certificações/Compliance
        if (lowerMessage.includes('certificação') || lowerMessage.includes('compliance') || lowerMessage.includes('rgpd') || lowerMessage.includes('normas')) {
            return 'Garantimos conformidade com RGPD, normas de acessibilidade (WCAG) e melhores práticas de segurança da indústria.';
        }
        
        // Sistema de aprendizado da IA
        if (lowerMessage.includes('aprenda') || lowerMessage.includes('aprender') || lowerMessage.includes('ensina') || lowerMessage.includes('ensine') || lowerMessage.includes('responda sobre')) {
            return 'Posso aprender coisas novas! Para me ensinar uma resposta, use o formato: "aprenda: [pergunta] = [resposta]". Por exemplo: "aprenda: qual seu nome = Sou AirIA da AirNet"';
        }
        
        // Verificar se há aprendizados salvos
        const learnedResponses = getLearned();
        for (const learned of learnedResponses) {
            if (lowerMessage.includes(learned.keyword)) {
                return learned.response;
            }
        }
        
        // Resposta padrão
        return 'Desculpe, não entendi completamente sua pergunta. Tente reformular ou visite nossas páginas: Serviços, Contactos, Busca ou Divulgações. Ou envie um email para airnet220@gmail.com para suporte personalizado.';
    }
});

// Efeito de scroll parallax na seção de boas-vindas
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    const welcomeSection = document.querySelector('.one-type');
    if (welcomeSection) {
        welcomeSection.style.transform = 'translateY(' + rate + 'px)';
    }
});








