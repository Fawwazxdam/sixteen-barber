# Sixteen Barber API Documentation

This API provides backend services for the Sixteen Barber application, a barber shop booking system built with NestJS and PostgreSQL.

## Base URL
```
http://localhost:4000
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your_jwt_token>
```

### Login
To obtain a JWT token, use the login endpoint.

## Data Models

### User
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "ADMIN" | "BARBER",
  "createdAt": "timestamp"
}
```

### Service
```json
{
  "id": "uuid",
  "name": "string",
  "price": "number",
  "duration": "number", // in minutes
  "isActive": "boolean"
}
```

### Booking
```json
{
  "id": "uuid",
  "barberId": "uuid",
  "serviceId": "uuid",
  "customerUserId": "uuid?", // optional
  "customerName": "string",
  "customerPhone": "string",
  "customerNote": "string?", // optional
  "bookingDate": "timestamp",
  "status": "pending" | "confirmed" | "cancelled" | "completed",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Endpoints

### Authentication

#### POST /auth/login
Login to get JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "accessToken": "string"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'
```

### Bookings

#### POST /bookings
Create a new booking.

**Request Body:**
```json
{
  "barberId": "string",
  "serviceId": "string",
  "customerUserId": "string?", // optional
  "customerName": "string",
  "customerPhone": "string",
  "customerNote": "string?", // optional
  "bookingTime": "string", // ISO date string
  "duration": "number" // min 30
}
```

**Response:** Booking object

#### GET /bookings
Get all bookings.

**Response:** Array of Booking objects

#### GET /bookings/available-slots
Get available time slots for a barber on a specific date.

**Query Parameters:**
- `date`: string (YYYY-MM-DD)
- `barberId`: string

**Response:** Array of available time slots (strings in HH:mm format)

**Example:**
```bash
curl "http://localhost:4000/bookings/available-slots?date=2023-12-01&barberId=uuid"
```

### Services

#### POST /services
Create a new service. (Requires ADMIN role)

**Request Body:**
```json
{
  "name": "string",
  "price": "number", // min 0
  "duration": "number", // min 1, in minutes
  "isActive": "boolean?" // optional, default true
}
```

**Response:** Service object

#### GET /services
Get all services.

**Response:** Array of Service objects

#### PATCH /services/:id
Update a service. (Requires ADMIN role)

**Request Body:** (all fields optional)
```json
{
  "name": "string?",
  "price": "number?",
  "duration": "number?",
  "isActive": "boolean?"
}
```

**Response:** Updated Service object

#### PATCH /services/:id/toggle-active
Toggle the active status of a service. (Requires ADMIN role)

**Response:** Updated Service object

### Users (Barbers)

#### POST /users/barbers
Create a new barber. (Requires ADMIN role)

**Content-Type:** `multipart/form-data`

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Barber's email address |
| name | string | Yes | Barber's name |
| password | string | Yes | Password (min 6 characters) |
| image | File | No | Barber's photo |

**Response:** User object with media
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "BARBER",
  "image": "string?",
  "media": {
    "id": "uuid",
    "type": "barber",
    "referenceId": "uuid",
    "url": "/uploads/filename.jpg",
    "createdAt": "timestamp"
  },
  "createdAt": "timestamp"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/users/barbers \
  -H "Authorization: Bearer <token>" \
  -F "email=barber@example.com" \
  -F "name=John Doe" \
  -F "password=password123" \
  -F "image=@photo.jpg"
```

#### GET /users/barbers
Get all barbers. (Requires ADMIN role)

**Response:** Array of User objects (barbers only)

#### PATCH /users/barbers/:id
Update a barber. (Requires ADMIN role)

**Content-Type:** `multipart/form-data`

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | Barber's name |
| password | string | No | New password (min 6 characters) |
| image | File | No | New barber's photo |

**Response:** Updated User object with media

**Example:**
```bash
curl -X PATCH http://localhost:4000/users/barbers/uuid \
  -H "Authorization: Bearer <token>" \
  -F "name=John Updated" \
  -F "image=@new-photo.jpg"
```

### Media

#### GET /media
Get media by type and reference ID.

**Query Parameters:**
- `type`: string (e.g., "barber")
- `referenceId`: string (ID of the referenced entity)

**Response:** Array of Media objects
```json
[
  {
    "id": "uuid",
    "type": "barber",
    "referenceId": "uuid",
    "url": "/uploads/filename.jpg",
    "createdAt": "timestamp"
  }
]
```

**Example:**
```bash
curl "http://localhost:4000/media?type=barber&referenceId=uuid"
```

**Access Uploaded Files:**
```
http://localhost:3000/uploads/{filename}
```

## Error Responses
All endpoints may return error responses in the following format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Common status codes:
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid or missing JWT)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## Setup and Running

### Prerequisites
- Node.js
- PostgreSQL
- npm

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/sixteen_barber
JWT_SECRET=your_jwt_secret
```

### Database Setup
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Running the Application
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## License
MIT
