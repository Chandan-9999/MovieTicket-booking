# 🎬 QuickShow

**QuickShow** is a comprehensive, full-stack movie ticket booking application built using the MERN (MongoDB, Express, React, Node.js) stack. It provides a seamless and interactive experience for users to browse movies, select seats, and book tickets securely with integrated payment getaways and background email notifications. It also features a dedicated admin panel for managing movies, shows, and theater bookings.

---

## ✨ Key Features

- **User Authentication:** Secure and seamless user signup, login, and profile management powered by **Clerk**.
- **Interactive Seat Selection:** A dynamic UI allows users to view available, booked, and blocked seats for specific showtimes and logically select their preferred seats.
- **Secure Payments:** Integrated **Stripe** checkout for real-time ticket payments.
- **Automated Email Notifications:** Uses **Nodemailer** and **Inngest** for background jobs to send email confirmations for bookings, show reminders, and new movie notifications.
- **Automated Seat Release:** Background jobs automatically cancel unpaid bookings and release seats if payment isn't completed within 10 minutes. 
- **Admin Dashboard:** A protected admin portal to add new shows, list all available movies/shows, and view current bookings.
- **Media Storage:** Uses **Cloudinary** for scalable and efficient movie poster and image hosting.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM
- **Authentication:** @clerk/clerk-react
- **HTTP Client:** Axios
- **Icons & UI:** Lucide React, react-hot-toast

### Backend
- **Environment:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** @clerk/express + Svix (for webhooks)
- **Payments:** Stripe
- **Background Jobs / Queues:** Inngest
- **Email Service:** Nodemailer
- **File Uploads:** Cloudinary

---

## ⚙️ Local Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine. You will also need accounts for MongoDB, Clerk, Stripe, Cloudinary, and Inngest.

### 1. Clone the repository
```bash
git clone https://github.com/anvesh2257/QuickShow.git
cd QuickShow
```

### 2. Install Dependencies

**For the Client:**
```bash
cd client
npm install
```

**For the Server:**
```bash
cd ../server
npm install
```

### 3. Environment Variables
You will need to create a `.env` file in both the `client` and `server` directories.

**client/.env**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000 # Or your backend URL
```

**server/.env**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret (from svix)

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### 4. Running the Project

**Run the Backend (Server):**
Open a terminal and navigate to the `server` directory:
```bash
cd server
npm run server
```

**Run the Frontend (Client):**
Open a new terminal and navigate to the `client` directory:
```bash
cd client
npm run dev
```

### 5. Running Inngest Locally
To run Inngest background jobs (like emails and automated seat release) locally during development:
```bash
npx inngest-cli@latest dev
```

Your app will now be running at `http://localhost:5173`! 🍿

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is licensed under the ISC License.
