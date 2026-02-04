import React, { useEffect, useState } from "react";
import { Alert, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import {
  getProfile,
  logout,
  deleteAccountCompletely,
  UserProfile,
} from "../../services/auth";

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

  /** ✅ Botão Sair: só desloga e vai pro Login */
  const onLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } finally {
      setLoading(false);
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    }
  };

  /** ✅ Botão Excluir: exclui e só então manda pro Login */
  const onDeleteAccount = () => {
    Alert.alert(
      "Excluir conta",
      "Isso vai apagar sua conta e seus dados. Essa ação não pode ser desfeita. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              // ✅ tenta deletar Firestore + Auth
              await deleteAccountCompletely();

              // ✅ agora sim desloga (opcional, mas ajuda o app a resetar tudo)
              try {
                await logout();
              } catch {}

              // ✅ vai pro Login
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });

              Alert.alert("Conta excluída", "Sua conta e histórico foram removidos.");
            } catch (e: any) {
              console.log("DELETE ACCOUNT ERROR =>", e?.code, e?.message, e);

              if (e?.code === "auth/requires-recent-login") {
                Alert.alert(
                  "Precisa confirmar o login",
                  "Por segurança, faça login novamente e tente excluir de novo."
                );
                return;
              }

              Alert.alert("Erro", "Não foi possível excluir a conta. Tente novamente.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <Container style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
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

      {/* ✅ Sair */}
      <SecondaryButton onPress={onLogout}>
        <SecondaryButtonText>Sair da conta</SecondaryButtonText>
      </SecondaryButton>

      {/* ✅ Excluir */}
      <Button variant="danger" onPress={onDeleteAccount}>
        <ButtonText>Excluir conta</ButtonText>
      </Button>
    </Container>
  );
}
