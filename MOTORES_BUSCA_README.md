# Motores de Busca AirNet

## Visão Geral
O sistema de motores de busca da AirNet oferece funcionalidades avançadas de pesquisa para encontrar informações sobre serviços, projetos e contatos da empresa.

## Funcionalidades Implementadas

### 1. Busca Geral
- Pesquisa abrangente em todas as categorias
- Combina resultados de serviços, projetos e contatos
- Interface unificada para consultas gerais

### 2. Busca de Serviços
- Pesquisa específica nos serviços oferecidos
- Inclui desenvolvimento web, e-commerce, documentação e segurança
- Resultados categorizados por tipo de serviço

### 3. Busca de Projetos
- Exploração do portfólio de projetos realizados
- Busca por tipo de projeto (e-commerce, portais, sistemas)
- Links diretos para páginas de demonstração

### 4. Busca de Contatos
- Informações de contato e suporte
- WhatsApp, formulários e links oficiais
- Canais de comunicação disponíveis

### 5. Link Oficial
- Domínio oficial: https://airnet-angola.com
- Acesso direto ao site institucional
- Informações completas sobre a empresa

## Arquivos Criados/Modificados

### Frontend
- `busca.html` - Página principal dos motores de busca
- `Asserts/Css/stylr.css` - Estilos para interface de busca
- Menu de navegação atualizado em todas as páginas

### Backend
- `php/pagina.php` - API de busca com funções especializadas
- Funções PHP para cada tipo de busca
- Respostas JSON estruturadas

## Como Usar

1. Acesse a página "Busca" no menu de navegação
2. Escolha o tipo de busca desejado
3. Digite os termos de pesquisa
4. Clique no botão correspondente
5. Explore os resultados retornados

## API Endpoints

### Busca Geral
```
POST /php/pagina.php
{
  "action": "search",
  "type": "general",
  "query": "termo de busca"
}
```

### Busca Específica
```
POST /php/pagina.php
{
  "action": "search",
  "type": "service|project|contact",
  "query": "termo específico"
}
```

## Próximas Melhorias

- [ ] Integração com banco de dados para buscas dinâmicas
- [ ] Sistema de filtros avançados
- [ ] Busca por localização geográfica
- [ ] Histórico de buscas do usuário
- [ ] Sugestões automáticas durante a digitação

## Suporte

Para dúvidas sobre os motores de busca, entre em contato:
- WhatsApp: +244 956 239 945
- Email: através do formulário de contato
- Site oficial: https://airnet-angola.com



