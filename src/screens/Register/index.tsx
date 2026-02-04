import React, { useState } from "react";
import { Modal } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/types";
import { loadSettings } from "../../storage/settings";
import { registerWithEmail } from "../../services/auth";

import {
  Container,
  Title,
  Label,
  Input,
  Button,
  ButtonText,
  ErrorText,
  Link,
  LinkText,
} from "./styles";
import styled from "styled-components/native";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const normalizePhone = (raw: string) =>
  raw.replace(/\s/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/-/g, "");

// ✅ Modal simples com styled-components (inline aqui só pra ficar fácil)
const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.6);
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalCard = styled.View`
  width: 100%;
  background-color: #fff;
  border-radius: 16px;
  padding: 18px;
  gap: 10px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 900;
  color: #111;
`;

const ModalText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #111;
  opacity: 0.85;
`;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    if (name.trim().length < 2) return "Digite seu nome.";

    const phoneNormalized = normalizePhone(phone);
    const digitsOnly = phoneNormalized.replace(/\D/g, "");
    if (digitsOnly.length < 10) return "Digite um telefone válido (com DDD).";

    if (!email.includes("@")) return "Digite um email válido.";

    if (password.length < 6) return "A senha precisa ter no mínimo 6 caracteres.";

    if (password !== confirmPassword) return "As senhas não conferem.";

    return null;
  };

  const onRegister = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ Cria conta (Auth) e tenta salvar perfil (Firestore)
      await registerWithEmail({
        name,
        email,
        phone: normalizePhone(phone),
        password,
      });

      // ✅ Mostra modal de sucesso
      setShowSuccess(true);
    } catch (e: any) {
      console.log("REGISTER ERROR =>", e?.code, e?.message, e);

      const code = e?.code || "";
      if (code.includes("auth/email-already-in-use")) {
        setError("Esse email já está cadastrado. Faça login.");
      } else if (code.includes("auth/invalid-email")) {
        setError("Email inválido.");
      } else if (code.includes("auth/weak-password")) {
        setError("Senha fraca. Use pelo menos 6 caracteres.");
      } else if (String(e?.message || "").includes("auth_timeout")) {
        setError("Cadastro demorou demais. Verifique sua internet e tente novamente.");
      } else {
        setError("Não foi possível criar sua conta. Tente novamente.");
      }
    } finally {
      // ✅ GARANTE que o botão destrava
      setLoading(false);
    }
  };

  const onSuccessContinue = async () => {
    setShowSuccess(false);

    // ✅ depois do cadastro, decide Setup ou Home
    const s = await loadSettings();
    navigation.reset({ index: 0, routes: [{ name: s ? "Home" : "Setup" }] });
  };

  return (
    <Container>
      <Title>Criar conta</Title>

      <Label>Nome</Label>
      <Input value={name} onChangeText={setName} placeholder="Seu nome" />

      <Label>Telefone</Label>
      <Input
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="(11) 99999-9999"
      />

      <Label>Email</Label>
      <Input
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="seuemail@exemplo.com"
      />

      <Label>Senha</Label>
      <Input
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="mínimo 6 caracteres"
      />

      <Label>Confirmar senha</Label>
      <Input
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="repita a senha"
      />

      {!!error && <ErrorText>{error}</ErrorText>}

      <Button onPress={onRegister} disabled={loading}>
        <ButtonText>{loading ? "Criando..." : "Criar conta"}</ButtonText>
      </Button>

      <Link onPress={() => navigation.goBack()}>
        <LinkText>Voltar para login</LinkText>
      </Link>

      {/* ✅ Modal de sucesso */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>Conta criada! 🎉</ModalTitle>
            <ModalText>
              Seu cadastro foi realizado com sucesso. Vamos continuar!
            </ModalText>

            <Button onPress={onSuccessContinue}>
              <ButtonText>Continuar</ButtonText>
            </Button>
          </ModalCard>
        </ModalBackdrop>
      </Modal>
    </Container>
  );
}
