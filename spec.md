# Corporate Wellness Hub

## Current State
Admin dashboard has 3 tabs: Overview, Provider Review, Activity Logs. The backend exposes `getAllBookings`, `getBookingsForProvider`, `getBookingsForUser`, and full `AdminStats` (totalBookings, approvedProviders, etc.). No booking reports, no CSV export, no provider performance view.

## Requested Changes (Diff)

### Add
- New **"Booking Reports"** tab in the admin dashboard showing:
  - Total bookings stat card
  - Bookings table (booking ID, user principal truncated, provider ID, booking time, confirmed status)
  - Filter by confirmation status (all / confirmed / pending)
  - **Export to CSV** button that downloads all booking data as a .csv file
- New **"Provider Performance"** tab showing:
  - Per-provider booking counts (derived from `getAllBookings` grouped by providerId)
  - Approved providers list with their booking counts
  - Visual bar chart per provider
- **"My Bookings"** section added to the employee dashboard page (`DashboardPage.tsx`) showing the user's own bookings from `getBookingsForUser`

### Modify
- Admin dashboard tabs: add "Booking Reports" and "Provider Performance" tabs
- Employee dashboard: add a "My Bookings" card section

### Remove
- Nothing removed

## Implementation Plan
1. Add `useAllBookings`, `useBookingsForUser` hooks to `useQueries.ts` using existing backend methods
2. Add `BookingReportsTab` component to `AdminDashboardPage.tsx` with table, filter, stats, and CSV export
3. Add `ProviderPerformanceTab` component to `AdminDashboardPage.tsx` with per-provider booking counts and bar chart
4. Register both new tabs in the `AdminDashboardView` tabs
5. Add "My Bookings" section to `DashboardPage.tsx` using `useBookingsForUser` hook
