# Logout Functionality Test

## Test Steps

1. **Navigate to Settings Page**
   - Go to `/settings`
   - Verify you're logged in (user info should be displayed)

2. **Test Logout Button**
   - Click the "Logout" button
   - Check browser console for logs:
     - "Logout button clicked"
     - "Calling logout mutation..."
     - "Logout mutationFn called"
     - "Logout mutationFn completed"
     - "Logout onSuccess called"
     - "Navigating to login..."
   - Verify:
     - Success toast appears: "Logged out successfully"
     - Redirects to `/login` page
     - Token is removed from localStorage
     - User state is cleared

3. **Test Clear Cache Button**
   - Go back to `/settings` (if still logged in)
   - Click "Clear Cache & Logout"
   - Confirm the dialog
   - Verify:
     - All localStorage is cleared
     - Redirects to `/login` page

4. **Verify Logout Completeness**
   - After logout, try accessing `/dashboard`
   - Should redirect to `/login` (ProtectedRoute should block)
   - Check localStorage: `localStorage.getItem("token")` should return `null`
   - Check auth store: user should be `null`

## Expected Behavior

✅ **Logout Button:**
- Clears token from localStorage
- Removes Authorization header
- Clears auth store (user = null)
- Clears React Query cache
- Shows success toast
- Redirects to `/login`

✅ **Clear Cache Button:**
- Shows confirmation dialog
- Clears all localStorage
- Redirects to `/login`

✅ **After Logout:**
- Cannot access protected routes
- Token is removed
- User state is cleared
- All cached data is cleared

## Debugging

If logout doesn't work, check:
1. Browser console for error messages
2. Network tab for any failed requests
3. localStorage to verify token removal
4. React DevTools to check auth store state

