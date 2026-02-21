# MediCare Backend API

This is the production-ready Node.js/Express backend for the MediCare app.

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Local MongoDB running on `mongodb://127.0.0.1:27017`

### Installation
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Check the `.env` file (pre-configured for you).
4. Run the server:
   ```bash
   npm start
   ```
   *Note: Add `"start": "node server.js"` to `package.json` scripts if not already there, or use `node server.js`.*

## 🛣️ API Endpoints

### Auth Routes (`/api/auth`)
- **Signup**: `POST /api/auth/signup`
- **Login**: `POST /api/auth/login`

### Appointment Routes (`/api/appointments`)
- **Book**: `POST /api/appointments/book`
- **All**: `GET /api/appointments`
- **Upcoming**: `GET /api/appointments/upcoming`
- **History**: `GET /api/appointments/history`

## 🧪 Postman / Test Examples

### 1. User Signup
**URL**: `http://localhost:5000/api/auth/signup`
**Method**: `POST`
**Body (JSON)**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

### 2. User Login
**URL**: `http://localhost:5000/api/auth/login`
**Method**: `POST`
**Body (JSON)**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Book Appointment (Requires JWT)
**URL**: `http://localhost:5000/api/appointments/book`
**Method**: `POST`
**Header**: `Authorization: Bearer <TOKEN>`
**Body (JSON)**:
```json
{
  "doctorName": "Dr. James Smith",
  "date": "2024-10-24",
  "time": "10:30 AM"
}
```

### 4. Get Upcoming Appointments (Requires JWT)
**URL**: `http://localhost:5000/api/appointments/upcoming`
**Method**: `GET`
**Header**: `Authorization: Bearer <TOKEN>`

## 📜 Logic Details
- **Double Booking Prevention**: Checks if the same doctor has an appointment at the exact same date and time slot.
- **Sorting**: Upcoming appointments are sorted by date (ascending), while history is sorted by date (descending).
- **Authentication**: JWT is used to protect all appointment routes. The user ID is automatically extracted from the token.
