# 📁 DocDir - Backend Microservices with NestJS (Node.js v22)

This project implements a backend architecture using **NestJS** (Node.js v22) with a **microservices structure**. It comprises three core services:

- **🚪 Gateway** – Centralized API gateway to route requests to respective services.
- **👤 Directory Service** – Handles user management, authentication, roles, permissions, and session management.
- **📦 Drive Service** – Manages file uploads and downloads using AWS S3.

---

## 🏗️ Tech Stack

- **Node.js** v22 (Alpine)
- **NestJS** framework
- **PostgreSQL** for database
- **TypeORM** for ORM and migrations
- **AWS S3** for file storage
- **Docker & Docker Compose** for containerization

---

## 🧩 Services Breakdown

### 🚪 Gateway Service

- Acts as a **reverse proxy** to route requests to the correct microservice.
- Handles global middleware, validation, and logging.

### 👤 Directory Service

- Features:
  - User Registration & Login
  - Role & Permission Management
  - Session handling with refresh tokens
- Technologies:
  - NestJS + PostgreSQL
  - TypeORM
  - JWT-based Auth

### 📦 Drive Service

- Upload and download files securely to/from **AWS S3**.
- Validates file type and size.
- Generates signed URLs for secure access.

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose installed
- AWS credentials configured (for the Drive service)

### Clone the Repository

```bash
git clone https://github.com/Nav-jangra/docDir.git
cd docDir
```

### Run Services

```bash
docker-compose up --build
```

This starts all three services and the PostgreSQL database.

---

## 📂 Project Structure

```bash
docDir/
    ├── backend/
          ├── gateway/           # Gateway microservice
          ├── directory/         # Auth and user management
          ├── drive/             # File upload/download
    ├── setup/
          ├── init/              # SQL and DB setup
          ├── docker-compose.yml # Docker multi-service configuration 

```

---

## ⚙️ Environment Variables

Each service has its own `.env` file (configure before running):

### 📄 Gateway Service `.env`

```env

DB_HOST: "localhost"
DB_PORT: "5432"
DB_USERNAME: "postgres"
DB_PASSWORD: "postgres"
DB_NAME: "docdir_gateway"
APPLICATION_PORT: "3000"
JWT_SECRET: "your-secret"
```


### 📄 Directory Service `.env`

```env

DB_HOST: "localhost"
DB_PORT: "5432"
DB_USERNAME: "postgres"
DB_PASSWORD: "postgres"
DB_NAME: "docdir_directory"
APPLICATION_PORT: "5000"
JWT_SECRET: "your-secret"
JWT_SESSION_DURATION: "id"
```

### 📄 Drive Service `.env`

```env
DB_HOST: "postgres"
DB_PORT: "5432"
DB_USERNAME: "postgres"
DB_PASSWORD: "postgres"
DB_NAME: "docdir_drive"
APPLICATION_PORT: "4000"
AWS_S3_ACCESSKEYID: "accessid"
AWS_S3_SECRETACCESSKEY: "key"
AWS_S3_BUCKETNAME: "bucketname"
AWS_S3_REGIONNAME: "region"
AWS_S3_DEFAULT_TTL: "ttl"
Product: "local"
```

---

## 🛡️ Security & Best Practices

- JWT for authentication (access & refresh tokens)
- Role-based access control (RBAC)
- Secure, environment-specific configurations
- File size and MIME type validation for uploads

---

## 🧑‍💻 Author

**Naveen Jangra**
📧 [nav0813jangra@gmail.com](mailto:nav0813jangra@gmail.com)
🌐 [GitHub - Nav-jangra](https://github.com/Nav-jangra)

---

## 📜 License

This project is licensed under the **MIT License**.
