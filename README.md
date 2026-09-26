# eduvault

A cross-platform school learning resource platform that provides students with free and organized access to notes, past papers, model papers, revision papers, and other educational resources through web and mobile applications.

## Deployment

EduVault is deployed as separate frontend and backend services.

### Backend

Deploy the `backend` directory as a long-running Node.js service:

```text
Install: npm install
Migrate: npm run migrate
Start: npm start
Health check: /health
```

Copy `backend/.env.example` to the hosting provider's environment settings. Set a strong `JWT_SECRET`, the production `DATABASE_URL`, Cloudinary credentials, SMTP credentials, and the deployed frontend URL in `FRONTEND_URL`. Cloudinary should be used for persistent material uploads; local `uploads` storage is not durable on most hosting platforms.

### Frontend

Deploy the `frontend` directory as a Vite site:

```text
Build: npm run build
Output: dist
```

Set `VITE_API_URL` to the deployed backend API base URL, for example `https://api.example.com/api`. The included `frontend/vercel.json` keeps React `BrowserRouter` routes working after a direct refresh.

### Production checks

- Rotate any credentials that have been used locally and never commit `.env` files.
- Replace default seeded admin credentials before launch.
- Test registration, email verification, login, role permissions, material upload, and direct refresh of nested frontend routes.
