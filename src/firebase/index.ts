import auth from "@react-native-firebase/auth";



export async function ensureAnonymousAuth() {
  const current = auth().currentUser;

  if (current) return current;
  
  const res = await auth().signInAnonymously();
  return res.user;
}