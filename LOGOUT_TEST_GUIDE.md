# Logout Functionality Test Guide

## 🧪 How to Test Logout

### Step 1: Open Settings Page
1. Navigate to `/settings` in your browser
2. Open browser DevTools (F12)
3. Go to the Console tab

### Step 2: Verify Initial State
Before clicking logout, check:
```javascript
// In browser console:
localStorage.getItem("token")  // Should return a token string
window.location.pathname        // Should be "/settings"
```

### Step 3: Click Logout Button
1. Click the red "Logout" button
2. Watch the console for these logs (in order):

**Expected Console Logs:**
```
🔴 [LOGOUT] Button clicked - handler called
🔴 [LOGOUT] Event: MouseEvent {...}
🔴 [LOGOUT] Mutation state: { isPending: false, ... }
🔄 [LOGOUT] Calling logout mutation...
🔄 [LOGOUT MUTATION] mutationFn called
🔄 [LOGOUT MUTATION] Token before: EXISTS
🔄 [LOGOUT MUTATION] Token removed, headers cleared
🔄 [LOGOUT MUTATION] Auth store cleared
🔄 [LOGOUT MUTATION] Query cache cleared
🔄 [LOGOUT MUTATION] Token after: REMOVED ✅
✅ [LOGOUT MUTATION] mutationFn completed
✅ [LOGOUT MUTATION] onSuccess called
🔄 [LOGOUT MUTATION] All queries removed
🔄 [LOGOUT MUTATION] Navigating to /login via router...
🔄 [LOGOUT MUTATION] Checking navigation... Current path: /login
✅ [LOGOUT MUTATION] Successfully navigated to /login
```

### Step 4: Verify Logout Success
After clicking logout, verify:

1. **Token Removed:**
   ```javascript
   localStorage.getItem("token")  // Should return null
   ```

2. **Redirected to Login:**
   ```javascript
   window.location.pathname  // Should be "/login"
   ```

3. **Success Toast:**
   - Should see a green toast notification: "Logged out successfully"

4. **Cannot Access Protected Routes:**
   - Try navigating to `/dashboard` or `/positions`
   - Should automatically redirect to `/login`

### Step 5: Test Protected Route Redirect
1. After logout, try to access `/dashboard` directly
2. Should be redirected to `/login` automatically
3. Check console for ProtectedRoute logs

## 🔍 Troubleshooting

### If Logout Button Doesn't Work:
1. Check console for errors
2. Verify button is not disabled: `document.querySelector('button[type="button"]').disabled`
3. Check if event is firing: Add `console.log` in button onClick

### If Token Not Removed:
1. Check console for "Token after: STILL EXISTS ❌"
2. Manually clear: `localStorage.removeItem("token")`
3. Refresh page

### If Not Redirecting:
1. Check console for navigation logs
2. Manually navigate: `window.location.href = "/login"`
3. Check if router is working: `router.push("/login")`

### If Still Logged In After Logout:
1. Clear all storage: `localStorage.clear()`
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Check ProtectedRoute component

## ✅ Success Criteria

Logout is working correctly if:
- ✅ Token is removed from localStorage
- ✅ User is redirected to `/login`
- ✅ Success toast appears
- ✅ Cannot access protected routes without logging in again
- ✅ All console logs appear in correct order
- ✅ No errors in console

## 🐛 Known Issues

None currently. If you find any, check:
1. Browser console for errors
2. Network tab for failed requests
3. React DevTools for component state

