# Learning Management System (LMS)

A full-stack, production-ready Learning Management System with responsive UI, secure authentication, course management, and Stripe-based payments.

---

## 🚀 Features

### 1. Fully Responsive UI  
- Mobile-first and desktop-friendly design  
- Built using modern React / Next.js components  
- Smooth UX with reusable UI components and form validations  

<img width="1896" height="903" alt="01-course" src="https://github.com/user-attachments/assets/e80208ae-3ed7-4ae4-a9f5-92674eca4975" />


---

### 2. Authentication (Better Auth)  
- OTP-based login using **Resend**  
- Social login via **GitHub OAuth**  
- Custom domain email delivery using **Hostinger**  
- Secure session handling and role-based access  

Login methods:  
- Email + OTP  
- GitHub Social Login  

<img width="1903" height="890" alt="02-course" src="https://github.com/user-attachments/assets/b0c26ba6-a11f-4583-ad51-c05853df82bc" />


---

### 3. Course Management  
- Create, edit, and delete courses  
- Form handling with **React Hook Form**  
- Server-side validation and error handling  
- Rich UI for instructors to manage content  

Features:  
- Add new course  
- Edit existing course  
- Delete course  
- View enrolled users  

<img width="1897" height="915" alt="-4-course" src="https://github.com/user-attachments/assets/1fcb3341-3751-469a-b9a0-f6aa5ceb8dfc" />


---

### 4. Payments (Stripe Integration)  
- Secure checkout using **Stripe**  
- Payment intent & webhook handling  
- Course purchase and enrollment flow  
- Real-time payment confirmation  

<img width="1891" height="911" alt="7 course" src="https://github.com/user-attachments/assets/ad050328-8579-4268-aa14-2f53ae09493e" />
<img width="647" height="911" alt="8 course" src="https://github.com/user-attachments/assets/792ffbad-aec8-4033-b18a-b109e2f2e246" />


---

## 🛠 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui
- React Hook Form

**Backend**
- Node.js
- Better Auth
- Stripe API
- Resend (Email OTP)
- PostgreSQL(based on your setup)

**Auth & Infra**
- GitHub OAuth
- Custom domain email via Hostinger
- JWT / Session-based auth

---

## 🔐 Authentication Flow

1. User enters email  
2. OTP sent via Resend (Hostinger domain)  
3. OTP verification  
4. Session created using Better Auth  
5. Optional login via GitHub OAuth  

---

## 💳 Payment Flow

1. User selects a course  
2. Redirected to Stripe Checkout  
3. Payment confirmation via webhook  
4. User enrolled in course  
5. Access granted to course content  

---

## 📂 Project Structure (High Level)

