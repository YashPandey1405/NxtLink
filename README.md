# NxtLink — URL Shortener App

_A full-stack URL shortener application built with Next.js, MongoDB, and JWT authentication._

🎥 **Demo Video:** [Watch on YouTube](https://youtu.be/5n8TJRkrEA8)  
🌐 **Live App:** [nxt-link-lilac.vercel.app](https://nxt-link-lilac.vercel.app)

---

## 🚀 Features

- **Full-stack Next.js** app (frontend + backend API routes)
- Secure **JWT & bcryptjs** based user authentication (Signup, Login, Logout)
- MongoDB for persistent storage of users and shortened URLs
- Short URL generation using **Nano ID**
- Role-based URL access: Public and Private URLs
- Frontend routing with **React Router DOM**
- Clean, responsive UI built in JSX/React
- ✅ **Deployed on Vercel** for fast, global delivery

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

## 🧪 Testing API with Postman

You can import the provided Postman collection (`NxtLink.postman_collection.json`) to test the following endpoints:

* **Signup:** `POST /api/signup`
* **Login:** `POST /api/login`
* **Logout:** `POST /api/logout`
* **Create short URL:** `POST /api/urls`
* **Get all URLs:** `GET /api/urls`
* **Get URL by ID:** `GET /api/urls/:id`

---

## 🚀 Deployment

The app is **live and deployed on Vercel**:
👉 [https://nxt-link-lilac.vercel.app](https://nxt-link-lilac.vercel.app)

Vercel handles seamless CI/CD. Just push your code and you're live.
Don’t forget to configure your **environment variables** in the Vercel dashboard under Project Settings → Environment Variables.
