/**
 * Serviços relacionados ao Auth e Profile (Firestore).
 * Aqui centralizamos:
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

/**
 * Utilitário: coloca timeout em uma Promise para evitar travamentos infinitos
 * (ex: conexão ruim / emulador travado).
 */
async function withTimeout<T>(promise: Promise<T>, ms: number, label = "timeout"): Promise<T> {
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

/**
 * ✅ Cadastro (Email/Senha) + salva perfil no Firestore.
 *
 * Importante:
 * - Primeiro cria no Auth (isso já cria o usuário no Firebase).
 * - Depois tenta salvar o perfil no Firestore.
 * - Se o Firestore falhar, NÃO bloqueia o cadastro (pra evitar ficar travado em "Criando...").
 */
export async function registerWithEmail(params: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  const { name, email, phone, password } = params;

  // 1) Cria usuário no Auth (com timeout)
  const res = await withTimeout(
    auth().createUserWithEmailAndPassword(email.trim(), password),
    15000,
    "auth_timeout"
  );

  const uid = res.user.uid;

  // 2) Tenta salvar perfil no Firestore (com timeout)
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
    // Não impede o usuário de continuar, mas loga pra debug
    console.log("PROFILE SAVE FAILED =>", err?.code, err?.message, err);
  }

  return res.user;
}

/**
 * ✅ Login (Email/Senha)
 */
export async function loginWithEmail(params: { email: string; password: string }) {
  const { email, password } = params;
  const res = await withTimeout(
    auth().signInWithEmailAndPassword(email.trim(), password),
    15000,
    "auth_timeout"
  );
  return res.user;
}

/**
 * ✅ Busca perfil em /users/{uid}
 */
export async function getProfile(uid: string) {
  const snap = await firestore().collection("users").doc(uid).get();
  return snap.exists ? (snap.data() as UserProfile) : null;
}

/**
 * ✅ Logout
 */
export async function logout() {
  await auth().signOut();
}

/**
 * ✅ Excluir conta completamente:
 * 1) deleta subcoleção /users/{uid}/sessions (até 200 docs - MVP)
 * 2) deleta doc /users/{uid}
 * 3) deleta usuário do Firebase Auth
 *
 * Observação:
 * - Pode falhar com auth/requires-recent-login (normal). Nesse caso peça pro user relogar e tentar de novo.
 */
export async function deleteAccountCompletely() {
  const user = auth().currentUser;
  if (!user) return;

  const uid = user.uid;

  // 1) Tenta deletar subcoleção sessions (se existir) - MVP: até 200 docs
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
    // Não bloqueia — seguimos
  }

  // 2) Deleta documento principal do usuário
  try {
    await firestore().collection("users").doc(uid).delete();
  } catch (err: any) {
    console.log("DELETE USER DOC ERROR =>", err?.code, err?.message, err);
    // Não bloqueia — seguimos
  }

// 3) Deleta usuário do Auth (pode exigir login recente)
  try {
    await user.delete();
  } catch (err: any) {
    console.log("AUTH DELETE ERROR =>", err?.code, err?.message, err);
    throw err; // 👈 importante pra você ver o erro na tela
  } finally {
    // mesmo se falhar, tenta deslogar localmente
    try { await auth().signOut(); } catch {}
  }

}
