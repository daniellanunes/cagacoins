/**
 * Profile Screen:
 * - Busca dados do usuário em /users/{uid} no Firestore
 * - Mostra nome, email, telefone
 * - Botão Sair (logoff)
 * - Botão Excluir conta (deleta Firestore + Auth)
 */

import React, { useEffect, useState } from "react";
import { Alert, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { getProfile, logout, deleteAccountCompletely, UserProfile } from "../../services/auth";
import {
  Container,
  Title,
  Card,
  Label,
  Value,
  Button,
  ButtonText,
  SecondaryButton,
  SecondaryButtonText,
  Hint,
  BackButton,
  HeaderBar,
  HeaderTitle,
} from "./styles";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigation = useNavigation<any>();


  /**
   * Carrega o perfil assim que a tela abre
   */
  useEffect(() => {
    (async () => {
      try {
        const user = auth().currentUser;

        // Se não tiver user, não deveria estar nessa tela
        if (!user) {
          setProfile(null);
          return;
        }

        // Busca profile no Firestore
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

  /**
   * Logout simples
   */
  const onLogout = async () => {
    try {
      await logout();
    } finally {
      // ✅ força voltar pro Login (mesmo se listener falhar)
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    }
  };

  /**
   * Exclusão de conta com confirmação
   */
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

              await deleteAccountCompletely();

              // ✅ garante que sai do app mesmo se delete no Auth falhar parcialmente
              try {
                await logout();
              } catch {}

              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            } catch (e: any) {
              console.log("DELETE ACCOUNT ERROR =>", e?.code, e?.message, e);

              if (String(e?.code || "").includes("auth/requires-recent-login")) {
                Alert.alert(
                  "Precisa confirmar o login",
                  "Por segurança, faça login novamente e tente excluir a conta de novo."
                );
              } else {
                Alert.alert("Erro", "Não foi possível excluir a conta. Tente novamente.");
              }
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
      <Hint>
       
      </Hint>
      {/* ✅ Botão Sair */}
      <SecondaryButton onPress={onLogout}>
        <SecondaryButtonText>Sair da conta</SecondaryButtonText>
      </SecondaryButton>

      {/* ✅ Botão Excluir */}
      <Button variant="danger" onPress={onDeleteAccount}>
        <ButtonText>Excluir conta</ButtonText>
      </Button>


    </Container>
  );
}
