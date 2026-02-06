import React, { useState } from "react";
import { Modal } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

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
  InputContainer,
  EyeButton,
} from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

// Remove formatação para salvar no banco
const normalizePhone = (raw: string) =>
  raw.replace(/\D/g, "");

// Aplica a máscara (XX) XXXXX-XXXX em tempo real
const maskPhone = (value: string) => {
  let r = value.replace(/\D/g, "");
  r = r.substring(0, 11);

  if (r.length > 10) {
    r = r.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (r.length > 6) {
    r = r.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (r.length > 2) {
    r = r.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else if (r.length > 0) {
    r = r.replace(/^(\d*)/, "($1");
  }
  return r;
};

// ✅ Modal Styled Components
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
  border: 2px solid #e0c3a0;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 900;
  color: #3B2416;
`;

const ModalText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #6d4c41;
  opacity: 0.85;
`;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Manipula a digitação do telefone com máscara
  const handlePhoneChange = (text: string) => {
    setPhone(maskPhone(text));
  };

  const validate = () => {
    if (name.trim().length < 2) return "Digite seu nome.";

    const digitsOnly = normalizePhone(phone);
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

      await registerWithEmail({
        name,
        email,
        phone: normalizePhone(phone), // Envia apenas números
        password,
      });

      setShowSuccess(true);
    } catch (e: any) {
      console.log("REGISTER ERROR =>", e?.code, e);
      const code = e?.code || "";
      if (code.includes("auth/email-already-in-use")) {
        setError("Esse email já está cadastrado.");
      } else if (code.includes("auth/invalid-email")) {
        setError("Email inválido.");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSuccessContinue = async () => {
    setShowSuccess(false);
    const s = await loadSettings();
    navigation.reset({ index: 0, routes: [{ name: s ? "Home" : "Setup" }] });
  };

  return (
    <Container>
      <Title>Criar conta</Title>

      <Label>Nome</Label>
        <InputContainer> 
          <Input value={name} onChangeText={setName} placeholder="Seu nome" />
        </InputContainer>

      <Label>Telefone</Label>
        <InputContainer> 
          <Input
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
        </InputContainer> 

      <Label>Email</Label>
        <InputContainer> 
          <Input
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="seuemail@exemplo.com"
          />
        </InputContainer> 

      <Label>Senha</Label>
      <InputContainer> 
        <Input
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholder="Mínimo 6 caracteres"
        />
        <EyeButton onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome5 
            name={showPassword ? "eye" : "eye-slash"} 
            size={18} 
            color="#7a4a2e" 
          />
        </EyeButton>
      </InputContainer>

      <Label>Confirmar senha</Label>
        <InputContainer> 
          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPasswordConfirm}
            placeholder="Repita a senha"
          />
          <EyeButton onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}>
            <FontAwesome5 
              name={showPasswordConfirm ? "eye" : "eye-slash"} 
              size={18} 
              color="#7a4a2e" 
            />
          </EyeButton>
        </InputContainer> 

      {!!error && <ErrorText>{error}</ErrorText>}

      <Button onPress={onRegister} disabled={loading}>
        <ButtonText>{loading ? "Criando..." : "Criar conta"}</ButtonText>
      </Button>

      <Link onPress={() => navigation.goBack()}>
        <LinkText>Voltar para login</LinkText>
      </Link>

      <Modal visible={showSuccess} transparent animationType="fade">
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>Conta criada! 🎉</ModalTitle>
            <ModalText>
              Seu cadastro foi realizado com sucesso no Cagacoins. Vamos continuar!
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