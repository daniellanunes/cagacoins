import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import {
  getProfile,
  logout,
  deleteAccountCompletely,
  UserProfile,
} from "../../services/auth";

import CustomModal from "../../components/CustomModal";

import {
  Container,
  Card,
  Label,
  Value,
  Button,
  ButtonText,
  SecondaryButton,
  SecondaryButtonText,
  BackButton,
  HeaderBar,
  HeaderTitle,
} from "./styles";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigation = useNavigation<any>();

  // ✅ Estado unificado para o CustomModal
  const [modal, setModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "info" | "confirm" | "danger";
    onConfirm?: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const hideModal = () => setModal((prev) => ({ ...prev, visible: false }));

  const showModal = (
    title: string,
    message: string,
    type: "info" | "confirm" | "danger" = "info",
    onConfirm?: () => void
  ) => {
    setModal({ visible: true, title, message, type, onConfirm });
  };

  useEffect(() => {
    (async () => {
      try {
        const user = auth().currentUser;

        if (!user) {
          setProfile(null);
          return;
        }

        const p = await getProfile(user.uid);
        setProfile(
          p ?? {
            uid: user.uid,
            name: "(Sem nome)",
            email: user.email ?? "(Sem email)",
            phone: "(Sem telefone)",
          }
        );
      } catch (e: any) {
        console.log("LOAD PROFILE ERROR =>", e?.code, e?.message, e);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /** ✅ Sair da conta */
  const onLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (e) {
      showModal("Erro", "Não foi possível sair da conta.");
    } finally {
      setLoading(false);
    }
  };

  /** ✅ Execução real da exclusão */
  const executeDelete = async () => {
    hideModal();
    setLoading(true);
    try {
      // 1. Tenta deletar Firestore + Auth
      await deleteAccountCompletely();

      // 2. Tenta deslogar para limpar estado do app
      try {
        await logout();
      } catch {}

      // 3. Reset de navegação
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (e: any) {
      console.log("DELETE ACCOUNT ERROR =>", e?.code, e?.message, e);

      if (e?.code === "auth/requires-recent-login") {
        showModal(
          "Precisa confirmar o login",
          "Por segurança, faça login novamente e tente excluir de novo.",
          "info"
        );
      } else {
        showModal("Erro", "Não foi possível excluir a conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  /** ✅ Gatilho do Modal de Exclusão */
  const onDeleteAccount = () => {
    showModal(
      "Excluir conta",
      "Isso vai apagar sua conta e seus dados. Essa ação não pode ser desfeita. Deseja continuar?",
      "danger",
      executeDelete
    );
  };

  if (loading) {
    return (
      <Container style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#3B2416" />
      </Container>
    );
  }

  return (
    <Container>
      <HeaderBar>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="chevron-left" size={20} color="#3B2416" />
        </BackButton>

        <HeaderTitle>Seu perfil 💩</HeaderTitle>
      </HeaderBar>

      <Card>
        <Label>Nome</Label>
        <Value>{profile?.name ?? "-"}</Value>

        <Label>Email</Label>
        <Value>{profile?.email ?? "-"}</Value>

        <Label>Telefone</Label>
        <Value>{profile?.phone ?? "-"}</Value>
      </Card>

      <SecondaryButton onPress={onLogout}>
        <SecondaryButtonText>Sair da conta</SecondaryButtonText>
      </SecondaryButton>

      <Button variant="danger" onPress={onDeleteAccount}>
        <ButtonText>Excluir conta</ButtonText>
      </Button>

      {/* ✅ Componente de Modal Único */}
      <CustomModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={hideModal}
        onConfirm={modal.onConfirm}
      />
    </Container>
  );
}