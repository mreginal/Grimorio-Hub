# 🎲 RPG HUB

Base inicial do sistema de ferramentas para RPG.

## Stack

- React + TypeScript + Vite
- CSS puro — sem Tailwind
- Firebase Authentication
- Python + Flask
- Firebase Admin SDK
- Lucide React para ícones

## Nesta primeira versão

- Login com Firebase
- Cadastro com Firebase
- Proteção de rotas
- Logout
- Dashboard principal
- Sidebar
- Cards de Parties
- Próximas sessões
- Personagens recentes
- Estrutura preparada para API Flask

## Estrutura

```text
rpg-hub/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── types.ts
│   └── ...
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## 1. Firebase

Crie um projeto no Firebase e ative:

**Authentication → Sign-in method → Email/Password**

Depois copie `frontend/.env.example` para:

```text
frontend/.env
```

e preencha as credenciais do aplicativo Web Firebase.

Para o Flask, gere uma Service Account em:

**Project settings → Service accounts → Generate new private key**

Salve o JSON em:

```text
backend/serviceAccountKey.json
```

> O arquivo da Service Account nunca deve ir para o Git.

## 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse:

http://localhost:5173

## 3. Backend

Em outro terminal:

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Depois:

```bash
pip install -r requirements.txt
python app.py
```

API:

http://localhost:5000/api/health

## Próxima etapa

A arquitetura já deixa espaço para:

- criação de personagens
- IA para personagens
- criação de Party
- papel Mestre/Player por Party
- sessões
- rolagem de dados
- combate
- mapas
- NPCs
- lore
- Discord
- comunidade
- Firestore
