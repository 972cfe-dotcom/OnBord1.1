# 🚀 הוראות הגדרה - Hello World עם Google Cloud

## ✅ מה כבר נעשה?

הקוד שלך מוכן ומועלה ל-GitHub! האתר עובד מצוין ובדוק.

## 🔧 צעדים נוספים להשלמת ההגדרה

### שלב 1: הוספת GitHub Actions Workflow (ידנית)

מכיוון שיש הגבלת הרשאות, יש להוסיף את קובץ ה-workflow ידנית:

1. **גש ל-GitHub Repository שלך:**
   https://github.com/972cfe-dotcom/OnBord1.1

2. **צור את התיקייה `.github/workflows`:**
   - לחץ על "Add file" > "Create new file"
   - שם הקובץ: `.github/workflows/deploy.yml`

3. **העתק את התוכן הבא לקובץ:**

\`\`\`yaml
name: Deploy to Google Cloud

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to Google App Engine
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --production
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: \${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          project_id: \${{ secrets.GCP_PROJECT_ID }}
      
      - name: Deploy to App Engine
        run: |
          gcloud app deploy app.yaml --quiet --promote --stop-previous-version
      
      - name: Deployment Success
        run: |
          echo "✅ Deployment completed successfully!"
          echo "🌐 Your app is live at: https://\${{ secrets.GCP_PROJECT_ID }}.appspot.com"
\`\`\`

4. **Commit הקובץ**

### שלב 2: הגדרת Google Cloud Project

#### 2.1 צור פרויקט חדש

1. גש ל-[Google Cloud Console](https://console.cloud.google.com)
2. לחץ על "Select a project" > "New Project"
3. תן שם לפרויקט (למשל: "hello-world-app")
4. שמור את **PROJECT_ID** (יופיע אוטומטית)

#### 2.2 הפעל את Google App Engine

פתח את Cloud Shell ב-Google Cloud Console והרץ:

\`\`\`bash
# החלף YOUR_PROJECT_ID עם ה-ID שקיבלת
gcloud config set project YOUR_PROJECT_ID

# הפעל App Engine (בחר region, מומלץ: us-central)
gcloud app create --region=us-central
\`\`\`

#### 2.3 צור Service Account

\`\`\`bash
# צור service account
gcloud iam service-accounts create github-actions \\
  --display-name="GitHub Actions Deployment"

# קבל את ה-PROJECT_ID
PROJECT_ID=$(gcloud config get-value project)

# הוסף הרשאות
gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \\
  --role="roles/appengine.appAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \\
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \\
  --role="roles/cloudbuild.builds.editor"

gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \\
  --role="roles/storage.admin"

# צור מפתח JSON
gcloud iam service-accounts keys create ~/gcloud-key.json \\
  --iam-account=github-actions@${PROJECT_ID}.iam.gserviceaccount.com

# הצג את תוכן הקובץ (תצטרך להעתיק את זה)
cat ~/gcloud-key.json
\`\`\`

### שלב 3: הגדרת GitHub Secrets

1. **גש ל-Repository Settings:**
   https://github.com/972cfe-dotcom/OnBord1.1/settings/secrets/actions

2. **הוסף Secret חדש - GCP_PROJECT_ID:**
   - לחץ "New repository secret"
   - Name: `GCP_PROJECT_ID`
   - Value: ה-PROJECT_ID שלך מ-Google Cloud
   - לחץ "Add secret"

3. **הוסף Secret חדש - GCP_SA_KEY:**
   - לחץ "New repository secret"
   - Name: `GCP_SA_KEY`
   - Value: העתק את **כל התוכן** של הקובץ `gcloud-key.json`
   - לחץ "Add secret"

### שלב 4: בדיקה ופריסה

לאחר שהוספת את ה-secrets:

1. **עשה שינוי קטן בקוד** (למשל, ערוך את `server.js`)
2. **Commit ו-Push:**
   \`\`\`bash
   git add .
   git commit -m "test: trigger deployment"
   git push
   \`\`\`

3. **עקוב אחרי ה-Deployment:**
   - גש ל-Actions tab: https://github.com/972cfe-dotcom/OnBord1.1/actions
   - תראי את ה-workflow רץ
   - לאחר כ-5-10 דקות, האתר יהיה באוויר!

4. **גש לאתר שלך:**
   - `https://YOUR_PROJECT_ID.appspot.com`

## 🎉 זהו! האתר שלך יהיה באוויר

מעכשיו, כל פעם שתעשי `git push`, האתר יתעדכן אוטומטית!

## 🔍 פקודות שימושיות

### הרצה מקומית
\`\`\`bash
npm install
npm start
\`\`\`

### בדיקת logs ב-Google Cloud
\`\`\`bash
gcloud app logs tail -s default
\`\`\`

### פריסה ידנית (בלי GitHub Actions)
\`\`\`bash
gcloud app deploy
\`\`\`

## 🆘 עזרה

אם משהו לא עובד:
1. בדקי את GitHub Actions logs
2. בדקי את Google Cloud logs
3. ודאי שכל ה-secrets הוגדרו נכון

---

**🚀 בהצלחה! האתר שלך עומד להיות באוויר!**
