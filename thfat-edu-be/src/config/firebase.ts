import { readFileSync } from "node:fs";

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
    const serviceAccount = JSON.parse(
      readFileSync(env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf-8"),
    ) as Record<string, string>;
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

export type TCreateFirebaseUserOptions = {
  email: string;
  password?: string;
  displayName?: string;
  photoUrl?: string;
};

export async function createFirebaseUser({
  email,
  password,
  displayName,
  photoUrl,
}: TCreateFirebaseUserOptions): Promise<{ uid: string }> {
  const app = initializeFirebaseAdmin();
  const auth = getAuth(app);

  const userRecord = await auth.createUser({
    email,
    password: password || undefined,
    displayName: displayName || undefined,
    photoURL: photoUrl || undefined,
  });

  return { uid: userRecord.uid };
}

export type TUpdateFirebaseUserOptions = {
  uid: string;
  email?: string;
  password?: string;
  displayName?: string;
  photoUrl?: string;
  disabled?: boolean;
};

export async function updateFirebaseUser({
  uid,
  email,
  password,
  displayName,
  photoUrl,
  disabled,
}: TUpdateFirebaseUserOptions): Promise<void> {
  const app = initializeFirebaseAdmin();
  const auth = getAuth(app);

  await auth.updateUser(uid, {
    ...(email ? { email } : {}),
    ...(password ? { password } : {}),
    ...(displayName ? { displayName } : {}),
    ...(photoUrl !== undefined ? { photoURL: photoUrl } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
  });
}

export async function generateFirebasePasswordResetLink(email: string): Promise<string> {
  const app = initializeFirebaseAdmin();
  const auth = getAuth(app);

  const link = await auth.generatePasswordResetLink(email);

  return link;
}

export async function revokeFirebaseUserSessions(uid: string): Promise<void> {
  const app = initializeFirebaseAdmin();
  const auth = getAuth(app);

  await auth.revokeRefreshTokens(uid);
}
