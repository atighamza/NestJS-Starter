# 🚀 NestJS Starter Project

## Description

A production-ready NestJS starter project for building scalable server-side applications with Prisma ORM, JWT authentication (Access & Refresh Tokens), and cookie-based session handling.
Includes User CRUD, database setup via Docker, and structured module architecture.

## 🧩 Features


 **NestJS** — Modular and scalable architecture

 **Prisma ORM** — Type-safe database access

 **Authentication** — Access & Refresh Tokens (JWT)

 **Secure Cookies** — Refresh token stored in HttpOnly cookies

 **User Management** — Create, read, update, delete users

 **Role-Based Access Control (RBAC)** — Secure routes with roles 

 **Docker Compose** — Easy MySQL setup




## ⚡️ Getting Started
### Project setup

1️⃣ Clone the project
```bash
$ git clone https://github.com/atighamza/NestJS-Starter.git
$ cd NestJS-Starter

```

2️⃣ Install dependencies
```bash
$ npm install
```

3️⃣ Run MySQL with Docker
```bash
$ docker compose up -d
```

4️⃣ Run Prisma migrations
```bash
$ npx prisma migrate dev
```

### Compile and run the project

5️⃣Start the development server
```bash
$ npm run start:dev
```


## 🔑 Authentication Flow

**1-Signup / Login**\
→ User gets an access token (JWT) in response\
→ A refresh token is set in an HttpOnly cookie\

**2-Access Token Expired?**\
→ Frontend sends request to /auth/refresh\
→ Backend verifies the refresh token from cookie\
→ Returns new access token\

## 🧑‍💻 Author
**Hamza Atig**\
Full stack developer\
[Linkedin](https://www.linkedin.com/in/hamza-atig/)

