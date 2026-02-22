# Auth0 Authorization Setup - Ready for Your Credentials

## 📋 Dummy Credentials Added

Your app is now configured with **placeholder values**. Just replace them with your actual Auth0 credentials.

---

## 🔧 Where to Add Your Auth0 Credentials

### Backend: [backend/.env](backend/.env)
```env
AUTH0_DOMAIN=your-domain.us.auth0.com          # ← Replace with your Auth0 domain
AUTH0_CLIENT_ID=your_client_id_here             # ← Replace with Backend Client ID
AUTH0_CLIENT_SECRET=your_client_secret_here     # ← Replace with Backend Client Secret
AUTH0_AUDIENCE=your_api_identifier_here         # ← Your API audience identifier
```

### Frontend: [frontend/.env](frontend/.env)
```env
VITE_AUTH0_DOMAIN=your-domain.us.auth0.com      # ← Same as backend
VITE_AUTH0_CLIENT_ID=your_client_id_here        # ← Replace with Frontend Client ID (different from backend)
VITE_AUTH0_REDIRECT_URI=http://localhost:5173   # ← Callback URL (keep as is for dev)
```

---

## 🚀 Getting Your Auth0 Credentials

1. **Create Auth0 Account** (if you don't have one)
   - Go to [auth0.com](https://auth0.com)
   - Sign up for free

2. **Create Backend Application**
   - Go to Dashboard → Applications → Applications
   - Click "Create Application"
   - Choose "Regular Web Application"
   - Name: `Notes App Backend`
   - Get: **Client ID** and **Client Secret** → Add to `backend/.env`

3. **Create Frontend Application**
   - Create another application
   - Choose "Single Page Application"
   - Name: `Notes App Frontend`
   - Get: **Client ID** → Add to `frontend/.env`
   - Set Allowed Callback URLs: `http://localhost:5173`

4. **Create API**
   - Go to Dashboard → Applications → APIs
   - Click "Create API"
   - Name: `Notes API`
   - Identifier: `notes-api` (or your choice)
   - Copy the Identifier → Add to `backend/.env` as `AUTH0_AUDIENCE`

---

## 📁 Files Already Updated

### Backend Changes:
- ✅ [backend/.env](backend/.env) - Auth0 config (with dummy values)
- ✅ [backend/src/middleware/authenticate.js](backend/src/middleware/authenticate.js) - Uses Auth0 token verification
- ✅ [backend/package.json](backend/package.json) - Added axios dependency

### Frontend Changes:
- ✅ [frontend/.env](frontend/.env) - Auth0 config (with dummy values)
- ✅ [frontend/src/main.jsx](frontend/src/main.jsx) - Auth0Provider wrapper (already set up)
- ✅ [frontend/src/pages/Login.jsx](frontend/src/pages/Login.jsx) - Uses Auth0 login

---

## 🔄 How It Works (with Auth0)

```
Frontend Login Page
         ↓
User clicks "Login" → loginWithRedirect()
         ↓
Redirects to Auth0 login page
         ↓
User enters credentials (Auth0 handles it)
         ↓
Auth0 verifies and redirects back to app
         ↓
Frontend gets Auth0 token in localStorage
         ↓
Axios interceptor sends: Authorization: Bearer <Auth0_token>
         ↓
Backend receives token
         ↓
Backend calls Auth0 API to verify token
         ↓
If valid: Access granted
If invalid: 403 Forbidden
```

---

## 🧪 Testing After Adding Credentials

### 1. Start both apps:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Open `http://localhost:5173`
- Click "Login"
- You'll be redirected to Auth0 login page
- Enter your Auth0 account credentials

### 3. After login:
- You'll return to the app
- Auth0 token is stored
- All API calls to `/api/notes` now include the token
- Backend verifies with Auth0

---

## ⚠️ Common Issues

**"CORS error" or "401 Unauthorized"?**
- Make sure you added correct Auth0 credentials to both `.env` files
- Restart both backend and frontend after changing `.env`

**"Cannot POST /api/auth/login"?**
- That's expected! Old custom JWT routes are gone
- Auth0 handles login now - just use the frontend login button

**"Invalid token" on API calls?**
- Token might be expired
- Logout and login again from frontend
- Auth0 manages token refresh automatically

---

## 📌 Next Steps

1. ✅ Create Auth0 account (free tier available)
2. ✅ Create Backend + Frontend applications
3. ✅ Create an API in Auth0
4. ✅ Copy credentials to `.env` files
5. ✅ Restart backend and frontend
6. ✅ Test login flow
7. ⏳ (Optional) Add database user sync with Auth0

---

**Ready when you have your Auth0 credentials! 🎉**
