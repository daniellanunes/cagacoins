/**
 * Tela Login:
 * - email/senha -> Firebase Auth
 * - ao logar: manda pro Setup ou Home (dependendo se já tem settings)
 */

import React, { useState } from "react";
import { Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/types";
import { loadSettings } from "../../storage/settings";
import { loginWithEmail, resetPassword } from "../../services/auth";

import { Container, Title, Label, Input, Button, ButtonText, Link, LinkText, ErrorText } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogin = async () => {
    try {
      setLoading(true);
      setError("");

      // 1) login no firebase
      await loginWithEmail({ email, password });

      // 2) decide pra onde vai: Setup (se não configurou) ou Home (se já configurou)
      const s = await loadSettings();
      navigation.reset({ index: 0, routes: [{ name: s ? "Home" : "Setup" }] });
    } catch (e: any) {
      // mensagens mais amigáveis
      const code = e?.code || "";
      if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password")) {
        setError("Email ou senha inválidos.");
      } else if (code.includes("auth/invalid-email")) {
        setError("Email inválido.");
      } else if (code.includes("auth/user-not-found")) {
        setError("Usuário não encontrado.");
      } else {
        setError("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onForgot = async () => {
    if (!email.trim()) {
      Alert.alert("Recuperar senha", "Digite seu email primeiro.");
      return;
    }
    try {
      await resetPassword(email);
      Alert.alert("Recuperar senha", "Enviei um email para redefinir sua senha.");
    } catch {
      Alert.alert("Recuperar senha", "Não consegui enviar o email. Verifique o endereço.");
    }
  };

  return (
    <Container>
      <Title>Sejam Bem-Vindos</Title>

      <Label>Email</Label>
      <Input
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="seuemail@exemplo.com"
      />

      <Label>Senha</Label>
      <Input value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />

      {!!error && <ErrorText>{error}</ErrorText>}

      <Button onPress={onLogin} disabled={loading}>
        <ButtonText>{loading ? "Entrando..." : "Entrar"}</ButtonText>
      </Button>

      <Link onPress={onForgot}>
        <LinkText>Esqueci minha senha</LinkText>
      </Link>

      <Link onPress={() => navigation.navigate("Register")}>
        <LinkText>Criar conta</LinkText>
      </Link>
    </Container>
  );
}
