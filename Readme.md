# Socialify

A full-stack mini social feed built for the **3W Full Stack Internship Assignment**.

Socialify allows users to create an account, sign in, publish text or image posts, browse a paginated social feed, like posts, and add comments.

## Live Demo

- **Frontend:** https://socialify-mini-social-post-applicat.vercel.app/
- **Backend:** https://socialify-backend-njvm.onrender.com/api/health
- **GitHub:** https://github.com/Sarthak-Singh2005/Socialify-Mini-Social-Post-Application

---

## Features

- User registration and login with JWT authentication
- Protected social feed and post actions
- Create text posts, image posts, or posts containing both
- Client-side image compression before upload
- Like and unlike posts with immediate UI updates
- Add and view comments with immediate UI updates
- Feed filters:
  - All posts
  - Most liked
  - Most commented
- Pagination with a **Load More** flow
- Responsive React interface
- MongoDB persistence using only two collections:
  - `users`
  - `posts`

---

## Tech Stack

### Frontend

- React 18
- React Router
- Axios
- Vite
- CSS

### Backend

- Node.js
- Express
- Mongoose

### Database

- MongoDB
- MongoDB Atlas compatible

### Authentication

- JSON Web Tokens (JWT)
- bcryptjs

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## Project Structure

```text
Socialify-Mini-Social-Post-Application/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Authentication and post logic
│   │   ├── middleware/      # JWT authentication middleware
│   │   ├── models/          # User and Post schemas
│   │   ├── routes/          # Auth and post API routes
│   │   └── utils/           # Token generation
│   ├── package.json
│   └── render.yaml
│
└── frontend/
    ├── src/
    │   ├── components/      # Navbar, composer, post cards, route guard
    │   ├── context/         # Authentication state
    │   ├── pages/           # Home, login, and signup pages
    │   ├── services/        # API client and image processing
    │   └── styles/          # Global styles
    ├── package.json
    └── vercel.json
```

---

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sarthak-Singh2005/Socialify-Mini-Social-Post-Application.git
cd Socialify-Mini-Social-Post-Application
```

### 2. Configure the Backend

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/threew-social-posts
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
```

If you are using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

Install dependencies and start the backend:

```bash
cd backend
npm install
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 3. Configure the Frontend

The frontend uses the following environment variable when a custom API URL is required.

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

---

## Production Frontend Build

To create and preview a production build:

```bash
cd frontend
npm run build
npm run preview
```

---

# API Reference

All `/api/posts/*` routes require authentication using:

```http
Authorization: Bearer <token>
```

The health endpoint is public.

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Create an account and return a token |
| `POST` | `/api/auth/login` | Authenticate a user and return a token |

## Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check API availability |

## Posts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts/all?page=1&limit=6` | Get newest posts |
| `GET` | `/api/posts/mostliked?page=1&limit=6` | Get posts sorted by likes |
| `GET` | `/api/posts/mostcomment?page=1&limit=6` | Get posts sorted by comments |
| `POST` | `/api/posts` | Create a text and/or image post |
| `POST` | `/api/posts/:id/like` | Toggle the current user's like |
| `POST` | `/api/posts/:id/comment` | Add a comment to a post |

---

## Image Handling

Images are processed on the client before being sent to the backend.

The frontend:

1. Reads the selected image.
2. Compresses and resizes the image in the browser.
3. Converts the image to JPEG data.
4. Sends the compressed image data to the API.
5. Stores the resulting image data with the post.

The API accepts embedded images up to approximately **3 MB after compression**.

---

# Database Design

The application intentionally uses only **two MongoDB collections**, as required by the assignment.

## Users Collection

The `users` collection stores:

- Username
- Email
- Hashed password
- Timestamps

Passwords are hashed using `bcryptjs` and are never stored as plain text.

## Posts Collection

The `posts` collection stores:

- Author information
- Username
- Post text
- Image data
- Likes
- Usernames of users who liked the post
- Comments
- Comment author information
- Timestamps

### Embedded Comments

Comments are embedded directly inside post documents.

This keeps the database design limited to the required two collections:

```text
users
posts
```

No separate comments collection is required.

---

# Authentication Flow

Socialify uses JWT-based authentication.

```text
User
 │
 ├── Sign Up
 │      ↓
 │   Password hashed with bcryptjs
 │      ↓
 │   User stored in MongoDB
 │      ↓
 │   JWT returned
 │
 └── Login
        ↓
     Credentials verified
        ↓
     JWT returned
        ↓
     Frontend stores authentication state
        ↓
     JWT sent with protected API requests
```

Protected actions include:

- Viewing the authenticated feed
- Creating posts
- Liking posts
- Commenting on posts

---

# Feed and Pagination

The feed supports three sorting options:

### All Posts

Displays the newest posts first.

### Most Liked

Displays posts based on their like count.

### Most Commented

Displays posts based on their comment count.

The feed uses pagination rather than loading all posts at once.

Example:

```text
/api/posts/all?page=1&limit=6
```

The frontend provides a **Load More** interaction to request additional posts.

---

# Deployment

## Backend — Render

The repository includes:

```text
backend/render.yaml
```

Configure the Render service with the `backend` directory as its root.

Environment variables:

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-production-secret>
FRONTEND_URL=https://<your-vercel-project>.vercel.app
```

The configured commands are:

```text
Build Command:
npm install

Start Command:
npm start
```

Render provides the production `PORT` automatically.

Do not commit the backend `.env` file to the repository.

---

## Frontend — Vercel

Import the repository into Vercel and set the project root to:

```text
frontend
```

Configure:

```env
VITE_API_URL=https://<your-render-service>.onrender.com/api
```

The repository includes:

```text
frontend/vercel.json
```

which rewrites client-side routes to `index.html` for React Router compatibility.

After deploying the frontend, configure the exact Vercel deployment URL in the backend's:

```env
FRONTEND_URL
```

environment variable.

If a custom domain is used, it can be added as an additional allowed origin.

---

# Assignment Coverage

The project implements the requirements from the **3W Full Stack Internship Assignment**.

| Requirement | Implementation |
|---|---|
| Account creation | Signup page with hashed passwords and JWT authentication |
| Login | JWT-based authentication with bcrypt password verification |
| Create post | Authenticated composer for text and/or images |
| Text post | Supported |
| Image post | Supported |
| Text + image post | Supported |
| Feed | Authenticated, paginated social feed |
| Like | Like/unlike toggle with immediate UI update |
| Comment | Embedded comments with immediate UI update |
| Like/comment usernames | Stored with post data |
| React frontend | Vite-powered React application |
| Node.js + Express backend | REST API under `backend/src` |
| MongoDB | Mongoose `User` and `Post` models |
| Two collections | `users` and `posts` only |
| Responsive UI | Responsive CSS layout |
| Pagination | Paginated API with Load More flow |
| Reusable code | Shared components, context, services, controllers, and middleware |

---

# Scripts

## Backend

From the `backend` directory:

```bash
npm start
```

Starts the production server.

```bash
npm run dev
```

Starts the development server with nodemon.

## Frontend

From the `frontend` directory:

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

---

# Environment Variables

## Backend

Create:

```text
backend/.env
```

with:

```env
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<secure-random-secret>
PORT=5000
FRONTEND_URL=<frontend-url>
```

## Frontend

Create:

```text
frontend/.env
```

with:

```env
VITE_API_URL=<backend-api-url>
```

### Important

Do not commit `.env` files or production secrets to GitHub.

---

# Submission

- **GitHub Repository:** https://github.com/Sarthak-Singh2005/Socialify-Mini-Social-Post-Application
- **Deployed Frontend:** https://socialify-mini-social-post-applicat.vercel.app/
- **Deployed Backend:** https://socialify-backend-njvm.onrender.com/api/health


---

## Built For

**3W Full Stack Internship Assignment**

The project was developed with a focus on:

- Clean project structure
- Reusable components
- Basic authentication
- RESTful API design
- MongoDB data persistence
- Responsive UI
- Efficient pagination
- Immediate UI updates for likes and comments
- Simple deployment using Vercel and Render
