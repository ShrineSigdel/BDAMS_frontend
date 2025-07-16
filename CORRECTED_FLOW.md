# BDAMS Blood Request Flow - Complete Implementation

## Current Status vs Required Changes

### ❌ Current Issues:

1. **Backend missing endpoints**: No `/requests/my-requests`, no proper cancel endpoint
2. **Frontend calling wrong endpoints**: Using `/requests` for user-specific requests
3. **Incomplete status flow**: Missing `pending_confirmation` status handling
4. **Wrong API logic**: Recipients and donors seeing same data

### ✅ Corrected Flow:

## 1. Backend Changes Required (IMPLEMENT THESE FIRST):

### Add to Request Controller:

```javascript
// GET /api/requests/my-requests - Get user-specific requests
const getMyRequests = async (req, res) => {
  const uid = req.user.uid;
  const userProfile = await getUserProfile(uid);

  let query;
  if (userProfile.role === "recipient") {
    query = db.collection("donation_requests").where("recipientId", "==", uid);
  } else if (userProfile.role === "donor") {
    query = db.collection("donation_requests").where("donorId", "==", uid);
  }

  const snapshot = await query.orderBy("createdAt", "desc").get();
  // ... return processed requests
};

// DELETE /api/requests/:id - Cancel request (recipients only)
const cancelBloodRequest = async (req, res) => {
  const uid = req.user.uid;
  const requestId = req.params.id;

  // Verify recipient owns the request and it's active
  // Update status to 'cancelled'
};

// Update respondToBloodRequest to include message
const respondToBloodRequest = async (req, res) => {
  const { message } = req.body; // Add message support
  // Change status to 'pending_confirmation'
  // Set donorId
};
```

### Add to Routes (userRoutes.js):

```javascript
router.get("/requests/my-requests", checkAuth, getMyRequests);
router.delete("/requests/:id", checkAuth, cancelBloodRequest);
```

## 2. Frontend Flow (ALREADY IMPLEMENTED):

### For Recipients:

1. **Create Request** → POST `/api/requests` → Status: `active`
2. **View My Requests** → GET `/api/requests/my-requests` → See their requests
3. **Cancel Request** → DELETE `/api/requests/:id` → Status: `cancelled`
4. **Complete Donation** → POST `/api/requests/:id/complete` → Status: `completed`

### For Donors:

1. **View Available Requests** → GET `/api/requests` → See all `active` requests
2. **Respond to Request** → POST `/api/requests/:id/respond` → Status: `pending_confirmation`
3. **View My Donations** → GET `/api/requests/my-requests` → See requests they responded to

## 3. Status Flow:

```
active → (donor responds) → pending_confirmation → (recipient completes) → completed
active → (recipient cancels) → cancelled
```

## 4. UI Behavior:

### My Requests (Recipients):

- **Active requests**: Show "Cancel Request" button
- **Pending confirmation**: Show "Mark as Fulfilled" button
- **Completed/Cancelled**: Read-only

### My Donations (Donors):

- **Pending confirmation**: Show "Awaiting confirmation"
- **Completed**: Show "Donation completed"

### Blood Requests (Donors):

- **Active requests**: Show "Respond" button
- **After response**: Request moves to pending, shows in donor's history

## 5. Data Structure:

### Request Document:

```javascript
{
    id: "doc_id",
    recipientId: "recipient_uid",
    donorId: "donor_uid_or_null",
    bloodType: "A+",
    location: "Hospital Name",
    urgency: "high",
    status: "active|pending_confirmation|completed|cancelled",
    createdAt: "timestamp",
    completedAt: "timestamp_or_null",
    cancelledAt: "timestamp_or_null"
}
```

## 6. Testing Steps:

1. **Recipient creates request** → Should appear in their "My Requests"
2. **Donor views available requests** → Should see the new request
3. **Donor responds** → Request status becomes "pending_confirmation"
4. **Recipient sees response** → Can mark as fulfilled
5. **Recipient marks fulfilled** → Status becomes "completed"
6. **Both users see updated status** → In their respective views

## Next Steps:

1. ✅ Frontend updated (DONE)
2. ❌ Backend needs the missing endpoints (REQUIRED)
3. ❌ Test the complete flow (AFTER BACKEND CHANGES)

The frontend is now ready and will work correctly once the backend endpoints are implemented.
