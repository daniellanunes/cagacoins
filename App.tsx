import React, { useState, useEffect } from 'react';
import { StatusBar, Platform, PermissionsAndroid } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RNBootSplash from "react-native-bootsplash";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

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
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      }
    };
    requestPermission();

    const unsub = auth().onAuthStateChanged((u) => {
      setUser(u);
      const prepareApp = async () => {
        await RNBootSplash.hide({ fade: true });
        setLoading(false);
        setShowAnimation(true);
      };
      prepareApp();
    });
    return unsub;
  }, []);

  const renderContent = () => {
    if (loading) return null;
    if (showAnimation && !animationFinished) {
      return <SplashAnimation onFinish={() => setAnimationFinished(true)} />;
    }
    return <AppNavigator isLogged={!!user} />;
  };

  return (
    <SafeAreaProvider>
      <TimerProvider>
        {/* Usando sua lógica funcional do outro projeto */}
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor="#fff5eb" 
          translucent={false} 
        /> 
        
        <UpdateModal />       
        
        {/* IMPORTANTE: Removi o SafeAreaView global daqui. 
           Isso vai resolver o problema do Header invadindo ou sobrando margem.
        */}
        {renderContent()}

      </TimerProvider>
    </SafeAreaProvider>
  );
}