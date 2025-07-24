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
| ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-%23000000?style=for-the-badge&logo=none&logoColor=white) | Reusable UI components |
| ![Auth.js](https://img.shields.io/badge/Auth.js-000000?logo=next-auth&logoColor=white) | Authentication (Google & GitHub OAuth) |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) | Database to store resumes and user data |
| ![Framer Motion](https://img.shields.io/badge/Framer--Motion-EF007E?logo=framer&logoColor=white) | Page transitions and component animations |
| ![GSAP](https://img.shields.io/badge/GSAP-88CE02?logo=greensock&logoColor=black) | Advanced timeline-based animations |

---

## 🧪 Project Structure

```
├── app/
│   ├── api
│   ├── auth
│   │   └── [...nextauth]
│   │       └── route.ts
│   ├── forgot-password
│   │   ├── request-otp
│   │   │   └── route.ts
│   │   ├── reset
│   │   │   └── route.ts
│   │   └── verify-otp
│   │       └── route.ts
│   ├── generate-pdf
│   │   └── route.ts
│   ├── generate-resume
│   │   └── route.ts
│   ├── profile
│   │   └── route.ts
│   ├── register
│   │   └── route.ts
│   ├── request-reset
│   │   └── route.ts
│   ├── resend-otp
│   │   └── route.ts
│   ├── resume
│   │   └── route.ts
│   ├── resumes
│   │   ├── [resumeId]
│   │   │   └── route.ts
│   │   └── route.ts
│   ├── summaries
│   │   └── route.ts
│   ├── user
│   │   ├── [userId]
│   │   │   ├── resume
│   │   │   │   └── [resumeId]
│   │   │   │       └── route.ts
│   │   │   └── route.ts
│   │   ├── avatar
│   │   │   └── route.ts
│   │   ├── education
│   │   │   └── route.ts
│   │   ├── experience
│   │   │   └── route.ts
│   │   ├── personal
│   │   │   └── route.ts
│   │   ├── projects
│   │   │   └── route.ts
│   │   ├── skills
│   │   │   └── route.ts
│   │   └── summery
│   │       └── route.ts
│   └── verify-otp
│       └── route.ts
├── dashboard
│   ├── page.tsx
│   └── resume
│       └── [userId]
│           ├── [resumeIndex]
│           │   ├── edit
│           │   │   └── page.tsx
│           │   └── view
│           │       └── page.tsx
│           └── page.tsx
├── favicon.ico
├── forgot-password
│   ├── request
│   │   └── page.tsx
│   ├── reset
│   │   └── page.tsx
│   └── verify
│       └── page.tsx
├── globals.css
├── layout.tsx
├── login
│   └── page.tsx
├── page.tsx
├── providers.tsx
├── signup
│   └── page.tsx
└── verify-email
    └── page.tsx
├── components/
│   ├── RichTextEditor.tsx
├── custom
│   ├── AddResume.tsx
│   ├── ClientResumeWrapper.tsx
│   ├── CreateResume.tsx
│   ├── FormSection.tsx
│   ├── Header.tsx
│   ├── ResumeGrid.tsx
│   ├── ResumePriview.tsx
│   ├── SignOutButton.tsx
│   ├── ThemeColor.tsx
│   ├── UserMenu.tsx
│   ├── forms
│   │   ├── Education.tsx
│   │   ├── Experience.tsx
│   │   ├── PersonalDetail.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── Summery.tsx
│   └── resume-item
│       └── ResumeCardItem.tsx
├── priview
│   ├── EducationalPriview.tsx
│   ├── ExperiencePriview.tsx
│   ├── PersonalDetailPriview.tsx
│   ├── ProjectPreview.tsx
│   ├── SkillsPriview.tsx
│   └── Summery.tsx
└── ui
    ├── alert-dialog.tsx
    ├── avatar.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── combobox.tsx
    ├── command.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── input.tsx
    ├── popover.tsx
    ├── select.tsx
    ├── sonner.tsx
    └── textarea.tsx
├── context/
│   └── ResumeInfoConext.tsx
├── lib/
│   └── cloudinary.ts
|   ├── mongodb.ts
|   ├── resume.ts
|   ├── sendEmail.ts
|   └── utils.ts
├── models
|   └── User.ts
```

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

## 🧑‍💻 Author

**Syed Omer Ali**
🌐 [Portfolio](https://next-js-portfolio-gsb1-cs5pebze5-syedomer17s-projects.vercel.app/)
🐱 [GitHub](https://github.com/syedomer17)
📫 [LinkedIn](https://www.linkedin.com/in/syedomerali)

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE).
