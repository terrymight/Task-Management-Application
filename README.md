# Task Manager App (Angular + Firebase)
A modern task management application built with Angular (using Signals and Observables) and Firebase for authentication and real-time data storage. This app allows users to sign up, log in (via email/password or Google), and manage tasks with a clean, responsive UI.
Features

**User Authentication**: Sign up, log in, and log out using Firebase Authentication (email/password and Google sign-in).
Task Management: Create, view, and delete tasks stored in Firebase Firestore, with real-time updates.
Reactive State Management: Uses Angular Signals for local state and RxJS Observables for async Firebase operations.
Responsive Design: Centered forms and task list with a clean, modern UI.
Secure Data: Firestore rules ensure tasks are accessible only to the authenticated user.

## Tech Stack

Frontend: Angular 17+ (Signals, Observables, Reactive Forms)
Backend: Firebase (Authentication, Firestore, Hosting)
Styling: Custom CSS for a responsive, centered layout
Dependencies: @angular/fire, firebase, rxjs

## Prerequisites

Node.js: Version 16 or later
Angular CLI: Install globally with npm install -g @angular/cli
Firebase Account: Create a project at console.firebase.google.com
Firebase CLI: Install with npm install -g firebase-tools

**Setup Instructions**
1. Clone the Repository
git clone <repository-url>
cd task-manager

2. Install Dependencies
npm install

3. Configure Firebase

In the Firebase Console, create a new project (e.g., TaskManager).
Enable Email/Password and Google sign-in methods in Authentication > Sign-in method.
Enable Firestore Database in test mode (update rules for production later).
Copy the Firebase configuration object from Project Settings.
Update src/environments/environment.ts and src/environments/environment.prod.ts with your Firebase config:export const environment = {
 ``` 
    production: false,
    firebase: {
        apiKey: "your-api-key",
        authDomain: "your-auth-domain",
        projectId: "your-project-id",
        storageBucket: "your-storage-bucket",
        messagingSenderId: "your-messaging-sender-id",
        appId: "your-app-id"
    }
    };
```



4. Run the App Locally
ng serve

Open http://localhost:4200 in your browser.
5. Deploy to Firebase Hosting

Log in to Firebase:firebase login


Initialize Firebase Hosting:firebase init hosting


Select your Firebase project.
Set the public directory to dist/task-manager.
Configure as a single-page app (answer Yes).


Build and deploy:ng build --prod
firebase deploy

Access the app at the provided Firebase URL (e.g., https://taskmanager.web.app).

**Project Structure**
task-manager/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── tasks/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── task.service.ts
│   │   ├── app-routing.module.ts
│   │   ├── app.module.ts
│   │   ├── app.component.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   ├── environment.prod.ts
├── firebase.json
├── angular.json
├── package.json
├── README.md

**Usage**

Sign Up/Login: Use the signup page to create an account or log in with email/password or Google.
Manage Tasks: On the tasks page, add new tasks, view your task list, and delete tasks. Tasks are stored in Firestore and updated in real-time.
Logout: Click the logout button to sign out and return to the login page.

**Security**

Firestore Rules: Ensure only authenticated users can access their tasks:rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}


Authorized Domains: Add localhost to Firebase Authentication’s authorized domains for local development.

**Troubleshooting**

**CORS Errors**: If you encounter CORS issues on localhost:4200:
Verify Firebase config in environment.ts.
Add localhost to authorized domains in Firebase Console.
Set up a proxy in proxy.conf.json (see below) and update angular.json:{
```
  "/api/*": {
    "target": "https://your-project-id.firebaseapp.com",
    "secure": true,
    "changeOrigin": true,
    "pathRewrite": { "^/api": "" }
  },
  "/firestore/*": {
    "target": "https://firestore.googleapis.com",
    "secure": true,
    "changeOrigin": true,
    "pathRewrite": { "^/firestore": "" }
  },
  "/auth/*": {
    "target": "https://identitytoolkit.googleapis.com",
    "secure": true,
    "changeOrigin": true,
    "pathRewrite": { "^/auth": "" }
  }
}
```




Dependencies: Ensure @angular/fire and firebase are up-to-date:npm install @angular/fire@latest firebase@latest



**Future Enhancements**

Add task editing functionality.
Implement real-time task updates with Firestore’s onSnapshot.
Enhance UI with a CSS framework (e.g., Tailwind, Bootstrap).
Add file uploads using Firebase Storage.

License
MIT License
