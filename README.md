# Arkana
**Social contribution and donation management system.**  
[Access the Live Web Application](https://arkana-projeto1.vercel.app)

## About
Social contribution and donation management system consisting of a web application for mentors and admins (TypeScript/Next.js) and a backend infrastructure (Node.js/Prisma); both facilitating the tracking of food and financial donations. Users register contributions, upload digital receipts via Cloudinary, and view personal histories; while admins manage users' data and teams as well as the donation database and performance reports through the web app.
This project was developed for the [Lideranças Empáticas Project](https://liderancasempaticas.com/), a FECAP initiative that unites social impact and entrepreneurial education.

## Tech Stack
* **Frontend:** Next.js (TypeScript), Tailwind CSS
* **Backend:** Node.js, Express
* **Database:** MySQL with Prisma ORM
* **Cloud Services:** Cloudinary (Image Storage)
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt

## Key Features
* **User Management:** Secure registration and login for Mentors and Administrators.
* **Team Coordination:** Authorized creation and management of student teams.
* **Donation Tracking:** Registration of food and financial contributions with digital receipt uploads.
* **Interactive Analytics:** Visual reports and charts for monitoring goals and team rankings.
* **History Logs:** Full access to past contribution records for transparency.

## Project Structure
```text
├── backend
│   ├── prisma         # Database schema and migrations
│   └── src
│       ├── controllers # Request handlers
│       ├── services    # Business logic (e.g., Token management)
│       └── routes.js   # API endpoints
├── frontend
│   ├── app            # Next.js App Router pages
│   └── components     # Reusable UI elements
```

## Running Locally
### Prerequisites
* [Node.js](https://nodejs.org/) (LTS version)
* [MySQL](https://www.mysql.com/) database instance

### Installation
1. **Clone and Install:**
   ```bash
   git clone https://github.com/sofiahernandes/arkana.git
   cd arkana
   npm install
   ```

2. **Workspace Setup:**
   * Locate the SQL script in `/entregas/entrega-1/banco-de-dados/`.
   * Import it into your MySQL Workbench.
   * Configure your `.env` file in the `/backend` folder with your credentials:
     ```env
     NEXT_PUBLIC_BACKEND_URL=
     FRONTEND_URL=
     ```
   * Configure your `.env` file in the `/frontend` folder with your credentials:
     ```env
     NEXT_PUBLIC_BACKEND_URL=
     ```

3. **Run Development Servers:**
   Open two terminals and run the following in `/frontend` and `/backend`:
   ```bash
   npm run dev
   ```

## Contributors
* [Analice Coimbra Carneiro](https://github.com/AnaliceCoimbra/)
* [Mariah Alice Pimentel Lôbo Pereira](https://github.com/alicelobwp)
* [Sofia Botechia Hernandes](https://github.com/sofiahernandes)
* [Victória Duarte Vieira Azevedo](https://github.com/viick04)

## License
Licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © 2025. Developed at **FECAP**.
