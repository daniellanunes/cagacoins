import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import AppNavigator from "./src/navigation";

export default function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = auth().onAuthStateChanged((u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, []);

  if (!ready) return null;

  // ✅ Em vez de initialRouteName, passamos "isLogged"
  return <AppNavigator isLogged={!!user} />;
}
