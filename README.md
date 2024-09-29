# 🚀 Bun Api Template

This project is a modern API template built using Express.js, MongoDB, Bunny CDN, TypeScript, and other robust technologies. It is designed to help you quickly set up a scalable and secure API with various essential features such as rate limiting, authentication, and email handling.

## 📋 Table of Contents

- [✨ Features](#-features)
- [⚙️ Installation](#%EF%B8%8F-installation)
- [🛠 Usage](#-usage)
- [📂 Project Structure](#-project-structure)

## ✨ Features

- **Server creation** with Express.js
- **MongoDB** for scalable data storage
- **TypeScript** for type safety
- **Morgan** for HTTP request logging
- **express-rate-limit** for rate limiting
- **body-parser** for body parsing
- **Multer** for file uploads
- **Zod** for input validation
- **jsonwebtoken** for authentication
- **Nodemailer** for email integration
- **Bunny CDN** for media content delivery

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
JWT_SECRET=D04rS

MONGOOSE_URI=

NODEMAILER_USER=
NODEMAILER_PASS=

NODE_ENV=test
BASE_URL=http://localhost:5000

DISCORD_REDIRECT_URI=http://localhost:3000/callback/discord
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_TOKEN=

BUNNY_ACCESS_KEY=
BUNNY_STORAGE_NAME=
BUNNY_HOST_NAME=storage.bunnycdn.com
   ```

## 🛠 Usage

To start the server in development mode:
```bash
bun run dev
```
To build and run the project in production:
```bash
bun run build
bun run dist/index.js
```

## 📂 Project Structure

```bash
📦 bun-api-template
 ┣ 📂 node_modules
 ┣ 📂 src
 ┃ ┣ 📂 api           # API routes and logic
 ┃ ┣ 📂 controllers   # Business logic and controllers
 ┃ ┣ 📂 database      # Database connection and models
 ┃ ┣ 📂 middlewares   # Custom middleware functions
 ┃ ┣ 📂 routes        # Route definitions
 ┃ ┣ 📂 services      # Services and utility functions
 ┃ ┣ 📂 utils         # Helper utilities
 ┃ ┣ 📜 index.ts      # App entry point
 ┃ ┗ 📜 server.ts     # Server configuration
 ┣ 📂 templates       # Static templates (HTML, CSS, JavaScript)
 ┃ ┣ 📂 css
 ┃ ┣ 📂 html
 ┃ ┗ 📂 scripts
 ┣ 📂 test            # Unit and integration tests
 ┃ ┗ 📜 apis.test.ts  # API test cases
 ┣ 📂 uploads         # File uploads directory
 ┣ 📜 .env.example    # Example environment variables
 ┣ 📜 jest.config.js  # Jest configuration
 ┣ 📜 LICENSE         # License file
 ┣ 📜 nodemon.json    # Nodemon configuration
 ┣ 📜 .gitignore      # Git ignore file
 ┣ 📜 package.json    # Project metadata
 ┣ 📜 bun.lockb       # Bun lock file for dependencies
 ┣ 📜 README.md       # Project documentation
 ┗ 📜 tsconfig.json   # TypeScript configuration
```
