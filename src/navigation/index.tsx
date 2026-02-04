import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/Register";

import SetupScreen from "../screens/Setup";
import HomeScreen from "../screens/Home";
import HistoryScreen from "../screens/History";
import ProfileScreen from "../screens/Profile";
import SessionDetail from "../screens/SessionDetail";


const Stack = createNativeStackNavigator();

/**
 * Stack de autenticação (usuário NÃO logado)
 */
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Entrar" }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Criar conta" }}
      />
    </Stack.Navigator>
  );
}

/**
 * Stack principal (usuário LOGADO)
 */
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "CagaCoins" }}
      />

      <Stack.Screen
        name="Setup"
        component={SetupScreen}
        options={{ title: "Configurar" }}
      />
      
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Histórico" }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />

      <Stack.Screen
        name="SessionDetail"
        component={SessionDetail}
      />
      
    </Stack.Navigator>
  );
}

/**
 * Navigator raiz
 */
export default function AppNavigator({ isLogged }: { isLogged: boolean }) {
  return (
    <NavigationContainer>
      {isLogged ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
