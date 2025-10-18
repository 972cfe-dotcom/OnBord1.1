# Hello World - Google Cloud Auto-Deploy

אתר Hello World עם פריסה אוטומטית ל-Google Cloud Run.

## ✨ תכונות

- 🚀 פריסה אוטומטית לכל push ל-GitHub
- ☁️ מתארח על Google Cloud App Engine
- 🎨 עיצוב מודרני ומרשים
- 📱 Responsive design

## 🛠️ הגדרת הפרויקט

### שלב 1: הגדרת Google Cloud

1. **צור פרויקט ב-Google Cloud Console:**
   - גש ל-https://console.cloud.google.com
   - צור פרויקט חדש או בחר קיים
   - שמור את PROJECT_ID

2. **הפעל את App Engine:**
   ```bash
   gcloud app create --region=us-central
   ```

3. **צור Service Account:**
   ```bash
   # צור service account
   gcloud iam service-accounts create github-actions \
     --display-name="GitHub Actions Deployment"
   
   # תן הרשאות
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/appengine.appAdmin"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/cloudbuild.builds.editor"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   
   # צור מפתח JSON
   gcloud iam service-accounts keys create gcloud-key.json \
     --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

### שלב 2: הגדרת GitHub Secrets

ב-GitHub repository שלך, גש ל-Settings > Secrets and variables > Actions, והוסף:

1. **GCP_PROJECT_ID**: ה-Project ID שלך מ-Google Cloud
2. **GCP_SA_KEY**: תוכן הקובץ `gcloud-key.json` (העתק את כל התוכן)

### שלב 3: דחיפה ל-GitHub

```bash
git add .
git commit -m "Initial commit with auto-deploy setup"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## 🚀 איך זה עובד?

1. **אוטומציה מלאה**: כל פעם שאת עושה `git push`, GitHub Actions מתחיל לעבוד
2. **בניה**: המערכת בונה את האפליקציה
3. **פריסה**: מעלה אוטומטית ל-Google Cloud
4. **באוויר**: האתר שלך חי תוך דקות!

## 📝 פקודות שימושיות

### התקנת dependencies
```bash
npm install
```

### הרצה מקומית
```bash
npm start
```

### פריסה ידנית (אופציונלי)
```bash
gcloud app deploy
```

## 🌐 גישה לאתר

לאחר הפריסה הראשונה, האתר שלך יהיה זמין ב:
- https://YOUR_PROJECT_ID.appspot.com

## 📊 ניטור

- **Google Cloud Console**: https://console.cloud.google.com
- **Logs**: `gcloud app logs tail -s default`
- **GitHub Actions**: בטאב Actions ב-repository שלך

## 🔧 התאמה אישית

- **שינוי התוכן**: ערוך את `server.js`
- **הגדרות פריסה**: ערוך את `app.yaml`
- **CI/CD**: ערוך את `.github/workflows/deploy.yml`

## ⚡ טיפים

- הפריסה הראשונה עשויה לקחת 5-10 דקות
- פריסות עוקבות יהיו מהירות יותר (2-3 דקות)
- App Engine מתחיל עם tier חינמי

## 🆘 פתרון בעיות

### הפריסה נכשלת?
1. בדוק שהוספת את כל ה-secrets ב-GitHub
2. ודא שהפעלת את App Engine בפרויקט
3. בדוק את הלוגים ב-GitHub Actions

### האתר לא עולה?
1. בדוק logs: `gcloud app logs tail -s default`
2. ודא שה-port הוא 8080 (Google Cloud מחפש את זה)

---

**נוצר עם ❤️ לפריסה אוטומטית ל-Google Cloud**
