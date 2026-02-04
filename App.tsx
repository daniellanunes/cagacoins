import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import RNBootSplash from "react-native-bootsplash";

import AppNavigator from "./src/navigation";
import SplashAnimation from "./src/components/SplashAnimation";

export default function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true); // Carregamento do Firebase
  const [showAnimation, setShowAnimation] = useState(false); // Controle da animação customizada
  const [animationFinished, setAnimationFinished] = useState(false); // Fim de tudo

  useEffect(() => {
    // Subscreve ao estado de autenticação do Firebase
    const unsub = auth().onAuthStateChanged((u) => {
      setUser(u);
      
      // Assim que o Firebase responder, escondemos o Bootsplash nativo
      // e iniciamos a nossa animação de transição
      const prepareApp = async () => {
        await RNBootSplash.hide({ fade: true });
        setLoading(false);
        setShowAnimation(true);
      };

      prepareApp();
    });

    return unsub;
  }, []);

  // 1. Enquanto o Firebase não responde, mantém a tela nativa (ou nula)
  if (loading) return null;

  // 2. Se o Firebase respondeu, mas a animação de queda ainda não acabou:
  if (showAnimation && !animationFinished) {
    return <SplashAnimation onFinish={() => setAnimationFinished(true)} />;
  }

  // 3. Após a animação, renderiza o Navigator passando o estado de login
  return <AppNavigator isLogged={!!user} />;
}