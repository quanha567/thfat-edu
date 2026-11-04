import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import { env } from "./env";

let firebaseApp: App | null = null;

export function initializeFirebaseAdmin(): App {
  if (firebaseApp) {
    return firebaseApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    firebaseApp = existingApps[0];

    return firebaseApp;
  }

  if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY,
      }),
    });

    return firebaseApp;
  }

  if (env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccount = require(env.FIREBASE_SERVICE_ACCOUNT_PATH);
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });

    return firebaseApp;
  }

  try {
    firebaseApp = initializeApp({
      credential: applicationDefault(),
    });

    return firebaseApp;
  } catch {
    firebaseApp = initializeApp({
      projectId: "thfat-edu-dev",
    });

    return firebaseApp;
  }
}

export type TDecodedToken = {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
};

export async function verifyFirebaseIdToken(idToken: string): Promise<TDecodedToken> {
  if (env.NODE_ENV !== "production" && idToken.startsWith("mock-token:")) {
    const email = idToken.replace("mock-token:", "").trim();

    return {
      uid: `mock-uid-${email}`,
      email,
      name: email.split("@")[0] ?? "Mock User",
    };
  }

  const app = initializeFirebaseAdmin();
  const auth = getAuth(app);
  const decoded = await auth.verifyIdToken(idToken);

  if (!decoded.email) {
    throw new Error("FIREBASE_TOKEN_MISSING_EMAIL: Token does not contain an email address.");
  }

  return {
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name,
    picture: decoded.picture,
  };
}
