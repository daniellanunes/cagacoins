// Mudança crucial para resolver o erro ts(1259) da imagem
import * as React from "react"; 
import { useEffect, useState } from "react";
import { StatusBar, StyleSheet, PermissionsAndroid, Platform } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import RNBootSplash from "react-native-bootsplash";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import AppNavigator from "./src/navigation";
import SplashAnimation from "./src/components/SplashAnimation";
import { TimerProvider } from "./src/context/TimerContext";

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
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          {renderContent()}
        </SafeAreaView>
      </TimerProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE6", 
  },
});