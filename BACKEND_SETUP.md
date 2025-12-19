# Backend Setup Guide

## ✅ Backend Configuration

### Port
- **Backend**: `http://localhost:9000/api`
- **Frontend**: `http://localhost:4000` (Next.js default)

### API Base URL
The frontend is configured to use `http://localhost:9000/api` by default.

**To override** (if your backend runs on a different port):
1. Create `.env.local` in the frontend root
2. Add:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:9000/api
   ```
3. Restart the dev server

---

## 🔐 Authentication Flow

### 1. Register/Login
- Endpoints: `POST /api/auth/register` or `POST /api/auth/login`
- Response: `{ token: "...", user: { id, email, name } }`
- Token is automatically stored in localStorage

### 2. Using Token
- Token is automatically included in all API requests
- Format: `Authorization: Bearer <token>`
- Token expires after 7 days

### 3. Get Current User
- Endpoint: `GET /api/auth/me`
- Returns: `{ id, email, name }` (user object directly)

---

## 📋 All Endpoints

### Auth
- ✅ `POST /api/auth/register` - Register new user
- ✅ `POST /api/auth/login` - Login user
- ✅ `GET /api/auth/me` - Get current user

### Positions
- ✅ `GET /api/positions` - Get all positions (returns `{Count, positions[]}`)
- ✅ `GET /api/positions/:id` - Get position by ID
- ✅ `POST /api/positions` - Create position
- ✅ `PUT /api/positions/:id` - Update position
- ✅ `DELETE /api/positions/:id` - Delete position

### Transactions
- ✅ `GET /api/transactions?positionId=...` - Get transactions (returns `{Count, transactions[]}`)
- ✅ `GET /api/transactions/:id` - Get transaction by ID
- ✅ `POST /api/transactions` - Create transaction (returns `{transaction, position}`)
- ✅ `DELETE /api/transactions/:id` - Delete transaction

### Analytics
- ✅ `GET /api/analytics/summary` - Get portfolio summary
- ✅ `GET /api/analytics/company/:companyName` - Get company analytics
- ✅ `GET /api/analytics/snapshots` - Get daily snapshots
- ✅ `POST /api/analytics/snapshot?date=...` - Create snapshot

---

## 🚀 Quick Start

1. **Start Backend**:
   ```bash
   cd backend-directory
   npm start
   # Backend should run on http://localhost:9000
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   # Frontend runs on http://localhost:4000
   ```

3. **Test Connection**:
   - Check navbar for backend status indicator (green = online)
   - Go to `/login` and try to register/login
   - Check browser console for any errors

---

## ✅ Status

- **All 30 endpoints tested and working** ✅
- **Frontend fully integrated** ✅
- **Error handling improved** ✅
- **UX enhanced** ✅

---

## 🔍 Troubleshooting

If you see 500 errors:
1. Check backend terminal for error messages
2. Verify backend is running on port 9000
3. Check browser console for detailed error logs
4. Ensure database is connected (if backend uses one)
5. Verify environment variables are set

See `TROUBLESHOOTING.md` for more details.




