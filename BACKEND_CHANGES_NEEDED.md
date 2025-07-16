# Backend Changes Required

## 1. Add New Endpoints to Request Controller

### GET /api/requests/my-requests

- **Purpose**: Get user-specific requests
- **Logic**:
  - For recipients: Return their created requests
  - For donors: Return requests they've responded to
- **Implementation**:

```javascript
const getMyRequests = async (req, res) => {
  try {
    const uid = req.user.uid;
    const userProfile = await getUserProfile(uid); // You'll need this helper

    let query;
    if (userProfile.role === "recipient") {
      // Get requests created by this recipient
      query = db
        .collection("donation_requests")
        .where("recipientId", "==", uid);
    } else if (userProfile.role === "donor") {
      // Get requests this donor has responded to
      query = db.collection("donation_requests").where("donorId", "==", uid);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString?.() ||
        doc.data().createdAt,
    }));

    res.status(200).send(requests);
  } catch (error) {
    console.error("Error fetching my requests:", error);
    res.status(500).send({ message: "Error fetching requests." });
  }
};
```

### DELETE /api/requests/:id

- **Purpose**: Cancel a request (recipients only)
- **Implementation**:

```javascript
const cancelBloodRequest = async (req, res) => {
  try {
    const uid = req.user.uid;
    const requestId = req.params.id;

    const requestRef = db.collection("donation_requests").doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return res.status(404).send({ message: "Request not found." });
    }

    const requestData = requestDoc.data();

    // Only the recipient who created the request can cancel it
    if (requestData.recipientId !== uid) {
      return res
        .status(403)
        .send({ message: "Unauthorized to cancel this request." });
    }

    // Can only cancel active requests
    if (requestData.status !== "active") {
      return res
        .status(400)
        .send({ message: "Can only cancel active requests." });
    }

    await requestRef.update({
      status: "cancelled",
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send({ message: "Request cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling request:", error);
    res.status(500).send({ message: "Error cancelling request." });
  }
};
```

### POST /api/requests/:id/complete

- **Purpose**: Complete a donation (recipients only)
- **Implementation**:

```javascript
const completeDonation = async (req, res) => {
  try {
    const uid = req.user.uid;
    const requestId = req.params.id;

    const requestRef = db.collection("donation_requests").doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return res.status(404).send({ message: "Request not found." });
    }

    const requestData = requestDoc.data();

    // Only the recipient can mark as complete
    if (requestData.recipientId !== uid) {
      return res
        .status(403)
        .send({ message: "Unauthorized to complete this request." });
    }

    // Can only complete pending_confirmation requests
    if (requestData.status !== "pending_confirmation") {
      return res.status(400).send({
        message: "Request must be in pending_confirmation status to complete.",
      });
    }

    await requestRef.update({
      status: "completed",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send({ message: "Donation completed successfully." });
  } catch (error) {
    console.error("Error completing donation:", error);
    res.status(500).send({ message: "Error completing donation." });
  }
};
```

## 2. Modify Existing Endpoints

### Update respondToBloodRequest

- Add message field to the response
- Store response details

### Update getBloodRequest

- Only return active requests
- Don't show requests the donor has already responded to

## 3. Add User Profile Helper

```javascript
const getUserProfile = async (uid) => {
  const userDoc = await db.collection("users").doc(uid).get();
  return userDoc.exists ? userDoc.data() : null;
};
```

## 4. Update Routes

Add these routes to your userRoutes.js:

```javascript
router.get("/requests/my-requests", checkAuth, getMyRequests);
router.delete("/requests/:id", checkAuth, cancelBloodRequest);
```

## 5. Export New Functions

```javascript
module.exports = {
  postBloodRequest,
  getBloodRequest,
  respondToBloodRequest,
  completeDonation,
  getMyRequests,
  cancelBloodRequest,
};
```
