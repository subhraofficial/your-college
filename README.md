# Your College - Full Stack Web Application

A complete MVP for an education/admission guidance startup.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/your-college
JWT_SECRET=change_this_to_a_random_secret_key
```

### Seed the database (sample data + admin account)
```bash
npm run seed
```
This creates:
- ✅ Admin: `admin@yourcollege.com` / Password: `admin123`
- ✅ Sample colleges (3)
- ✅ Sample courses (BBA, BCA, B.Com, MBA, MCA)
- ✅ Default settings

### Start the backend
```bash
npm run dev   # development with auto-reload
npm start     # production
```
Backend runs at: http://localhost:5000

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:
```
VITE_API_URL=http://localhost:5000/api
```

### Start the frontend
```bash
npm run dev    # development
npm run build  # production build
```
Frontend runs at: http://localhost:3000

---

## 🌐 URLs

| URL | Description |
|-----|-------------|
| `/` | Home page |
| `/colleges` | All colleges |
| `/colleges/:id` | College detail page |
| `/courses` | All courses |
| `/about` | About page |
| `/contact` | Contact page |
| `/admin/login` | Admin login |
| `/admin` | Admin dashboard |
| `/admin/colleges` | Manage colleges |
| `/admin/courses` | Manage courses |
| `/admin/leads` | Student leads |
| `/admin/settings` | Basic settings |

---

## 🔑 Admin Credentials (after seeding)
- **Email:** admin@yourcollege.com
- **Password:** admin123

> **Important:** Change the admin password in production!

---

## 📁 Project Structure

```
your-college/
├── backend/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── seed.js        # Database seeder
│   ├── controllers/       # Route handlers
│   ├── middleware/
│   │   └── auth.js        # JWT authentication
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   ├── .env.example       # Environment variables template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── admin/         # Admin panel pages
    │   ├── components/    # Reusable components
    │   ├── context/       # Auth context
    │   ├── pages/         # Public pages
    │   ├── services/      # API service layer
    │   ├── App.jsx        # Routes
    │   └── main.jsx       # Entry point
    ├── index.html
    └── package.json
```

---

## 🔒 Security
- Passwords hashed with bcrypt
- JWT tokens for admin authentication
- Protected API routes (admin-only operations)
- CORS configured
- Environment variables for secrets

---

## 📦 Deploying to Production

### Backend (Render, Railway, etc.)
1. Set environment variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`
2. Run: `npm start`

### Frontend (Vercel, Netlify, etc.)
1. Set `VITE_API_URL` to your backend URL
2. Run: `npm run build`
3. Deploy the `dist/` folder

### MongoDB
Use [MongoDB Atlas](https://www.mongodb.com/atlas) for free cloud hosting.
