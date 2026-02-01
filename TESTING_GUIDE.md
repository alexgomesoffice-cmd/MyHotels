# Testing Guide - Security Fixes

## Quick Test Checklist

### 1. Hotel Manager Authorization (Fix #1)
**Test:** Try creating a hotel as a regular user (role_id=2)
```bash
# This should now FAIL with 403
POST /api/hotels
Authorization: Bearer {user_token}
Body: {
  "name": "Test Hotel",
  "address": "123 Main St",
  "description": "Test",
  "hotel_type_id": 1
}
```
**Expected:** `"Access denied. Manager only."`

---

### 2. Manager User Enumeration (Fix #2)
**Test:** Try accessing another manager's hotels
```bash
# Before: GET /api/hotels/manager/999 would work
# After: GET /api/hotels/manager returns only YOUR hotels
GET /api/hotels/manager
Authorization: Bearer {manager_token}
```
**Expected:** Returns only current manager's hotels (uses req.user.user_id)

---

### 3. Hotel Ownership (Fix #3)
**Test:** Verify hotel created_by_user_id is set from token
```bash
POST /api/hotels
# created_by_user_id should be automatically set to authenticated user
```
**Check DB:** `SELECT created_by_user_id FROM hotel WHERE hotel_id = 1;`
Should match authenticated user's ID

---

### 4. SQL Wildcard Injection (Fix #4)
**Test:** Search with wildcard characters
```bash
# Before: location="%" would return ALL hotels
# After: Escaped and treated as literal %
POST /api/search/availability
Body: {
  "location": "%",
  "checkIn": "2026-02-15",
  "checkOut": "2026-02-20",
  "rooms": 1
}
```
**Expected:** Searches for hotels with "%" in address (returns 0 results)

---

### 5. Audit Logging (Fix #5)
**Test:** Admin approves a hotel and check audit log
```bash
# Approve a hotel via admin endpoint
PATCH /api/admin/hotels/approve
Body: { "hotel_id": 1, "status": "APPROVED" }

# Check audit_log table
SELECT * FROM audit_log WHERE action = 'APPROVED_HOTEL' ORDER BY created_at DESC LIMIT 1;
```
**Expected:** Audit entry shows admin_id, timestamp, action, entity details

---

### 6. Hotel Type Validation (Fix #6)
**Test:** Create hotel with invalid hotel_type_id
```bash
POST /api/hotels (as manager)
Body: {
  "name": "Test",
  "address": "Test St",
  "description": "Test",
  "hotel_type_id": 9999  // Invalid ID
}
```
**Expected:** `400: "Invalid hotel_type_id. Hotel type does not exist"`
(Not 500 error)

---

### 7. Room Type Validation (Fix #7)
**Test:** Create room with invalid hotel_room_type_id
```bash
POST /api/hotels/{hotel_id}/rooms (as manager)
Body: {
  "hotel_room_type_id": 9999,  // Invalid ID
  "room_number": "101",
  "price": 100
}
```
**Expected:** `400: "Invalid hotel_room_type_id. Room type does not exist"`

---

### 8. Rate Limiting (Fix #9)
**Test:** Rapid search requests
```bash
# Run 150 requests in 15 seconds
for i in {1..150}; do
  curl -X POST http://localhost:5000/api/search/availability \
    -H "Content-Type: application/json" \
    -d '{
      "location": "New York",
      "checkIn": "2026-02-15",
      "checkOut": "2026-02-20",
      "rooms": 1
    }'
done
```
**Expected:** After 100 requests, returns: `429: "Too many search requests from this IP"`

---

### 9. Room Count Max Validation (Fix #10)
**Test:** Search with rooms > 999
```bash
POST /api/search/availability
Body: {
  "location": "NYC",
  "checkIn": "2026-02-15",
  "checkOut": "2026-02-20",
  "rooms": 1000  // Over limit
}
```
**Expected:** `400: "rooms...integer >= 1 and <= 999"`

---

### 10. Past-Date Validation (Fix #11)
**Test:** Try booking for past dates
```bash
POST /api/bookings
Body: {
  "hotel_room_details_id": 1,
  "checkin_date": "2020-01-01",  // Past date
  "checkout_date": "2020-01-05",
  "for_room": 1,
  "total_price": 500
}
```
**Expected:** `400: "Check-in date cannot be in the past"`

---

### 11. User Details Uniqueness (Fix #12)
**Test:** Manually create duplicate user_details (if possible) and try booking
```javascript
// Simulate with DB: INSERT duplicate user_details records
INSERT INTO user_details (user_id, ...) VALUES (1, ...);
INSERT INTO user_details (user_id, ...) VALUES (1, ...);  // Duplicate

// Then try booking
POST /api/bookings
```
**Expected:** `500: "Data integrity error. Multiple user details records found."`

---

### 12. Admin Self-Deletion (Fix #13)
**Test:** Admin tries to delete their own account
```bash
DELETE /api/admin/users
Body: {
  "user_id": 1  // Same as authenticated admin (1)
}
```
**Expected:** `403: "You cannot delete your own account. Contact another admin for this action."`

---

## Database Verification

Check audit log is populated:
```sql
SELECT 
  audit_log_id,
  user_id,
  action,
  entity_type,
  entity_id,
  created_at
FROM audit_log
ORDER BY created_at DESC
LIMIT 10;
```

Check user_details uniqueness constraint:
```sql
SELECT user_id, COUNT(*) as count
FROM user_details
GROUP BY user_id
HAVING count > 1;
```

Check hotel duplicate constraint:
```sql
SELECT UNIQUE KEY
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'hotel'
AND CONSTRAINT_NAME = 'unique_hotel_duplicate';
```

---

## Frontend Considerations

Since rate limiting now applies to search, the frontend may show:
- Rate limit message if user searches too rapidly
- Toast/alert: "Too many search requests from this IP, please try again later"

The search endpoint remains public for unregistered users, but with rate limiting.

---

## Deployment Checklist

- [ ] Test all 12 fixes with the checklist above
- [ ] Verify express-rate-limit package installed: `npm list express-rate-limit`
- [ ] Check audit_log table is accessible and growing
- [ ] Monitor for FK validation errors (should be less common now)
- [ ] Test admin approval workflows (audit logging should work)
- [ ] Verify managers can only see their own hotels
- [ ] Test booking with past dates (should fail)
- [ ] Test rate limiting with load test
- [ ] Verify error messages are consistent and helpful

