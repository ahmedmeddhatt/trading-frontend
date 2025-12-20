# Complete Testing Guide - Stock Portfolio Tracker

## Prerequisites

1. **Backend Server**: Ensure your backend is running on `http://localhost:9000/api` (or configured URL)
2. **Frontend Server**: Run `npm run dev` (defaults to `http://localhost:4000`)
3. **Browser**: Use Chrome, Firefox, or Edge (latest versions)
4. **Clear Browser Cache**: For clean testing, clear cache or use incognito mode

---

## 🧪 Complete Testing Flow

### Phase 1: Authentication & Account Setup

#### 1.1 User Registration
**Flow:**
1. Navigate to `http://localhost:4000` (should redirect to `/login`)
2. Click "Switch to Register" or toggle to registration mode
3. Fill in the form:
   - **Name**: `Test User`
   - **Email**: `test@example.com` (use a unique email)
   - **Password**: `Test123!@#` (minimum 6 characters)
4. Click "Register"
5. **Expected**: 
   - Success toast notification
   - Automatic redirect to `/dashboard`
   - User profile visible in top-right (if implemented)

**Verify:**
- ✅ Token stored in localStorage
- ✅ User data stored in auth store
- ✅ Protected routes are accessible

#### 1.2 User Login
**Flow:**
1. If logged out, navigate to `/login`
2. Enter credentials:
   - **Email**: `test@example.com`
   - **Password**: `Test123!@#`
3. Click "Login"
4. **Expected**: 
   - Success toast
   - Redirect to `/dashboard`

**Verify:**
- ✅ Session persists on page refresh
- ✅ Token is valid (check Network tab)
- ✅ Can access protected routes

#### 1.3 Session Management
**Flow:**
1. After login, refresh the page (F5)
2. **Expected**: Still logged in, no redirect to login
3. Close browser and reopen
4. **Expected**: Still logged in (token persists)

**Verify:**
- ✅ Token expiration handling (7 days)
- ✅ Auto-logout on expired token

#### 1.4 Logout
**Flow:**
1. Navigate to `/settings`
2. Click "Logout" button
3. **Expected**: 
   - Success toast
   - Redirect to `/login`
   - Token removed from localStorage

**Verify:**
- ✅ Cannot access protected routes after logout
- ✅ All cached data cleared

---

### Phase 2: Position Management

#### 2.1 Create Position
**Flow:**
1. Navigate to `/positions`
2. Click "Add Position" button (FAB or table button)
3. Fill in the form:
   - **Company Name**: `Apple Inc.` (or `AAPL`)
   - **Current Price**: `150.00`
   - **Status**: `Holding`
4. Click "Create Position"
5. **Expected**: 
   - Success toast
   - Position appears in positions list
   - Modal closes

**Verify:**
- ✅ Position appears in `/positions` page
- ✅ Position appears in `/companies` page
- ✅ Position appears in `/dashboard` summary

#### 2.2 View All Positions
**Flow:**
1. Navigate to `/positions`
2. **Expected**: 
   - List/table of all positions
   - Shows: Company, Quantity, Investment, Current Value, P/L, Return %

**Verify:**
- ✅ All positions displayed
- ✅ Metrics calculated correctly
- ✅ Color coding (green for gains, red for losses)

#### 2.3 View Position Details
**Flow:**
1. From `/positions`, click on a position (or position ID link)
2. Navigate to `/position/[id]`
3. **Expected**: 
   - Detailed position information
   - All metrics displayed
   - Transaction history section
   - Edit button visible

**Verify:**
- ✅ All position data displayed correctly
- ✅ Transaction timeline chart (if transactions exist)
- ✅ Position value evolution chart

#### 2.4 Edit Position
**Flow:**
1. Navigate to `/position/[id]`
2. Click "Edit Position" button
3. Modify:
   - **Current Price**: Change to `155.00`
   - **Status**: Change to `Watching`
4. Click "Update Position"
5. **Expected**: 
   - Success toast
   - Position updated
   - Metrics recalculated

**Verify:**
- ✅ Changes reflected immediately
- ✅ P/L recalculated based on new price
- ✅ Status updated

#### 2.5 Delete Position
**Flow:**
1. Navigate to `/positions`
2. Find a position to delete
3. Click "Delete" button
4. Confirm deletion in modal
5. **Expected**: 
   - Success toast
   - Position removed from list

**Verify:**
- ✅ Position removed from all views
- ✅ Company aggregation updated
- ✅ Dashboard summary updated

#### 2.6 Position Status Tracking
**Flow:**
1. Create/edit positions with different statuses:
   - **Holding**: Active positions
   - **Sold**: Closed positions
   - **Watching**: Monitored positions
2. **Expected**: 
   - Status displayed correctly
   - Can filter/view by status (if implemented)

**Verify:**
- ✅ Status persists after edit
- ✅ Status visible in position list

---

### Phase 3: Transaction Management

#### 3.1 Record Buy Transaction
**Flow:**
1. Navigate to `/position/[id]` (or `/transactions/[positionId]`)
2. Click "Add Transaction" button
3. Fill in the form:
   - **Type**: `Buy`
   - **Quantity**: `10`
   - **Price**: `150.00`
   - **Fees**: `5.00`
4. Click "Add Transaction"
5. **Expected**: 
   - Success toast
   - Transaction appears in table
   - Position metrics updated automatically

**Verify:**
- ✅ Transaction added to history
- ✅ Position quantity increased
- ✅ Average purchase price recalculated
- ✅ Total investment updated
- ✅ P/L recalculated

#### 3.2 Record Sell Transaction
**Flow:**
1. From position detail page, click "Add Transaction"
2. Fill in:
   - **Type**: `Sell`
   - **Quantity**: `5`
   - **Price**: `160.00`
   - **Fees**: `5.00`
3. Click "Add Transaction"
4. **Expected**: 
   - Success toast
   - Transaction added
   - Position quantity decreased

**Verify:**
- ✅ Quantity reduced correctly
- ✅ Realized P/L calculated (if applicable)
- ✅ Position still exists if quantity > 0

#### 3.3 View Transaction History
**Flow:**
1. Navigate to `/position/[id]`
2. Scroll to "Transactions" section
3. **Expected**: 
   - Table showing all transactions
   - Columns: Date, Type, Quantity, Price, Fees, Total, Actions

**Verify:**
- ✅ All transactions displayed
- ✅ Sorted by date (newest first)
- ✅ Totals calculated correctly

#### 3.4 Delete Transaction
**Flow:**
1. From transaction table, click "Delete" on a transaction
2. Confirm deletion
3. **Expected**: 
   - Success toast
   - Transaction removed
   - Position metrics recalculated

**Verify:**
- ✅ Transaction removed
- ✅ Position quantity adjusted
- ✅ Average price recalculated
- ✅ Investment updated

---

### Phase 4: Portfolio Analytics & Reporting

#### 4.1 Dashboard Overview
**Flow:**
1. Navigate to `/dashboard`
2. **Expected**: 
   - Summary cards showing:
     - Total Investment
     - Total Current Value
     - Unrealized P/L
     - Total Percent Return
   - Portfolio Performance Chart
   - Portfolio Allocation widget
   - Recent Transaction Volume chart
   - Top Performers list
   - Daily Snapshots table

**Verify:**
- ✅ All metrics calculated correctly
- ✅ Charts render properly
- ✅ Color coding (green/red) for gains/losses
- ✅ Links to detailed analytics work

#### 4.2 Company Analytics
**Flow:**
1. Navigate to `/companies`
2. **Expected**: 
   - Grid of company cards
   - Each card shows:
     - Company name
     - Total investment
     - Current value
     - Unrealized P/L
     - Number of positions

**Verify:**
- ✅ All companies displayed
- ✅ Aggregation correct
- ✅ Clicking company navigates to detail page

#### 4.3 Company Detail View
**Flow:**
1. From `/companies`, click on a company card
2. Navigate to `/company/[companyName]`
3. **Expected**: 
   - Company summary with metrics
   - Company performance chart
   - Transaction activity timeline
   - Positions table for that company

**Verify:**
- ✅ All company-specific data displayed
- ✅ Charts render correctly
- ✅ Links to positions work

#### 4.4 Performance Tracking
**Flow:**
1. Navigate to `/analytics/performance`
2. **Expected**: 
   - Timeframe selector (1D, 1W, 1M, 3M, 6M, 1Y, All)
   - Performance metrics grid:
     - Win Rate
     - Avg Return
     - Volatility
     - Sharpe Ratio
     - Max Drawdown
     - Total Return
   - Portfolio Equity Curve chart
   - Portfolio Gain/Loss chart
   - Portfolio Value & PnL chart
   - Return Distribution chart
   - Top/Bottom Performers lists

**Verify:**
- ✅ Metrics calculated correctly
- ✅ Charts update when timeframe changes
- ✅ Data filters correctly by timeframe

#### 4.5 Daily Snapshots
**Flow:**
1. Navigate to `/dashboard`
2. Scroll to "Daily Snapshots" section
3. Click "Create Manual Snapshot" button
4. **Expected**: 
   - Snapshot created
   - Appears in snapshots table
   - Shows date, investment, value, P/L, percentage

**Verify:**
- ✅ Snapshots created successfully
- ✅ Historical data preserved
- ✅ Can track portfolio over time

---

### Phase 5: Advanced Analytics

#### 5.1 Analytics Hub
**Flow:**
1. Navigate to `/analytics`
2. **Expected**: 
   - Overview cards with key metrics
   - Portfolio allocation pie chart
   - Analytics module cards (7 cards):
     - Performance Analytics
     - Transaction Analytics
     - Portfolio Allocation
     - Company Comparison
     - Time-Based Analysis
     - Position Analytics
     - Risk Analysis

**Verify:**
- ✅ All cards clickable
- ✅ Navigation works
- ✅ Metrics displayed correctly

#### 5.2 Transaction Analytics
**Flow:**
1. Navigate to `/analytics/transactions`
2. **Expected**: 
   - Summary cards (Total, Buy, Sell, Fees, etc.)
   - Transaction Volume chart (bar chart)
   - Buy vs Sell ratio chart (pie/donut)
   - Period selector (Daily, Weekly, Monthly)
   - Toggle between Volume/Count

**Verify:**
- ✅ Charts render correctly
- ✅ Data aggregates by period
- ✅ Toggle works

#### 5.3 Portfolio Allocation
**Flow:**
1. Navigate to `/analytics/allocation`
2. **Expected**: 
   - Allocation pie chart
   - Donut chart view
   - Toggle between Investment/Value
   - Detailed allocation table

**Verify:**
- ✅ Charts show correct percentages
- ✅ Table data matches charts
- ✅ Toggle works

#### 5.4 Company Comparison
**Flow:**
1. Navigate to `/analytics/companies/compare`
2. **Expected**: 
   - Company selector (multi-select)
   - Comparison chart (line chart)
   - Multi-metric radar chart
   - Company rankings table
   - Metric selector (Investment, Value, P/L, Percent)

**Verify:**
- ✅ Can select multiple companies
   - ✅ Charts update with selection
   - ✅ Rankings correct

#### 5.5 Time-Based Analysis
**Flow:**
1. Navigate to `/analytics/timeline`
2. **Expected**: 
   - Period selector (Daily, Weekly, Monthly, Yearly)
   - Period comparison toggle
   - Portfolio Equity Curve
   - Investment & Value Over Time (stacked area)
   - Aggregated data table
   - Period-over-period comparison cards

**Verify:**
- ✅ Period aggregation works
- ✅ Comparison shows changes
- ✅ Charts update correctly

#### 5.6 Position Analytics
**Flow:**
1. Navigate to `/analytics/positions`
2. **Expected**: 
   - Summary metrics (Total, Win Rate, Avg Return, Holding Period)
   - View mode selector (Heatmap, Scatter, Bubble)
   - Position Performance Heatmap
   - Risk vs Return scatter plot
   - Position Size vs Performance bubble chart
   - Status Distribution
   - Top Performers
   - All Positions Summary table

**Verify:**
- ✅ All view modes work
- ✅ Charts render correctly
- ✅ Data accurate

#### 5.7 Risk Analysis
**Flow:**
1. Navigate to `/analytics/risk`
2. **Expected**: 
   - Risk metrics cards:
     - Max Drawdown
     - Volatility
     - Value at Risk (VaR)
     - Sortino Ratio
   - Timeframe selector
   - Drawdown Analysis chart
   - Portfolio Value & Drawdown chart
   - Risk metrics explanation

**Verify:**
- ✅ Metrics calculated correctly
- ✅ Charts show drawdowns
- ✅ Timeframe filtering works

---

### Phase 6: Navigation & User Experience

#### 6.1 Desktop Navigation
**Flow:**
1. Check desktop navbar (top)
2. **Expected**: 
   - Logo/Brand (links to dashboard)
   - Links: Home, Positions, Companies, Analytics (dropdown), Logs, Settings
   - Backend Status indicator
   - Analytics dropdown shows 8 sub-items

**Verify:**
- ✅ All links work
- ✅ Analytics dropdown opens/closes
- ✅ Active route highlighted

#### 6.2 Mobile Navigation
**Flow:**
1. Resize browser to mobile width (< 768px)
2. **Expected**: 
   - Bottom navigation bar appears
   - Icons: Dashboard, Positions, Companies, Analytics, Settings
   - Active route highlighted with green indicator

**Verify:**
- ✅ Navigation works on mobile
- ✅ Active state visible
- ✅ Touch-friendly

#### 6.3 Protected Routes
**Flow:**
1. Logout
2. Try to access: `/dashboard`, `/positions`, `/analytics`, etc.
3. **Expected**: 
   - Redirect to `/login`
   - Cannot access protected routes

**Verify:**
- ✅ All portfolio routes protected
- ✅ Login page accessible
- ✅ Redirect works correctly

#### 6.4 Error Handling
**Flow:**
1. Disconnect backend (or use invalid API URL)
2. Try to perform actions
3. **Expected**: 
   - Error messages displayed
   - User-friendly error UI
   - Backend status indicator shows offline

**Verify:**
- ✅ Errors handled gracefully
- ✅ No crashes
- ✅ User can retry

#### 6.5 Loading States
**Flow:**
1. Navigate between pages
2. **Expected**: 
   - Loading skeletons shown
   - Smooth transitions
   - No blank screens

**Verify:**
- ✅ Loading states visible
- ✅ Smooth UX

#### 6.6 Empty States
**Flow:**
1. Create new account (or clear all data)
2. Navigate to pages with no data
3. **Expected**: 
   - Helpful empty state messages
   - Call-to-action buttons
   - No errors

**Verify:**
- ✅ Empty states display correctly
- ✅ Actions available (e.g., "Add Position")

---

### Phase 7: Settings & Account

#### 7.1 User Profile
**Flow:**
1. Navigate to `/settings`
2. **Expected**: 
   - User profile card showing:
     - Name
     - Email
     - User icon

**Verify:**
- ✅ Profile information correct
- ✅ Data from auth store

#### 7.2 Account Settings
**Flow:**
1. Navigate to `/settings`
2. **Expected**: 
   - Logout button
   - Clear Cache button
   - About section

**Verify:**
- ✅ Logout works
- ✅ Clear cache works
- ✅ About info displayed

---

### Phase 8: Logs & Debugging

#### 8.1 Application Logs
**Flow:**
1. Navigate to `/logs`
2. **Expected**: 
   - Log entries displayed
   - Auto-refresh toggle
   - Clear Logs button
   - Export JSON button
   - Logs sorted by timestamp (newest first)

**Verify:**
- ✅ Logs visible
- ✅ Auto-refresh works
- ✅ Export downloads JSON file
- ✅ Clear removes logs

---

### Phase 9: Data Visualization

#### 9.1 Charts Rendering
**Flow:**
1. Navigate through all analytics pages
2. **Expected**: 
   - All charts render without errors
   - Charts are interactive
   - Tooltips work on hover
   - Responsive on mobile

**Verify:**
- ✅ No console errors
- ✅ Charts load correctly
- ✅ Mobile-friendly

#### 9.2 Chart Types
**Flow:**
1. Check different chart types:
   - **Lightweight Charts**: Equity Curve, Gain/Loss, Drawdown, Multi-Series
   - **Recharts**: Pie, Bar, Line, Area, Scatter, Radar
   - **Chart.js**: Donut, Bubble, Polar Area

**Verify:**
- ✅ All chart types render
- ✅ Data accurate
- ✅ Styling consistent (neon theme)

---

### Phase 10: Performance & Optimization

#### 10.1 Lazy Loading
**Flow:**
1. Open browser DevTools → Network tab
2. Navigate to pages with charts
3. **Expected**: 
   - Charts load on-demand
   - Initial bundle size reasonable

**Verify:**
- ✅ Code splitting works
- ✅ Lazy loading functional

#### 10.2 Optimistic Updates
**Flow:**
1. Create/edit/delete position or transaction
2. **Expected**: 
   - UI updates immediately
   - No waiting for server response

**Verify:**
- ✅ Instant feedback
- ✅ Rollback on error

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot read properties of undefined"
**Fix**: Already fixed - all optional chaining added

### Issue: "NaN in charts"
**Fix**: Already fixed - all NaN values filtered

### Issue: "Routes not found"
**Fix**: Ensure backend is running and API URL is correct

### Issue: "Token expired"
**Fix**: Re-login, token expires after 7 days

### Issue: "Charts not rendering"
**Fix**: 
- Check browser console for errors
- Ensure data exists
- Try hard refresh (Ctrl+Shift+R)

---

## ✅ Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Session persists on refresh
- [ ] Logout works
- [ ] Protected routes redirect when not logged in

### Positions
- [ ] Create position
- [ ] View all positions
- [ ] View position details
- [ ] Edit position
- [ ] Delete position
- [ ] Status tracking (Holding/Sold/Watching)

### Transactions
- [ ] Add buy transaction
- [ ] Add sell transaction
- [ ] View transaction history
- [ ] Delete transaction
- [ ] Position metrics update automatically

### Analytics
- [ ] Dashboard loads with all widgets
- [ ] Performance Analytics page
- [ ] Transaction Analytics page
- [ ] Portfolio Allocation page
- [ ] Company Comparison page
- [ ] Time-Based Analysis page
- [ ] Position Analytics page
- [ ] Risk Analysis page
- [ ] Analytics Hub navigation

### Navigation
- [ ] Desktop navbar works
- [ ] Mobile bottom nav works
- [ ] Analytics dropdown works
- [ ] All links functional

### Settings & Logs
- [ ] Settings page accessible
- [ ] User profile displayed
- [ ] Logout works
- [ ] Logs page accessible
- [ ] Log export works

### Charts & Visualization
- [ ] All charts render
- [ ] No console errors
- [ ] Charts responsive
- [ ] Tooltips work

---

## 🎯 Quick Test Flow (5 minutes)

For a quick smoke test:

1. **Login** → `/login` → Enter credentials
2. **Create Position** → `/positions` → Add Position → Fill form → Create
3. **Add Transaction** → Click position → Add Transaction → Buy 10 shares @ $150
4. **View Dashboard** → `/dashboard` → Check summary cards and charts
5. **View Analytics** → `/analytics` → Click "Performance Analytics" → Check charts
6. **View Company** → `/companies` → Click company → Check detail page
7. **Logout** → `/settings` → Logout

If all these work, the core functionality is operational!

---

## 📝 Notes

- **Backend Required**: All features require backend API to be running
- **Data Persistence**: Data persists in backend database
- **Token Storage**: JWT tokens stored in localStorage
- **Session Duration**: 7 days
- **Mobile Support**: All features work on mobile devices
- **Offline Mode**: Basic offline detection, but requires backend for full functionality

---

## 🚀 Ready to Test!

Start with Phase 1 (Authentication) and work through each phase systematically. Document any issues you find, and they can be addressed.

**Happy Testing!** 🎉

