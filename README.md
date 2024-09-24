# 🚀 Server

This project is an API template built using Express.js, MongoDB, Bunny, TypeScript, Morgan, HTTP, express-rate-limit, body-parser, Multer, Zod, nodemailer, and jsonwebtoken.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

## ✨ Features

- Server creation with Express.js
- Data storage with MongoDB
- Type safety with TypeScript
- HTTP request logging with Morgan
- Rate limiting with express-rate-limit
- Body parsing with body-parser
- Input validation with Zod
- Authentication with jsonwebtoken

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Xjectro/bun-api-template.git
   ```
2. Install the dependencies:
   ```bash
   bun install
   ```
3. Create a `.env` file and add the necessary environment variables:

   ```env
   PORT=5000
   JWT_SECRET=D04rSbcNX5

   MONGODB_HOST=127.0.0.1
   MONGODB_PORT=27017
   MONGODB_DB_NAME=server

   EMAIL_USER=
   EMAIL_PASS=

   NODE_ENV=test
   BASE_URL=http://localhost:5000

   DISCORD_REDIRECT_URI=http://localhost:3000/callback/discord
   DISCORD_CLIENT_ID=
   DISCORD_CLIENT_SECRET=
   DISCORD_TOKEN=

   BUNNY_ACCESS_KEY=
   BUNNY_STORAGE_NAME=
   BUNNY_HOST_NAME=
   ```

## 🛠 Usage

To start the server:

```bash
bun run dev
```

## 📂 Project Structure

```bash
📦 server
 ┣ 📂 node_modules
 ┣ 📂 public
 ┃ ┗ 📜 .gitkeep
 ┣ 📂 src
 ┃ ┣ 📂 api
 ┃ ┣ 📂 constants
 ┃ ┣ 📂 controllers
 ┃ ┣ 📂 database
 ┃ ┣ 📂 middlewares
 ┃ ┣ 📂 routes
 ┃ ┣ 📂 services
 ┃ ┣ 📂 utils
 ┃ ┣ 📂 validator
 ┃ ┣ 📜 index.ts
 ┃ ┗ 📜 server.ts
 ┣ 📂 templates
 ┃ ┣ 📂 css
 ┃ ┣ 📂 html
 ┃ ┗ 📂 scripts
 ┣ 📂 test
 ┃ ┗ 📜 apis.test.ts
 ┣ 📂 uploads
 ┣ 📜 .env.example
 ┣ 📜 jest.config.js
 ┣ 📜 LICENSE
 ┣ 📜 nodemon.json
 ┣ 📜 .gitignore
 ┣ 📜 package.json
 ┣ 📜 bun.lockb
 ┣ 📜 README.md
 ┗ 📜 tsconfig.json
```
