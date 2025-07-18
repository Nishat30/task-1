# 🏆 Leaderboard Application

A full-stack web application designed to track user points and display a dynamic leaderboard. Users can be added, and points can be awarded, with an integrated avatar upload feature and a cool-down period for point claims.

---

## ✨ Features

### 👥 User Management:
- Add new users with a unique name.
- Upload custom avatar images.
- View all registered users.

### 🏅 Points System:
- Award random points to users.
- Cool-down mechanism to prevent frequent point claims.

### 📊 Dynamic Leaderboard:
- Real-time ranking based on total points.
- Visually highlights the top 3 users.

### 🕓 Claim History:
- Displays point claim history per user.

### 📱 Responsive Design:
- Works across mobile, tablet, and desktop.

### 💬 User-Friendly Modals:
- Smooth modals for adding users and giving points.

---

## 🚀 Live Demo

Experience the application live:  
[Your Live Frontend Vercel App URL Here]  
*(Example: https://task-1-inky-one.vercel.app)*

---

## 🛠️ Technologies Used

### Frontend
- **React.js** – Building the interactive UI
- **Axios** – HTTP client for API calls
- **CSS** – Styling and responsive design

### Backend
- **Node.js** – JavaScript runtime
- **Express.js** – RESTful API framework
- **Mongoose** – ODM for MongoDB
- **Multer** – Handles file uploads
- **Cloudinary** – Stores and delivers user avatars

### Database
- **MongoDB** – Flexible NoSQL database

### Deployment
- **Vercel** – For both frontend and backend deployment (as serverless functions)

---

## 💻 Getting Started (Local Setup)

### Prerequisites
- Node.js (v14 or higher)
- npm or Yarn
- MongoDB Atlas Account (or local MongoDB)
- Cloudinary Account

---

### 1. Backend Setup

Clone the repository:

```bash
git clone [Your GitHub Public Repo Link Here]
cd backend
```
Install dependencies:

```bash
npm install
```
Create a .env file in the backend directory and add:

```bash
MONGODB_URI=your_mongodb_atlas_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
NODE_ENV=development
```

Run the backend:

```bash
node run dev
Backend runs at: http://localhost:5000
```

2. Frontend Setup
Navigate to frontend:

```bash
cd frontend
```
Install dependencies:

```bash
npm install
```
Create a .env file in the frontend directory and add:

```bssh
NODE_ENV=development
```
Run the frontend:

```bash
node run dev
Backend runs at: http://localhost:5000
```
## ☁️ Deployment (Vercel)

### 🔧 Backend (Vercel):
- Connect your **backend repository** to Vercel.
- Add the following environment variables in Vercel’s project settings:
  - `MONGODB_URI`
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `NODE_ENV`
- Whitelist Vercel's IP addresses in your **MongoDB Atlas** Network Access settings.

### 🖥️ Frontend (Vercel):
- Connect your **frontend repository** to Vercel.
- Set the environment variable:
  -`NODE_END`

## 💡 Future Enhancements

- ✅ **Implement user authentication using JWT**  
  Secure API routes and enable user-specific actions and sessions.

- ✅ **Add an Admin Panel**  
  Admin interface for managing users, points, and application settings.

- ✅ **Enable real-time leaderboard updates**  
  Use **WebSockets** (e.g., **Socket.IO**) for live score updates without refreshing.

- ✅ **Design a complex point system**  
  Introduce daily challenges, point decay, or achievements to enhance engagement.

- ✅ **Develop detailed user profiles**  
  Add customization options and profile pages for each user.

- ✅ **Integrate unit and integration tests**  
  Improve app reliability and code quality with thorough test coverage.

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to:

1. **Fork** the repository  
2. **Create** a new feature branch  
3. **Commit** your changes  
4. **Open** a pull request

We appreciate all efforts to make this project better 💖

---



