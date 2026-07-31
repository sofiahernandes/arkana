<div align="center">
<h1>Arkana | Social Campaign Managment System</h1>
<img height="240" alt="social-campaign-manager" src="https://github.com/user-attachments/assets/0afd9c5b-78a2-4789-b2d0-860bc5724729" />

<p>Access the application: <a href="https://arkana-portfolio.vercel.app">https://arkana-portfolio.vercel.app</a></p>

<p>Group: <a href="https://github.com/AnaliceCoimbra/">Analice Carneiro</a>, <a href="https://github.com/alicelobwp">Mariah Alice Pereira</a>, <a href="https://github.com/sofiahernandes">Sofia Hernandes</a>, <a href="https://github.com/viick04">Victória Azevedo</a> <br/>
Advisors: <a href="https://br.linkedin.com/in/cristina-machado-corr%C3%AAa-leite-630309160">Cristina Leite</a>, <a href="https://www.linkedin.com/in/dolemes/">David Lemes</a>, <a href="https://br.linkedin.com/in/francisco-escobar">Francisco Escobar</a>, <a href="https://br.linkedin.com/in/katia-bossi">Katia Bossi</a>, <a href="https://br.linkedin.com/in/leonardo-fabris-lugoboni-a3369416">Leonardo Lugoboni</a></p>
</div>

<br/>

## Description

Arkana is a TypeScript-first full-stack web application developed for the **Lideranças Empáticas Project**, an initiative by **FECAP University Center** that combines social impact with entrepreneurial education through food and fundraising campaigns.
The platform streamlines the management of every donation campaign edition by providing tools for team administration, activity tracking, goal monitoring, contribution management, receipt validation, and performance analytics.
Designed prioritizing scalability and maintainability, the application leverages **Next.js**, **Express**, **Prisma**, **MySQL**, **JWT authentication**, **Cloudinary**, and a RESTful architecture, with deployment configured for **Vercel** and **Railway**.

<br/>

## Folders structure

```yaml
backend/              # Express + Prisma backend application
  ├─ package.json
  ├─ .env.example
  ├─ prisma/          # Prisma schema, migrations, and generated client
  └─ src/
     ├─ app.js        # Express application setup (CORS, middleware, static files, error handling)
     ├─ db.js         # MySQL connection pool configuration
     ├─ db-test.js    # Database connectivity test
     ├─ routes.js     # API route definitions
     ├─ server.js     # Application entry point
     ├─ configs/      # Shared application configuration
     ├─ controllers/  # Request handlers and business logic
     ├─ middlewares/  # Custom Express middleware
     ├─ services/     # Shared services and external integrations
     └─ uploads/      # File upload configuration and utilities (Multer + Cloudinary)

frontend/             # Next.js 15 TypeScript frontend
  ├─ package.json
  ├─ .env.example
  ├─ next.config.mjs
  ├─ app/             # App Router pages, layouts, and routes
  ├─ assets/          # Static assets (images, icons, fonts)
  ├─ components/      # Reusable UI components
  ├─ hooks/           # Custom React hooks
  ├─ libs/            # Shared utilities and mock data for the demo
  └─ styles/          # Global and component styles

DATABASE.md           # Database schema documentation
README.md             # Project overview and setup guide
LICENSE               # MIT License
tailwind.config.js
postcss.config.js
```

<br/>

## How to run it locally

0. Pre-requisites: [Node.js](https://nodejs.org/) and [Yarn](https://classic.yarnpkg.com/lang/en/) ou `npm`

1. Clone and enter repo

```bash
git clone https://github.com/sofiahernandes/social-campaign-manager.git
cd social-campaign-manager
```

2. Install dependencies (root then frontend/backend if needed)

```bash
npm install 
# or
yarn install
```

3. Prepare the database (SQL available in the Markdown file [DATABASE.md](https://github.com/sofiahernandes/social-campaign-manager/blob/main/DATABASE.md) — run arkana-database.sql in your MySQL) 

4. Start development servers (run in both backend and frontend directories)
```bash
npm run dev 
# or
yarn run dev
```

<br/>

## License

<a href="https://www.fecap.br">FECAP - Fundação de Comércio Álvares Penteado</a> - <a href="https://github.com/sofiahernandes/social-campaign-manager">Arkana (Social Campain Manager)</a> © 2025 by <a href="https://github.com/analicecoimbra">Analice Coimbra Carneiro</a>, <a href="https://github.com/alicelobwp">Mariah Alice Pimentel Lôbo Pereira</a>, <a href="https://github.com/sofiahernandes">Sofia Botechia Hernandes</a> and <a href="https://github.com/viick04">Victória Duarte Vieira Azevedo</a> is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" height="20" width="20" style="margin-left: 0.2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" height="20" width="20" style="margin-left: 0.2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" height="20" width="20" style="margin-left: 0.2em;">
