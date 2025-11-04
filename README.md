# Intervue: The AI-Powered Mock Interview Platform



Intervue is a smart web application built with **Next.js** and **Firebase** designed to prepare users for technical interviews. It features an interactive **Vapi.ai voice agent** that acts as a preparer, collecting a user's desired interview parameters (job role, tech stack, etc.) and saving them to their **Firebase Firestore** profile.

This project uses a modern tech stack, including **Firebase Authentication (Email/Password)** for user management and **Vapi** for a seamless, voice-first user experience.

## ✨ Features

* **Firebase Authentication:** Secure user sign-up and login with Email & Password.
* **Firestore Database:** User interview preferences are saved to their profile in Firestore.
* **Interactive Voice Agent:** A voice-first UI powered by Vapi to gather interview requirements.
* **Dynamic Interview Setup:** The agent intelligently gathers the user's desired job role, experience level, interview type, and tech stack.
* **Real-time Call Status:** The UI dynamically updates to show the call's state (Connecting, Active, Ended).
* **Live Transcript:** Displays the final transcript from both the user and the assistant.

## 🛠️ Tech Stack

* **Frontend:** [Next.js](https://nextjs.org/) (React & TypeScript)
* **Backend:** [Next.js / Vercel Serverless Functions](https://vercel.com/docs/functions)
* **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
* **Authentication:** [Firebase Auth](https://firebase.google.com/docs/auth)
* **Voice AI:** [Vapi.ai](https://vapi.ai/) (`@vapi-ai/web` SDK)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)

---

## 🔁 Project Workflow

The core logic of this application is driven by a **Vapi Workflow** that connects your Next.js frontend to your Firebase backend.

1.  **Authentication (Next.js & Firebase):**
    * A user signs up or logs in using **Firebase Authentication**.
    * The app securely manages the user's session and gets their unique `userId` (Firebase `uid`).
    * The `userName` is retrieved from the user's Firebase Auth profile or a corresponding Firestore "users" document.

2.  **Call Initiation (Next.js Client):**
    * The user navigates to the interview page, which renders the `<Agent />` component.
    * The `userId` and `userName` are passed as props to `<Agent />`.
    * The user clicks the "Call" button, triggering the `handleCall` function.
    * `vapi.start()` is called, passing the `workflowId` and `variableValues` (including the `username` and `userid`).

3.  **Vapi Workflow (Vapi Server):**
    The call is now active, and Vapi's servers execute the "intervue_neo" workflow:
    * **Node 1: `introduction`**
        * The agent greets the user: "Hello, {{username}}! Let's prepare..."
    * **Node 2: `conversation` (Gather Info)**
        * The agent asks questions to extract variables: `role`, `type`, `level`, `techstack`, and `amount`.
    * **Node 3: `apiRequest` (Backend Call)**
        * Vapi's server makes a `POST` request to your backend API: `https://intervue-neo.vercel.app/api/vapi/generate`.
        * It sends a JSON body containing all collected variables, including the crucial `userid`.

4.  **Backend API (Next.js & Firebase Admin):**
    * Your `/api/vapi/generate` serverless function receives the `POST` request.
    * It initializes the **Firebase Admin SDK** (using server-side-only credentials).
    * It validates the incoming `userid`.
    * It writes the interview parameters (`role`, `techstack`, etc.) to a **Firestore document**, saving it under the user's profile (e.g., in a collection `users/{userid}/interviews`).
    * It returns a `200 OK` success response to Vapi.

5.  **Call Completion (Vapi & Next.js):**
    * Vapi receives the `200 OK` response.
    * **Node 4 & 5:** The agent thanks the user and hangs up.
    * On the client, the `vapi.on('call-end', ...)` listener fires, setting `callStatus` to `FINISHED` and redirecting the user.

---

## 🚀 Getting Started

Follow these instructions to get the project running locally.

### 1. Prerequisites

* `npm` (or `yarn`)
* A [Firebase](https://firebase.google.com/) account
* A [Vapi.ai](https://vapi.ai/) account

### 2. Firebase Setup

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Authentication:** Go to **Build > Authentication > Sign-in method** and enable the **Email/Password** provider.
3.  **Enable Database:** Go to **Build > Firestore Database** and create a new database. Start in **Test Mode** for easy local development.
4.  **Get Client-Side Keys:**
    * In your Project Overview, click **</>** to add a web app.
    * Register the app and copy the `firebaseConfig` object. You will need these keys for your `.env.local` file.
5.  **Get Server-Side Admin Keys (Service Account):**
    * Go to **Project Settings > Service accounts**.
    * Click **"Generate new private key"** and save the downloaded JSON file. You will use this for your backend environment variables.

### 3. Local Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/intervue-neo.git](https://github.com/your-username/intervue-neo.git)
    cd intervue-neo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a file named `.env.local` in the root of your project.

    > **Security Note:** The `FIREBASE_ADMIN_PRIVATE_KEY` must be formatted as a single-line string. You can use an online "JSON escape" tool or copy the key value from the JSON file and replace newlines `\n` with `\\n`.

    ```ini
    # .env.local

    # --- Vapi Keys ---
    # Get this from your Vapi Dashboard -> Account
    NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_...
    # Get this from your Vapi Dashboard -> Workflows
    NEXT_PUBLIC_VAPI_WORKFLOW_ID=wf_...

    # --- Firebase Client Keys (from firebaseConfig object) ---
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=1:..

    # --- Firebase Admin Keys (from downloaded service account JSON) ---
    FIREBASE_ADMIN_PROJECT_ID=your-project-id
    FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-...@your-project-id.iam.gserviceaccount.com
    FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...your_private_key...\\n-----END PRIVATE KEY-----\\n"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the result.