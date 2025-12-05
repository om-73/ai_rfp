# RFP AI System

A single-user Intelligent Procurement System that simplifies the RFP lifecycle using AI. This application allows users to create structured RFPs from natural language, manage vendors, send emails, and intelligently process vendor proposals.

## Features

- **Natural Language RFP Creation**: Type your requirements in plain English, and the system generates a structured RFP using OpenAI.
- **Vendor Management**: Maintain a database of vendors with their categories.
- **Email Integration**: Send invitations to vendors directly via email.
- **Automated Proposal Processing**: Connects to your email inbox, detects vendor responses, and uses AI to extract key data (price, timelines, terms).
- **Intelligent Comparison**: Side-by-side comparison of proposals with AI-generated confidence scores.

## Architecture

- **Frontend**: React (Vite) + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MySQL (Sequelize ORM)
- **AI**: OpenAI (GPT-4o mini)
- **Email**: Nodemailer (SMTP) + Imap-Simple (IMAP)

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MySQL Server
- OpenAI API Key
- Email Account (SMTP/IMAP enabled, e.g., Gmail with App Password)

### 1. Database Setup
Create a MySQL database named `rfp_ai_db`.
```sql
CREATE DATABASE rfp_ai_db;
```

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `../.env` and fill in your details.
   ```env
   DB_USER=root
   DB_PASSWORD=your_password
   OPENAI_API_KEY=sk-...
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ...
   ```
4. Initialize the database (Creates tables):
   ```bash
   node scripts/initDb.js
   ```
5. Start the server:
   ```bash
   node server.js
   ```
   Server runs on `http://localhost:3000`.

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`.

## API Documentation

### Vendors
- `GET /api/vendors` - List all vendors
- `POST /api/vendors` - Create a vendor
- `DELETE /api/vendors/:id` - Delete a vendor

### RFPs
- `GET /api/rfps` - List all RFPs
- `POST /api/rfps` - Create a new RFP (Body: `{ user_prompt: "..." }`)
- `POST /api/rfps/send` - Send RFP to vendors (Body: `{ rfpId: 1, vendorIds: [1, 2] }`)

### Proposals
- `POST /api/proposals/check-emails` - Trigger inbox check for new proposals
- `GET /api/proposals/rfp/:rfpId` - Get proposals for a specific RFP

## Key Decisions & Assumptions

- **AI Model**: Used GPT-4o for its high reliability in JSON structure extraction.
- **Email Workflow**: Assumes vendors reply to the same email address configured in the system. The system basically scans the inbox and tries to match the sender to a known vendor and assigns the proposal to the latest active RFP.
- **Single User**: No authentication implemented as per scope.

## AI Tools Usage

Built with the assistance of an AI Agent (Antigravity).
- **Scaffolding**: Quickly generated file structures and boilerplate code.
- **Debugging**: Helped resolve syntax errors in email handling.
- **Logic**: Generated the AI prompt strategies for extraction.
