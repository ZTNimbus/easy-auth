# Easy Auth

A fully featured authentication and authorization system built with React, TailwindCSS, Node, Express.js, and MongoDB. Includes email verification, password reset functionality, and Mailtrap integration via Nodemailer.

🌐 **Live Demo**: [Easy Auth](https://easy-auth.onrender.com)

## Features

- **User Authentication**: Register, log in, log out
- **Email Verification**: Users receive a verification email upon signup
- **Password Management**: Reset password functionality with secure email links
- **Email Notifications**:
  - 📩 Verification email upon signup
  - 🎉 Welcome email after successful registration
  - 🔑 Password reset email with a secure link
  - ✅ Confirmation email after a successful password reset
- **Secure Sessions**: JSON Web Tokens (JWT) for authentication

## Tech Stack

- **Backend**: Express.js, Mongoose (MongoDB), JSON Web Token (JWT), Nodemailer
- **Frontend**: React, React Router, Zustand (for state management), TailwindCSS
- **Security**: Bcrypt.js for password hashing, cookie-based authentication
- **Development Tools**: TypeScript, Vite, ESLint, Axios

## Installation

### 1. Clone the repository

```sh
git clone https://github.com/ZTNimbus/easy-auth.git
cd easy-auth
```

### 2. Install dependencies

```sh
npm install
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and set up the following variables:

```env
MONGO_URI=your_mongodb_uri
PORT=port_for_development_eg_3000
JWT_SECRET=your_jwt_secret
NODE_ENV=development
MAILTRAP_TOKEN=your_mailtrap_token
CLIENT_URL=your_frontend_url_or_hosted_url
```

### 4. Start the application

```sh
npm run dev
cd frontend
npm run dev
```

## API Endpoints

- **POST** `/api/auth/signup` - Register a new user
- **POST** `/api/auth/login` - Authenticate user and return JWT
- **POST** `/api/auth/logout` - Log out user
- **POST** `/api/auth/verify-email` - Verify user email
- **POST** `/api/auth/forgot-password` - Send password reset email
- **POST** `/api/auth/reset-password/:token` - Update password using reset token
- **GET** `/api/auth/check-auth` - Check authentication status

### Route Configuration

The authentication routes are configured in `authRoutes.js`:

```js
app.use("/api/auth", authRoutes);
```

### Additional Setup for Local Installation

- Ensure **CORS** configurations are properly updated in `backend/index.js`.
- In the frontend, handle API URL configuration in `useAuthStore.ts`:

```js
const API_URL =
  import.meta.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/auth"
    : "/api/auth";
```

### Node.js Version Requirement

Ensure you are using **Node.js v22** for compatibility.
