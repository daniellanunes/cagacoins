/**
 * Serviços relacionados ao Auth e Profile (Firestore).
 * - Cadastro e Login (Firebase Auth)
 * - Perfil do usuário (Firestore /users/{uid})
 * - Logout
 * - Exclusão de conta (Firestore + Auth)
 */

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: any;
};

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label = "timeout"
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(label)), ms);

    promise
      .then((v) => {
        clearTimeout(t);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(t);
        reject(e);
      });
  });
}

export async function registerWithEmail(params: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  const { name, email, phone, password } = params;

  const res = await withTimeout(
    auth().createUserWithEmailAndPassword(email.trim(), password),
    15000,
    "auth_timeout"
  );

  const uid = res.user.uid;

  try {
    await withTimeout(
      firestore().collection("users").doc(uid).set({
        uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      }),
      15000,
      "firestore_timeout"
    );
  } catch (err: any) {
    console.log("PROFILE SAVE FAILED =>", err?.code, err?.message, err);
  }

  return res.user;
}

export async function loginWithEmail(params: { email: string; password: string }) {
  const { email, password } = params;
  const res = await withTimeout(
    auth().signInWithEmailAndPassword(email.trim(), password),
    15000,
    "auth_timeout"
  );
  return res.user;
}

export async function getProfile(uid: string) {
  const snap = await firestore().collection("users").doc(uid).get();
  return snap.exists ? (snap.data() as UserProfile) : null;
}

/** ✅ Logout simples */
export async function logout() {
  await auth().signOut();
}

/**
 * ✅ Excluir conta completamente:
 * 1) deleta /users/{uid}/sessions (até 200)
 * 2) deleta /users/{uid}
 * 3) deleta usuário do Firebase Auth
 *
 * ⚠️ Importante:
 * - NÃO faz signOut aqui dentro.
 * - Se falhar, lança erro pra tela decidir o que fazer.
 */
export async function deleteAccountCompletely() {
  const user = auth().currentUser;
  if (!user) throw new Error("NO_USER_LOGGED");

  const uid = user.uid;

  // 1) sessions
  try {
    const sessionsSnap = await firestore()
      .collection("users")
      .doc(uid)
      .collection("sessions")
      .limit(200)
      .get();

    if (sessionsSnap.size > 0) {
      const batch = firestore().batch();
      sessionsSnap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  } catch (err: any) {
    console.log("DELETE SESSIONS ERROR =>", err?.code, err?.message, err);
  }

  // 2) doc principal
  try {
    await firestore().collection("users").doc(uid).delete();
  } catch (err: any) {
    console.log("DELETE USER DOC ERROR =>", err?.code, err?.message, err);
  }

  // 3) Auth delete (pode exigir login recente)
  try {
    await user.delete();
  } catch (err: any) {
    console.log("AUTH DELETE ERROR =>", err?.code, err?.message, err);
    throw err;
  }
}
