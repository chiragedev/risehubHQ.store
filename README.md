# 🛒 RiseHub

**Live → [risehubhq.store](https://risehubhq.store)**

RiseHub is a full-stack e-commerce platform with a secured admin panel, multi-language support, and a self-hosted backend.

Built mainly to answer one question:

> *How do you build a small e-commerce site without doing the usual insecure stuff most stores do?*

Stack is simple: React, Tailwind, PocketBase, Vite. No heavy frameworks, no bloated backend.

&nbsp;

## ⚡ Core Features

**Storefront**

- Product catalog with category filtering and search
- Discount pricing system (`isDiscounted`, `originalPrice`, `discountedPrice`)
- Featured products
- Newsletter subscriptions with duplicate detection to avoid spam entries

**Admin Dashboard**

The admin panel allows full control over the store.

| Panel | What you can do |
|---|---|
| Products | Create, edit, delete, toggle featured, live search, optimistic UI updates |
| Messages | View and manage contact form submissions |
| Subscribers | Newsletter management |
| Testimonials | Full CRUD with star rating system |

&nbsp;

## 🌍 Internationalization

The store supports Arabic, French, and English - implemented with `react-i18next`.

- Dynamic language switching
- RTL layout support for Arabic
- Direction updates on language change
- Locale files: `ar.json`, `fr.json`, `en.json`

&nbsp;

## 🔐 Security Design

Security was treated as a first-class feature, not an afterthought.

**Admin Route Protection**

Admin routes are wrapped with `ProtectedAdminRoute.jsx`. Unauthorized users get redirected before any admin component even loads - no UI exposure, no data leakage.

**Credential Management**

Admin credentials are never hardcoded. They are stored as environment variables, encrypted, and resolved at runtime via `$os.getenv()`.

```
PB_ENCRYPTION_KEY
PB_SUPERUSER_EMAIL
PB_SUPERUSER_PASSWORD
```

**Rate Limiting**

Configured directly in PocketBase migrations to mitigate brute force attempts, prevent login abuse, and reduce automated scraping.

**Backend Access Control**

PocketBase collection rules enforce server-side authorization. Client-side checks alone are never trusted 
- access rules live at the database layer.

&nbsp;

## 🧠 Threat Model (Simplified)

| Attacker Goal | Mitigation |
|---|---|
| Access admin dashboard | Route protection + auth |
| Brute force login | Rate limiting |
| Credential leaks | Env variables only |
| Client-side bypass | Backend access rules |
| Spam newsletter | Duplicate detection |

&nbsp;

## 🧱 Project Structure

```
apps/
├── pocketbase/
│   ├── pb_hooks/        # server hooks - auth, mailer, security logic
│   ├── pb_migrations/   # schema, rate limiting rules (no hardcoded secrets)
│   └── pb_data/         # runtime data, excluded from repo
│
└── web/src/
    ├── components/
    │   ├── admin/       # dashboard panels
    │   └── ui/          # reusable UI components
    ├── contexts/        # AuthContext, ThemeContext
    ├── lib/             # PocketBase client, i18n config
    ├── locales/         # ar.json, fr.json, en.json
    └── pages/           # Home, Shop, Product, Contact, AdminDashboard
```

&nbsp;

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| UI | shadcn/ui, Framer Motion |
| Backend | PocketBase (self-hosted) |
| i18n | react-i18next |
| Routing | React Router v6 |
| Icons | Lucide React |

&nbsp;

## 🚀 Running Locally

```bash
git clone https://github.com/chiragedev/risehubHQ.store.git
cd risehubHQ.store
npm install

# Frontend
cd apps/web
npm run dev

# Backend (separate terminal)
cd apps/pocketbase
./pocketbase serve
```

Configure your environment variables before running.

&nbsp;

A few Screenshots: <img width="1414" height="711" alt="image" src="https://github.com/user-attachments/assets/003502ef-39f3-4a8b-89a9-1ebded6a7329" />

<img width="1663" height="926" alt="image" src="https://github.com/user-attachments/assets/61ca567a-b8b6-47a9-bc2f-4f77e332da7f" />
<img width="1641" height="930" alt="image" src="https://github.com/user-attachments/assets/211e67b7-13df-4cf7-a595-3e6660d00432" />



you can always visit the website yourself at https://risehubhq.store !


## 🧑‍💻 Author

**Abderrahman Chirage**
Cybersecurity Engineering Student - ENSA Agadir 🇲🇦
CTF Player · Security Enthusiast · Builder of random internet things

[![GitHub](https://img.shields.io/badge/GitHub-chiragedev-181717?style=flat-square&logo=github)](https://github.com/chiragedev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Abderrahman_Chirage-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/abderrahman-chirage)
[![Live](https://img.shields.io/badge/Live-risehubhq.store-00C851?style=flat-square&logo=vercel)](https://risehubhq.store)
