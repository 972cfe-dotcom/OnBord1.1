# 🏗️ ארכיטקטורת המערכת - מחשבון Frontend + Backend

## 🎯 תרשים ארכיטקטורה כללי

```
┌─────────────────────────────────────────────────────────────────────┐
│                          User's Browser                              │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    Frontend Layer                           │   │
│  │                   (HTML/CSS/JavaScript)                     │   │
│  │                                                             │   │
│  │  • index.html - User Interface                             │   │
│  │  • Form inputs (num1, num2)                                │   │
│  │  • Operation buttons                                       │   │
│  │  • Result display                                          │   │
│  │  • JavaScript fetch() API calls                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              │ HTTP POST /api/calculate              │
│                              │ JSON: {num1, num2, operation}         │
│                              ▼                                       │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               │ Network (HTTP/HTTPS)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Docker Container                             │
│                       (Node.js 20 + Express)                         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    Backend Layer                            │   │
│  │                    (server.js)                              │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │         Express Middleware Stack                     │ │   │
│  │  │                                                      │ │   │
│  │  │  • express.json() - Parse JSON bodies               │ │   │
│  │  │  • express.static('public') - Serve frontend        │ │   │
│  │  │  • CORS handling                                     │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │              API Endpoints                           │ │   │
│  │  │                                                      │ │   │
│  │  │  GET  /                → Frontend HTML              │ │   │
│  │  │  POST /api/calculate   → Calculator Logic           │ │   │
│  │  │  GET  /api/health      → Health Check               │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │           Business Logic Layer                       │ │   │
│  │  │                                                      │ │   │
│  │  │  • Input validation                                  │ │   │
│  │  │  • Mathematical operations:                          │ │   │
│  │  │    - Addition (+)                                    │ │   │
│  │  │    - Subtraction (-)                                 │ │   │
│  │  │    - Multiplication (×)                              │ │   │
│  │  │    - Division (÷)                                    │ │   │
│  │  │    - Power (^)                                       │ │   │
│  │  │    - Modulo (%)                                      │ │   │
│  │  │  • Error handling                                    │ │   │
│  │  │  • Result formatting                                 │ │   │
│  │  │  • Logging                                           │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                             │   │
│  │  Response JSON: {success, result, calculation, timestamp}  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Port: 8080 (Exposed)                                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 זרימת נתונים (Data Flow)

### 1️⃣ בקשת חישוב (Calculation Request)

```
┌──────────┐
│  User    │
│  Types   │  "10 + 5"
└────┬─────┘
     │
     │ Fills form and clicks "Calculate"
     ▼
┌────────────────────┐
│   JavaScript       │
│   Event Handler    │
└────┬───────────────┘
     │
     │ Collect input values
     │ Validate locally
     ▼
┌────────────────────┐
│   fetch() API      │
│   POST Request     │
└────┬───────────────┘
     │
     │ HTTP Request
     │ Headers: Content-Type: application/json
     │ Body: {"num1": 10, "num2": 5, "operation": "add"}
     ▼
┌────────────────────┐
│  Express Server    │
│  Receives Request  │
└────┬───────────────┘
     │
     │ Parse JSON Body
     ▼
┌────────────────────┐
│  Validation Layer  │
│  - Check inputs    │
│  - Parse numbers   │
│  - Verify operation│
└────┬───────────────┘
     │
     │ If validation fails → Return error
     │ If validation passes ↓
     ▼
┌────────────────────┐
│ Business Logic     │
│ Switch(operation)  │
│   case 'add':      │
│     result=n1+n2   │
└────┬───────────────┘
     │
     │ Calculate result
     │ Log to console
     ▼
┌────────────────────┐
│  Response Builder  │
│  Create JSON       │
└────┬───────────────┘
     │
     │ HTTP Response
     │ Status: 200 OK
     │ Body: {"success": true, "result": 15, ...}
     ▼
┌────────────────────┐
│  Frontend          │
│  Receives Response │
└────┬───────────────┘
     │
     │ Parse JSON
     │ Update UI
     ▼
┌────────────────────┐
│  Display Result    │
│  "10 + 5 = 15"     │
└────────────────────┘
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────┐
│         Security Measures               │
├─────────────────────────────────────────┤
│                                         │
│  1. Input Validation                    │
│     ✓ Type checking (numbers only)     │
│     ✓ NaN detection                     │
│     ✓ Division by zero prevention       │
│     ✓ Operation whitelist               │
│                                         │
│  2. Docker Security                     │
│     ✓ Non-root user (appuser)          │
│     ✓ Minimal base image (node:20-slim)│
│     ✓ No shell access in production    │
│                                         │
│  3. Error Handling                      │
│     ✓ Try-catch blocks                  │
│     ✓ Graceful error messages           │
│     ✓ No sensitive data in errors       │
│                                         │
│  4. Network Security                    │
│     ✓ HTTPS ready                       │
│     ✓ Proper CORS handling              │
│     ✓ Rate limiting (can be added)      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🚦 Request/Response Cycle

### Successful Request Example

```
┌─────────────────────────────────────────────────────────┐
│                     REQUEST                              │
├─────────────────────────────────────────────────────────┤
│ Method: POST                                            │
│ URL: /api/calculate                                     │
│ Headers:                                                │
│   Content-Type: application/json                        │
│ Body:                                                   │
│   {                                                     │
│     "num1": 25,                                         │
│     "num2": 4,                                          │
│     "operation": "multiply"                             │
│   }                                                     │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  Server Process  │
              │  25 × 4 = 100    │
              └──────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    RESPONSE                              │
├─────────────────────────────────────────────────────────┤
│ Status: 200 OK                                          │
│ Headers:                                                │
│   Content-Type: application/json                        │
│ Body:                                                   │
│   {                                                     │
│     "success": true,                                    │
│     "result": 100,                                      │
│     "calculation": "25 × 4",                            │
│     "timestamp": "2025-10-19T21:22:58.000Z"            │
│   }                                                     │
└─────────────────────────────────────────────────────────┘
```

### Error Request Example

```
┌─────────────────────────────────────────────────────────┐
│                     REQUEST                              │
├─────────────────────────────────────────────────────────┤
│ Method: POST                                            │
│ URL: /api/calculate                                     │
│ Body:                                                   │
│   {                                                     │
│     "num1": 10,                                         │
│     "num2": 0,                                          │
│     "operation": "divide"                               │
│   }                                                     │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  Server Process  │
              │  10 ÷ 0 = ERROR! │
              └──────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    RESPONSE                              │
├─────────────────────────────────────────────────────────┤
│ Status: 400 Bad Request                                 │
│ Headers:                                                │
│   Content-Type: application/json                        │
│ Body:                                                   │
│   {                                                     │
│     "success": false,                                   │
│     "error": "לא ניתן לחלק באפס"                        │
│   }                                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🐳 Docker Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    Docker Host                            │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │         Docker Container                         │    │
│  │         (calculator-backend)                     │    │
│  │                                                  │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │  Base Image: node:20-slim                 │  │    │
│  │  │  - Debian Linux                           │  │    │
│  │  │  - Node.js 20.x                           │  │    │
│  │  │  - npm package manager                    │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │                                                  │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │  Working Directory: /app                  │  │    │
│  │  │                                           │  │    │
│  │  │  Files:                                   │  │    │
│  │  │  ├── node_modules/                        │  │    │
│  │  │  ├── public/                              │  │    │
│  │  │  │   └── index.html                       │  │    │
│  │  │  ├── package.json                         │  │    │
│  │  │  └── server.js                            │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │                                                  │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │  Process (PID 1)                          │  │    │
│  │  │  User: appuser (non-root)                 │  │    │
│  │  │  Command: node server.js                  │  │    │
│  │  │  Listening: 0.0.0.0:8080                  │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │                                                  │    │
│  │  Port Mapping: 8080:8080                        │    │
│  └──────────────────┬───────────────────────────────┘    │
│                     │                                     │
│                     │ Exposed Port                        │
│                     ▼                                     │
│              ┌─────────────┐                              │
│              │  Port 8080  │◄────── External Access       │
│              └─────────────┘                              │
└───────────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Options

```
Current: Single Container
┌────────────────┐
│   Container    │
│   Frontend +   │
│   Backend      │
└────────────────┘

Future Option 1: Separated Services
┌────────────────┐     ┌────────────────┐
│   Frontend     │────►│    Backend     │
│   Container    │     │    Container   │
│   (Nginx)      │     │   (Node.js)    │
└────────────────┘     └────────────────┘

Future Option 2: Microservices
┌────────────┐
│  Frontend  │
│  (React)   │
└─────┬──────┘
      │
      ├──────────┐
      │          │
      ▼          ▼
┌──────────┐ ┌──────────┐
│Calculator│ │ History  │
│  Service │ │ Service  │
└──────────┘ └──────────┘
      │          │
      └────┬─────┘
           ▼
    ┌──────────┐
    │ Database │
    │(MongoDB) │
    └──────────┘
```

---

## 🎯 Key Design Decisions

### 1. Monolithic First
**למה?** 
- פשוט לפיתוח ותחזוקה בהתחלה
- קל לפריסה
- מתאים לאפליקציה קטנה-בינונית

### 2. RESTful API
**למה?**
- Standard ומקובל
- קל להבנה ושימוש
- תמיכה בכל הדפדפנים

### 3. Stateless Server
**למה?**
- ניתן להרחבה (scale horizontally)
- פשוט יותר
- אין צורך בניהול session

### 4. Docker Containerization
**למה?**
- "Works on my machine" → Works everywhere
- קל לפריסה ב-Cloud
- Isolation וסביבה עקבית

---

## 🚀 Performance Considerations

```
┌──────────────────────────────────────────┐
│         Performance Metrics              │
├──────────────────────────────────────────┤
│                                          │
│ Response Time: ~10-50ms                  │
│ Container Size: ~200MB                   │
│ Memory Usage: ~50-100MB                  │
│ CPU Usage: Minimal (<5%)                 │
│                                          │
│ Bottlenecks (Future):                    │
│ - Network latency                        │
│ - Multiple concurrent requests           │
│                                          │
│ Solutions:                               │
│ - Add Redis cache                        │
│ - Load balancer                          │
│ - CDN for static files                   │
└──────────────────────────────────────────┘
```

---

**תיעוד זה נוצר לצורך הבנת הארכיטקטורה המלאה של המערכת.**
