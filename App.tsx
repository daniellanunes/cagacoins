import React, { useState, useEffect } from 'react';
import { StatusBar, Platform, PermissionsAndroid, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import RNBootSplash from "react-native-bootsplash";
// Usando a importação nova para não ter erro no console
import { getAuth, onAuthStateChanged, FirebaseAuthTypes } from "@react-native-firebase/auth";
import messaging from '@react-native-firebase/messaging';

import AppNavigator from "./src/navigation";
import SplashAnimation from "./src/components/SplashAnimation";
import { TimerProvider } from "./src/context/TimerContext";
import { UpdateModal } from "./src/components/ModalUpdate";

export default function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        }
      } else {
        // ✅ Gatilho para iOS (Firebase Messaging)
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Permissão de notificação concedida no iOS');
        }
      }
    };

  requestPermission();

    const auth = getAuth();
    
    // Voltando exatamente para a sua lógica original:
  const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      
      const prepareApp = async () => {
        // Primeiro: Preparamos o React para mostrar a SplashAnimation
        setLoading(false);
        setShowAnimation(true);

        // Segundo: Damos um micro-delay para o React renderizar
        setTimeout(async () => {
          try {
            // Terceiro: Removemos a "capa" nativa para revelar a animação JS
            await RNBootSplash.hide({ fade: true });
          } catch (e) {
            console.log("Erro ao esconder splash nativo");
          }
        }, 100); 
      };
      
      prepareApp();
    });

    return unsub;
  }, []);

  const renderContent = () => {
    // Voltando ao seu 'return null' original para não ter o ActivityIndicator no meio
    if (loading) return null;
    
    if (showAnimation && !animationFinished) {
      return <SplashAnimation onFinish={() => setAnimationFinished(true)} />;
    }

    return <AppContent user={user} />;
  };

  return (
    <SafeAreaProvider>
      <TimerProvider>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor="#fff5eb" 
          translucent={true} 
        /> 
        <UpdateModal />       
        {renderContent()}
      </TimerProvider>
    </SafeAreaProvider>
  );
}

function AppContent({ user }: { user: FirebaseAuthTypes.User | null }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#fff5eb',
      paddingTop: insets.top,
      paddingBottom: insets.bottom 
    }}>
      <AppNavigator isLogged={!!user} />
    </View>
  );
}