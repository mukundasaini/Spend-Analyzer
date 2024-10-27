# Spend-Analyzer
 Spend Analyzer Ionic App is for keep track on dialy expenses and know about your spend flow.  
 
* Features
* Home (Expense) Tab
* Settings Tab
* Analytics Tab

** Settings Tab
-*- Add or Update card
-*- Add or Update category
-*- Filter card or category

** Home Tab
-*- Displasys current month transactions
-*- Add Or Update transaction
-*- Filter transactions
-*- Filters has include or exclude, year, month, cards and categories selection options
-*- Transaction has EMI, note and include or exclude options

** Analytics Tab
-*- Card wise pie chart with percentage and amount
-*- category wise bar chart 
-*- Show tansactions card wise and category wise

 * Update Fire Store Credentials
 Open src\environments\environment.ts
 
 export const environment = {
 production: false,
 firebase: {
   apiKey: "YOUR_API_KEY",
   authDomain: "YOUR_AUTH_DOMAIN",
   databaseURL: "YOUR_DATABASE_URL",
   projectId: "YOUR_PROJECT_ID",
   storageBucket: "YOUR_STORAGE_BUCKET",
   messagingSenderId: "YOUR_SENDER_ID"
 }
};

https://support.google.com/appsheet/answer/10104995?hl=en follow this link for create project in firebase with your google crendentials

* Run follwing commond for project running in local

1. npm install 

2. ionic build

3. ionic serve

** Android 

1. npx cap add android

2. npx cap sync android

Note: Andoird folder will create in roo folder

3. Open Android studio and open Android project in root folder

4. Go to Build Menu in Andoird studio > Select build APK

5. Copy .apk file in phone and install it




