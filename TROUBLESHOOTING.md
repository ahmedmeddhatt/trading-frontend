# Troubleshooting Guide

## Backend Connection Issues

### 500 Internal Server Error

If you're seeing 500 errors when trying to login or access the API:

#### 1. Check if Backend is Running

The frontend expects the backend to be running on `http://localhost:9000/api`.

**To verify:**
```bash
# Check if backend is running
curl http://localhost:9000/api/auth/me
# or open in browser: http://localhost:9000/api/auth/me
```

**If backend is not running:**
- Navigate to your backend directory
- Start the backend server (usually `npm start` or `npm run dev`)
- Ensure it's running on port 9000

#### 2. Check Backend Logs

Look at your backend terminal/console for error messages. Common issues:
- Database connection errors
- Missing environment variables
- Port already in use
- Missing dependencies

#### 3. Verify API Base URL

The frontend uses `http://localhost:9000/api` by default.

**To change it:**
1. Create `.env.local` file in the frontend root
2. Add:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:9000/api
   ```
3. Restart the Next.js dev server

#### 4. Check CORS Configuration

The backend must allow requests from `http://localhost:4000` (or your frontend URL).

**Backend CORS should include:**
```javascript
origin: 'http://localhost:4000' // Frontend runs on 4000, backend on 9000
```

#### 5. Network Connection Issues

If you see "Cannot connect to backend server":
- Ensure backend is running
- Check firewall settings
- Verify port 9000 is not blocked
- Try accessing backend directly in browser

---

## Common Error Messages

### "Cannot connect to backend server"
- **Cause**: Backend is not running or unreachable
- **Solution**: Start the backend server on port 9000

### "500 Internal Server Error"
- **Cause**: Backend server error
- **Solution**: Check backend logs for specific error

### "401 Unauthorized"
- **Cause**: Invalid or expired token
- **Solution**: Log in again to get a new token

### "404 Not Found"
- **Cause**: API endpoint doesn't exist
- **Solution**: Verify the endpoint URL matches backend routes

---

## Backend Status Indicator

The navbar now shows a backend status indicator:
- 🟢 **Green dot**: Backend is online and responding
- 🔴 **Red dot**: Backend is offline or unreachable
- 🟡 **Yellow dot**: Checking connection status

---

## Testing Backend Connection

### Manual Test

1. Open browser console
2. Run:
   ```javascript
   fetch('http://localhost:9000/api/auth/me')
     .then(r => console.log('Status:', r.status))
     .catch(e => console.error('Error:', e))
   ```

### Using cURL

```bash
# Test if backend is running
curl http://localhost:9000/api/auth/me

# Test login endpoint
curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## Frontend Logs

Check the browser console for detailed logs:
- API calls are logged with full URLs
- Errors include response data
- Network errors are clearly marked

You can also view logs at `/logs` page in the app.

---

## Quick Fixes

1. **Restart Backend**: Stop and restart your backend server
2. **Restart Frontend**: Stop and restart `npm run dev`
3. **Clear Browser Cache**: Hard refresh (Ctrl+Shift+R)
4. **Check Environment Variables**: Verify API URL is correct
5. **Check Port Conflicts**: Ensure port 9000 is available for backend

---

## Still Having Issues?

1. Check backend terminal for error messages
2. Check browser console for detailed error logs
3. Verify backend is accessible at `http://localhost:9000`
4. Check backend CORS configuration (should allow frontend on port 4000)
5. Review backend API documentation for endpoint requirements

