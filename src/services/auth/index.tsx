import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// ✅ Atualizado: Adicionado campos da loja e moedas
export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  totalCoins: number;
  inventory: string[];
  equipped: {
    glasses: boolean;
    chain: boolean;
    pet: boolean;
    privada: boolean; // Adicionado
    clock: boolean;   // Adicionado
  };
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
    // ✅ ATUALIZADO: Agora o set inclui a estrutura da loja
    await withTimeout(
      firestore().collection("users").doc(uid).set({
        uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        totalCoins: 0, // Começa com zero moedas
        inventory: [], // Inventário vazio
        equipped: {
          glasses: false, // Nada equipado por padrão
          chain: false,
          pet: false,
        },
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

// ... restante das funções (loginWithEmail, getProfile, logout, deleteAccount) permanecem iguais
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

export async function logout() {
  await auth().signOut();
}

export async function deleteAccountCompletely() {
  const user = auth().currentUser;
  if (!user) throw new Error("NO_USER_LOGGED");

  const uid = user.uid;

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

  try {
    await firestore().collection("users").doc(uid).delete();
  } catch (err: any) {
    console.log("DELETE USER DOC ERROR =>", err?.code, err?.message, err);
  }

  try {
    await user.delete();
  } catch (err: any) {
    console.log("AUTH DELETE ERROR =>", err?.code, err?.message, err);
    throw err;
  }
}