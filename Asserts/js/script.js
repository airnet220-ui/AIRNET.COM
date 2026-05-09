const apiUrl = 'php/pagina.php';

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
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'register',
                name,
                email,
                password,
                provider: 'local'
            })
        });

        const result = await response.json();
        
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
        console.error('Erro:', error);
        showMessage('Falha ao conectar com o servidor: ' + error.message, true);
    }
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
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'register',
                name: 'Utilizador Google',
                email: googleEmail.trim(),
                password: '',
                provider: 'google'
            })
        });

        const result = await response.json();
        
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

        const result = await response.json();
        
        if (!result.success) {
            showSearchMessage('general-results', result.message || 'Erro na busca', true);
            return;
        }

        displaySearchResults('general-results', result.user.results);
        
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

        const result = await response.json();
        
        if (!result.success) {
            showSearchMessage('service-results', result.message || 'Erro na busca', true);
            return;
        }

        displaySearchResults('service-results', result.user.results);
        
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

        const result = await response.json();
        
        if (!result.success) {
            showSearchMessage('project-results', result.message || 'Erro na busca', true);
            return;
        }

        displaySearchResults('project-results', result.user.results);
        
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

        const result = await response.json();
        
        if (!result.success) {
            showSearchMessage('contact-results', result.message || 'Erro na busca', true);
            return;
        }

        displaySearchResults('contact-results', result.user.results);
        
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
    
    if (!results || results.length === 0) {
        container.innerHTML = '<div class="search-message">Nenhum resultado encontrado</div>';
        return;
    }
    
    let html = '<div class="search-results-list">';
    results.forEach(result => {
        html += `
            <div class="search-result-item">
                <h4>${result.title}</h4>
                <p>${result.description}</p>
                <a href="${result.link}" target="_blank" class="result-link">Ver mais →</a>
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

        // Add user message
        addMessage(message, 'user');
        airiaInput.value = '';

        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 1000);
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
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        airiaMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        airiaMessages.scrollTop = airiaMessages.scrollHeight;
    }

    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Saudações
        if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
            return 'Olá! Sou a AirIA, sua assistente virtual da AirNet. Como posso ajudar você hoje?';
        }
        
        
        
        
        
        // Serviços
        if (lowerMessage.includes('serviços') || lowerMessage.includes('serviço') || lowerMessage.includes('desenvolvimento') || lowerMessage.includes('web')) {
            return 'Oferecemos desenvolvimento web completo, incluindo sites responsivos, e-commerce, aplicações móveis e consultoria em TI. Visite nossa página de Serviços para mais detalhes ou entre em contato!';
        }
        
        //Quais são os serviços oferecidos
        if (lowerMessage.includes('quais') && lowerMessage.includes('serviços')) {
            return 'Nossos serviços incluem: Desenvolvimento de Sites, E-commerce, Aplicações Móveis, criação de Portais, Consultoria em TI, e muito mais! Para detalhes específicos, visite nossa página de Serviços ou entre em contato conosco.';
        }

        // Contato
        if (lowerMessage.includes('contato') || lowerMessage.includes('falar') || lowerMessage.includes('email') || lowerMessage.includes('whatsapp')) {
            return 'Você pode nos contatar através da página de Contactos, WhatsApp: +244 956 239 945, email: airnet220@gmail.com ou visite nosso site oficial: airnet-angola.com';
        }

        // Pesquisa na web
        if (lowerMessage.includes('pesquise') || lowerMessage.includes('google') || lowerMessage.includes('web') || lowerMessage.includes('internet')) {
            window.open('https://www.google.com/search?q=' + encodeURIComponent(message), '_blank');
            return 'Estou abrindo uma pesquisa na web para você. Veja a nova aba do navegador para os resultados.';
        }
        
        // Busca
        if (lowerMessage.includes('busca') || lowerMessage.includes('procurar') || lowerMessage.includes('encontrar')) {
            return 'Use nossos motores de busca especializados na página Busca para encontrar informações sobre serviços, projetos e contatos. Temos buscas para geral, serviços, projetos e contatos!';
        }
        
        // Sobre a empresa
        if (lowerMessage.includes('airnet') || lowerMessage.includes('empresa') || lowerMessage.includes('sobre') || lowerMessage.includes('quem')) {
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
        if (lowerMessage.includes('tchau') || lowerMessage.includes('até') || lowerMessage.includes('bye')) {
            return 'Até logo! Não hesite em voltar se precisar de ajuda. A AirNet agradece sua visita!';
        }
        
        // Perguntas sobre criadores/team
        if (lowerMessage.includes('criador') || lowerMessage.includes('criadores') || lowerMessage.includes('team') || lowerMessage.includes('equipa') || lowerMessage.includes('quem criou') || lowerMessage.includes('desenvolvedor') || lowerMessage.includes('dev') || lowerMessage.includes('founders')) {
            return 'A AirNet foi criada por uma equipa talentosa: Patrice de Oliveira (Líder dos Desenvolvedores), Epifanio da Costa (CEO), Luane Papagaio (Marketing), Manuel de Carvalho (Desenvolvedor), e Hogenea. Somos apaixonados por tecnologia e inovação!';
        }
        // Quem é o CEO        
        if (lowerMessage.includes('ceo') || lowerMessage.includes('epifanio da costa')) {
            return 'O CEO da AirNet é Epifanio da Costa. Ele é responsável por liderar a visão e estratégia da empresa para o futuro.';
        }
        // Quem é o líder dos desenvolvedores
        if (lowerMessage.includes('patrice') || lowerMessage.includes('oliveira')) {
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
        
        if (lowerMessage.includes('hogenea') || lowerMessage.includes('secretária') || lowerMessage.includes('heogenea') || lowerMessage.includes('Escritas')) {
            return 'Hogenea é membro da equipa AirNet, contribuindo para o sucesso dos nossos projetos e inovações.';
        }
        
        // Resposta padrão
        return 'Desculpe, não entendi completamente sua pergunta. Tente reformular ou visite nossas páginas: Serviços, Contactos, Busca ou Divulgações. Ou envie um email para airnet220@gmail.com para suporte personalizado.';
    }
});








