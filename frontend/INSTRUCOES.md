# 📊 Frontend - Auditor Digital

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado
- Backend rodando em `http://127.0.0.1:8000`

### Passos para Rodar

1. **Instalar dependências:**
```bash
cd frontend
npm install
```

2. **Iniciar o servidor de desenvolvimento:**
```bash
npm start
```

3. **Acessar a aplicação:**
- URL: `http://localhost:3000`
- O dashboard será carregado automaticamente

## 🎯 Funcionalidades Implementadas

### ✅ Dashboard Principal
- Seletor de competência (últimos 12 meses)
- Cards com estatísticas principais:
  - Empresas Ativas
  - Empresas Optantes
  - Empresas que Declararam
  - Empresas que Não Declararam
  - Empresas Inadimplentes
  - Percentual de Declaração
  - ISS Declarado
  - ISS Pago

### ✅ Interface Responsiva
- Design moderno e limpo
- Cores diferenciadas por tipo de estatística
- Animações suaves
- Layout adaptável para mobile

### ✅ Integração com API
- Conecta automaticamente com o backend
- Tratamento de erros
- Loading states
- Atualizações em tempo real

## 🛠️ Estrutura do Projeto

```
frontend/src/
├── components/
│   ├── CompetenciaSelector.jsx  # Seletor de mês/ano
│   └── StatsCards.jsx          # Cards de estatísticas
├── pages/
│   └── Dashboard.jsx           # Página principal
├── services/
│   └── api.js                  # Configuração da API
├── App.js                      # Componente raiz
├── App.css                     # Estilos globais
└── Dashboard.css               # Estilos do dashboard
```

## 🎨 Personalização

### Cores das Estatísticas
- **Azul**: Dados informativos (empresas ativas, declararam)
- **Verde**: Dados positivos (optantes, percentuais bons)
- **Laranja**: Dados de atenção (não declararam)
- **Vermelho**: Dados críticos (inadimplentes)
- **Roxo**: Valores financeiros (ISS declarado)
- **Teal**: Pagamentos (ISS pago)

### Responsividade
- Desktop: Grid de 3-4 colunas
- Tablet: Grid de 2 colunas
- Mobile: Grid de 1 coluna

## 🐛 Troubleshooting

### Erro de CORS
Se aparecer erro de CORS, adicione no backend:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API não conecta
1. Verifique se o backend está rodando
2. Confirme a URL em `services/api.js`
3. Teste os endpoints no Swagger: `http://127.0.0.1:8000/docs`

## 📱 Screenshots

O dashboard mostrará:
- Header com título e seletor de competência
- Grid de cards com as estatísticas
- Resumo da auditoria na parte inferior
- Indicadores visuais de performance (verde/amarelo/vermelho)
