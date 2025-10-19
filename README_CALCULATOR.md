# 🧮 מערכת מחשבון - Frontend + Backend

מערכת מלאה עם ממשק משתמש (Frontend) ושרת (Backend) המבצעת חישובים מתקדמים.

## 🏗️ ארכיטקטורה

```
┌─────────────────┐          ┌──────────────────┐         ┌─────────────────┐
│   Frontend      │          │   HTTP Request    │         │    Backend      │
│   (Browser)     │  ──────► │   POST /api/      │  ─────► │   (Node.js)     │
│   HTML/CSS/JS   │          │   calculate       │         │   Express API   │
└─────────────────┘          └──────────────────┘         └─────────────────┘
                                                                    │
                                                                    ▼
                                                            ┌─────────────────┐
                                                            │   Processing    │
                                                            │   Calculation   │
                                                            └─────────────────┘
                                                                    │
                                                                    ▼
                                                            ┌─────────────────┐
                                                            │   JSON Response │
                                                            │   with Result   │
                                                            └─────────────────┘
```

## 📁 מבנה הפרויקט

```
webapp/
├── server.js              # Backend API Server
├── public/
│   └── index.html        # Frontend UI
├── Dockerfile            # Docker configuration
├── package.json          # Node.js dependencies
└── README_CALCULATOR.md  # זה המסמך
```

## 🚀 הרצה מקומית

### דרך 1: הרצה ישירה עם Node.js

```bash
# התקנת dependencies
npm install

# הרצת השרת
npm start
```

השרת יעלה על: `http://localhost:8080`

### דרך 2: הרצה עם Docker

```bash
# בניית Docker Image
docker build -t calculator-app .

# הרצת Container
docker run -p 8080:8080 calculator-app
```

גש לדפדפן: `http://localhost:8080`

## 🔧 Backend API

### Endpoint: POST /api/calculate

**Request Body:**
```json
{
  "num1": 10,
  "num2": 5,
  "operation": "add"
}
```

**פעולות זמינות:**
- `add` - חיבור (+)
- `subtract` - חיסור (-)
- `multiply` - כפל (×)
- `divide` - חילוק (÷)
- `power` - חזקה (^)
- `modulo` - שארית חילוק (%)

**Response - Success:**
```json
{
  "success": true,
  "result": 15,
  "calculation": "10 + 5",
  "timestamp": "2025-10-19T21:22:58.000Z"
}
```

**Response - Error:**
```json
{
  "success": false,
  "error": "לא ניתן לחלק באפס"
}
```

### Endpoint: GET /api/health

בדיקת תקינות השרת.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-19T21:22:58.000Z",
  "service": "Calculator Backend API"
}
```

## 🧪 בדיקת ה-API עם curl

```bash
# חיבור
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"num1": 15, "num2": 3, "operation": "add"}'

# כפל
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"num1": 7, "num2": 8, "operation": "multiply"}'

# חזקה
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"num1": 2, "num2": 10, "operation": "power"}'

# בדיקת תקינות
curl http://localhost:8080/api/health
```

## 📱 Frontend Features

- ✅ ממשק משתמש מעוצב ונוח
- ✅ בחירת פעולות חשבוניות בקליק
- ✅ תמיכה במקלדת (Enter לחישוב)
- ✅ הצגת תוצאות בזמן אמת
- ✅ טיפול בשגיאות וולידציות
- ✅ אנימציות וחוויית משתמש מעולה
- ✅ Responsive Design

## 🐳 Dockerfile - הסבר

```dockerfile
# Image בסיסי עם Node.js גרסה 20
FROM node:20-slim

# תיקיית עבודה בתוך הקונטיינר
WORKDIR /app

# העתקת קבצי dependencies
COPY package*.json ./

# התקנת dependencies
RUN npm install --production --silent

# העתקת קוד האפליקציה
COPY server.js ./
COPY public/ ./public/

# יצירת משתמש לא-root לאבטחה
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

# חשיפת פורט 8080
EXPOSE 8080

# משתני סביבה
ENV PORT=8080
ENV NODE_ENV=production

# Health check אוטומטי
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# הרצת השרת
CMD ["node", "server.js"]
```

### תכונות הדוקר:
- 🔒 **אבטחה**: משתמש לא-root
- 🏥 **Health Check**: בדיקה אוטומטית כל 30 שניות
- 📦 **Optimized**: שכבות מותאמות ל-cache
- 🚀 **Production Ready**: סביבת production

## 🌐 פריסה ל-Cloud

### Google Cloud Run
```bash
gcloud run deploy calculator-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### AWS ECS / Azure Container Instances
```bash
# בנה את ה-image
docker build -t calculator-app .

# תייג ודחוף ל-registry
docker tag calculator-app:latest <your-registry>/calculator-app:latest
docker push <your-registry>/calculator-app:latest
```

## 🔍 Logs וניטור

```bash
# צפייה בלוגים (כשהשרת רץ)
tail -f logs/app.log

# בדוקר
docker logs -f <container-id>
```

## 📊 כל חישוב נרשם ב-console

```
[2025-10-19T21:22:58.000Z] Calculation: 10 + 5 = 15
[2025-10-19T21:23:10.000Z] Calculation: 20 × 3 = 60
```

## 🎯 המשך פיתוח

כעת יש לך תשתית מוכנה עם:
- ✅ Frontend מעוצב ומקצועי
- ✅ Backend API פונקציונלי
- ✅ Dockerfile מוכן לפריסה
- ✅ מבנה ברור וניתן להרחבה

### הוספת תכונות נוספות:
1. **Database** - הוספת MongoDB/PostgreSQL לשמירת היסטוריית חישובים
2. **Authentication** - מערכת התחברות משתמשים
3. **Advanced Math** - פונקציות מתמטיות מורכבות (שורש, לוגריתם, טריגונומטריה)
4. **History** - שמירת היסטוריית חישובים למשתמש
5. **WebSocket** - עדכונים בזמן אמת
6. **Tests** - Jest/Mocha לבדיקות אוטומטיות

## 📝 סטטוס נוכחי

✅ Backend API - פועל ומחשב נכון  
✅ Frontend UI - מעוצב ופונקציונלי  
✅ Docker - מוכן לפריסה  
✅ Health Check - פעיל  
✅ Error Handling - מלא  

---

**נוצר ב-2025 | Backend מבוסס Node.js + Express | Frontend מבוסס Vanilla JS**
