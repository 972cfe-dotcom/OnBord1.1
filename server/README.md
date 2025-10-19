# 🚀 Backend Server - Real API with Firebase

Backend API server עם Express.js ו-Firebase Admin SDK.

## 📁 מבנה התיקיות

```
server/
├── index.js                    # Entry point
├── config/
│   └── firebase.config.js     # Firebase configuration
├── routes/
│   ├── calculator.routes.js   # Calculator endpoints
│   ├── auth.routes.js         # Authentication endpoints
│   └── user.routes.js         # User endpoints
├── controllers/
│   ├── calculator.controller.js
│   ├── auth.controller.js
│   └── user.controller.js
├── middleware/
│   ├── auth.middleware.js     # JWT/Firebase auth
│   └── errorHandler.js        # Global error handler
├── models/                     # Data models (if needed)
├── utils/                      # Helper functions
├── package.json
├── Dockerfile
└── .env.example
```

## 🔧 התקנה והרצה

### התקנת Dependencies

```bash
cd server
npm install
```

### הגדרת משתני סביבה

העתק את `.env.example` ל-`.env` וערוך את הערכים:

```bash
cp .env.example .env
```

ערוך את `.env`:
```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8080
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### הרצה בפיתוח

```bash
npm run dev
```

### הרצה בפרודקשן

```bash
npm start
```

### הרצה עם Docker

```bash
# Build
docker build -t backend-api .

# Run
docker run -p 3000:3000 --env-file .env backend-api
```

## 🌐 API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "Backend API Server",
  "timestamp": "2025-10-19T21:00:00.000Z",
  "uptime": 123.456,
  "version": "1.0.0"
}
```

### Calculator API

#### Calculate
```
POST /api/calculator/calculate
```

Request Body:
```json
{
  "num1": 10,
  "num2": 5,
  "operation": "add"
}
```

Operations: `add`, `subtract`, `multiply`, `divide`, `power`, `modulo`

Response:
```json
{
  "success": true,
  "result": 15,
  "calculation": "10 + 5",
  "timestamp": "2025-10-19T21:00:00.000Z",
  "id": "firebase-doc-id"
}
```

#### Get History
```
GET /api/calculator/history?limit=50
```

Headers:
```
Authorization: Bearer <firebase-id-token>
```

Response:
```json
{
  "success": true,
  "count": 10,
  "calculations": [...]
}
```

#### Get Statistics
```
GET /api/calculator/stats
```

#### Delete Calculation
```
DELETE /api/calculator/history/:id
```

### Authentication API

#### Register
```
POST /api/auth/register
```

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "User Name"
}
```

#### Verify Token
```
POST /api/auth/verify
```

Request Body:
```json
{
  "token": "firebase-id-token"
}
```

### User API

#### Get Profile
```
GET /api/users/me
```

Headers:
```
Authorization: Bearer <firebase-id-token>
```

#### Update Profile
```
PUT /api/users/me
```

#### Delete Account
```
DELETE /api/users/me
```

## 🔥 Firebase Setup

### 1. צור פרויקט ב-Firebase Console
https://console.firebase.google.com

### 2. הפעל Firestore Database

### 3. הפעל Authentication
- Email/Password provider

### 4. הורד Service Account Key
1. Project Settings > Service Accounts
2. Generate New Private Key
3. שמור את ה-JSON

### 5. הגדר משתני סביבה

Option 1 - Development:
```env
FIREBASE_PROJECT_ID=your-project-id
```

Option 2 - Production:
```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

## 🔒 Security Features

- ✅ Helmet.js - Security headers
- ✅ CORS - Cross-origin resource sharing
- ✅ Rate limiting - DDoS protection
- ✅ Input validation - Joi schemas
- ✅ Firebase Authentication
- ✅ Non-root Docker user

## 📊 Logging

השרת משתמש ב-Morgan לloggin:
- Development: `dev` format
- Production: `combined` format

## 🧪 Testing

```bash
npm test
```

## 🐳 Docker Compose

הרץ Backend + Frontend ביחד:

```bash
docker-compose up
```

## 🚀 Deployment

### Google Cloud Run

```bash
gcloud run deploy backend-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Environment Variables in Cloud Run

```bash
gcloud run services update backend-api \
  --set-env-vars="FIREBASE_PROJECT_ID=your-project-id" \
  --set-env-vars="NODE_ENV=production"
```

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| NODE_ENV | No | development/production |
| PORT | No | Server port (default: 3000) |
| FRONTEND_URL | No | Frontend URL for CORS |
| FIREBASE_PROJECT_ID | Yes* | Firebase project ID |
| FIREBASE_DATABASE_URL | Yes* | Firebase database URL |
| FIREBASE_SERVICE_ACCOUNT | No | Service account JSON (production) |

\* Required only if using Firebase. Server can run in MOCK mode without it.

## 🎯 Features

- ✅ Real Backend API (not mock!)
- ✅ Firebase Admin SDK integration
- ✅ User authentication
- ✅ Data persistence (Firestore)
- ✅ RESTful API design
- ✅ Error handling
- ✅ Input validation
- ✅ Security best practices
- ✅ Docker support
- ✅ Health checks
- ✅ Rate limiting
- ✅ CORS support

## 📚 Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **firebase-admin** - Firebase SDK
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **morgan** - HTTP logging
- **joi** - Input validation

---

**Backend is ready for production! 🚀**
