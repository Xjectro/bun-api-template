# 🚀 Express API Template

This project is an API template built using Express.js, MongoDB, TypeScript, Morgan, HTTP, express-rate-limit, body-parser, Zod, nodemailer, and jsonwebtoken.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)

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
   git clone https://github.com/deverays/express-api-template.git
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add the necessary environment variables:
   ```env
   PORT=5000
   JWT_SECRET=
   MONGODB_HOST=
   MONGODB_PORT=
   MONGODB_DB_NAME=
   EMAIL_USER=
   EMAIL_PASS=
   NODE_ENV=
   ```

## 🛠 Usage

To start the server:

```bash
npm run dev
```

## 📂 Project Structure

```bash
📦 express-api-template
 ┣ 📂 src
 ┃ ┣ 📂 controllers
 ┃ ┃ ┣ 📜 token.ctrl.ts
 ┃ ┃ ┣ 📜 users.ctrl.ts
 ┃ ┃ ┗ 📜 auth.ctrl.ts
 ┃ ┣ 📂 database
 ┃ ┃ ┣ 📂 models
 ┃ ┃ ┗ 📜 dbConnection
 ┃ ┣ 📂 services
 ┃ ┣ ┣ 📜 alertServices
 ┃ ┃ ┗ 📜 dbServices
 ┃ ┣ 📂 infrastructure
 ┃ ┣ 📂 routes
 ┃ ┣ 📂 utils
 ┃ ┣ 📜 index.ts
 ┃ ┗ 📜 server.ts
 ┣ 📂 test
 ┣ 📜 .env.example
 ┣ 📜 jest.config.js
 ┣ 📜 LICENSE
 ┣ 📜 nodemon.json
 ┣ 📜 .gitignore
 ┣ 📜 package.json
 ┣ 📜 README.md
 ┗ 📜 tsconfig.json
```

## 📄 License

```bash
I hope this README file clearly describes your project and makes it easier for other developers to understand and contribute! Let me know if you need any further changes or additions.
```
