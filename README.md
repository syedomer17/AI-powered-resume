# 🧠 AI Resume App

An intelligent and beautiful resume builder powered by AI, built with the latest tech stack — **Next.js 15**, **TypeScript**, **TailwindCSS**, **shadcn/ui**, and **Auth.js** for seamless OAuth login.

## ✨ Features

### 🔐 Authentication
- OAuth login with **Google** and **GitHub**
- OTP-based **email verification** (6-digit)
- **Signup**, **Login**, **Forgot Password**, and **Secure Session Handling**

### 📄 Resume Builder
- Start building by clicking the **"Create Resume"** button
- Add all essential details:
  - 🧑‍💼 Job Title & Personal Info
  - 💼 Work Experience
  - 🧠 Professional Summary
  - 🚀 Projects
  - 🎓 Education
  - 🛠️ Skills
- Edit resume sections anytime
- See **live preview** updates as you type

### 📤 Resume Actions
- 👁️ View complete resume before finalizing
- 📤 **Share resume** via public link
- 📥 **Download as PDF** with one click

### 🖥️ Dashboard & UI
- 🏠 Beautiful, responsive **Home Page**
- 📂 After login, users are redirected to a **Dashboard**:
  - View all saved resumes
  - "Create Resume" button for new resumes
  - Sign Out option
  - User Avatar with dropdown to see **email** and **sign out**

 ### 🧑‍🎨 UI/UX Enhancements
- ✨ Smooth animations using **Framer Motion** and **GSAP**
- ⚡ Real-time feedback and previewing experience

---

## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| ![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white) | App framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) | Type safety |
| ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwind-css&logoColor=white) | Styling |
| `shadcn/ui` | Reusable UI components |
| ![Auth.js](https://img.shields.io/badge/Auth.js-000000?logo=next-auth&logoColor=white) | Authentication (Google & GitHub OAuth) |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) | Database to store resumes and user data |
| ![Framer Motion](https://img.shields.io/badge/Framer--Motion-EF007E?logo=framer&logoColor=white) | Page transitions and component animations |
| ![GSAP](https://img.shields.io/badge/GSAP-88CE02?logo=greensock&logoColor=black) | Advanced timeline-based animations |

---

## 📦 Installation

```bash
git clone https://github.com/syedomer17/AI-powered-resume.git
cd AI-powered-resume
cd resume-app
````

## Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```ini
MONGODB_URI=

EMAIL_USER=
EMAIL_PASS=

NEXTAUTH_SECRET=
RESET_SECRET=

NEXTAUTH_URL=http://localhost:3000

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GOOGLE_GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

✅ **Note:** Never commit `.env` files to public repositories.

---

## 🙌 Contributions

PRs and suggestions are welcome! Open an issue to discuss changes.

---

## 📄 License

MIT License © [Your Name](https://github.com/syedomer17)