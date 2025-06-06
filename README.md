# NxtLink — URL Shortener App

_A full-stack URL shortener application built with Next.js, MongoDB, and JWT authentication._

---

## 🚀 Features

- **Full-stack Next.js** app (frontend + backend API routes)
- Secure **JWT & bcryptjs** based user authentication (Signup, Login, Logout)
- MongoDB for persistent storage of users and shortened URLs
- Short URL generation using **Nano ID**
- Role-based URL access: Public and Private URLs
- Frontend routing with **React Router DOM**
- Clean, responsive UI built in JSX/React
- Deployed seamlessly on **Vercel**

---

## 📦 Tech Stack

| Frontend              | Backend            | Database     | Authentication  | Deployment |
| --------------------- | ------------------ | ------------ | --------------- | ---------- |
| Next.js (React + JSX) | Next.js API Routes | MongoDB      | JWT + bcryptjs  | Vercel     |
| React Router DOM      | Node.js + Express  | Mongoose ORM | JSON Web Tokens | Vercel     |

---

## 🔥 Features in Detail

### Authentication

- Signup with email, username, fullname, and password (hashed using bcryptjs)
- Login to generate JWT access and refresh tokens stored in HTTP-only cookies
- Secure logout which invalidates refresh token and clears cookies

### URL Shortening

- Create shortened URLs using Nano ID
- URLs can be **Public** (visible to all) or **Private** (visible only to the creator)
- Fetch URLs list, fetch by ID, update and delete (secured routes)

### Frontend

- Built using Next.js with JSX
- Routing handled via React Router DOM for smooth navigation
- Forms for signup, login, and URL creation
- Responsive UI for desktop and mobile

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v16 or higher
- MongoDB Atlas account or local MongoDB
- Vercel account (for deployment)

### Setup

1. Clone the repo

```bash
git clone https://github.com/yourusername/nxtlink.git
cd nxtlink
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file (see `.env.sample` for reference) and add:

```
PORT=8080
MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_jwt_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_jwt_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

MAILTRAP_SMTP_HOST=your_mailtrap_smtp_host
MAILTRAP_SMTP_PORT=your_mailtrap_smtp_port
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_password
```

4. Run the app locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing API with Postman

You can import the provided Postman collection (`NxtLink.postman_collection.json`) to test the following endpoints:

- **Signup:** `POST /api/signup`
- **Login:** `POST /api/login`
- **Logout:** `POST /api/logout`
- **Create short URL:** `POST /api/urls`
- **Get all URLs:** `GET /api/urls`
- **Get URL by ID:** `GET /api/urls/:id`

---

## 🚀 Deployment

The app is deployed on [Vercel](https://vercel.com/), just push your code and Vercel takes care of the rest. Make sure your environment variables are set on Vercel dashboard.

---
