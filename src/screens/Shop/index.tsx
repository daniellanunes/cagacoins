import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

import { UserProfile } from "../../services/auth";

import {
  Container,
  Header,
  Title,
  CoinContainer,
  CoinText,
  ItemList,
  Card,
  ItemImage,
  ItemInfo,
  ItemName,
  ItemPrice,
  ActionButton,
  ActionButtonText,
  BackButton
} from "./styles";

const SHOP_ITEMS = [
  { id: "glasses", name: "Óculos de Cria", price: 50, image: require("../../assets/glasses.png") },
  { id: "chain", name: "Correntão de Ouro", price: 300, image: require("../../assets/chain.png") },
  { id: "pet", name: "Mini Cocô Pet", price: 20, image: require("../../assets/pet.png") },
  { id: "privada", name: "Privada", price: 150, image: require("../../assets/privada.png") },
  { id: "clock", name: "Focado na Hora", price: 500, image: require("../../assets/clock.png") },
];

export default function ShopScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    // ✅ Este listener lê o documento principal do usuário onde salvamos o totalCoins
    const unsub = firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setProfile(doc.data() as UserProfile);
        }
        setLoading(false);
      }, (err) => {
        console.log("ERRO AO BUSCAR PERFIL NA LOJA =>", err);
        setLoading(false);
      });

    return () => unsub();
  }, []);

  const handleAction = async (item: typeof SHOP_ITEMS[0]) => {
    if (!profile) return;

    const userRef = firestore().collection("users").doc(profile.uid);
    
    // Garantimos que inventory e equipped não venham undefined
    const inventory = profile.inventory || [];
    const equipped = profile.equipped || { glasses: false, chain: false, pet: false };
    
    const isOwned = inventory.includes(item.id);
    const isEquipped = equipped[item.id as keyof typeof equipped];

    if (isOwned) {
      // ✅ Alternar Equipar/Desequipar
      try {
        await userRef.update({
          [`equipped.${item.id}`]: !isEquipped
        });
      } catch (e) {
        Alert.alert("Erro", "Não foi possível mudar o item.");
      }
    } else {
      // 🛒 Tentar comprar - Usando profile.totalCoins que vem do banco
      if ((profile.totalCoins || 0) < item.price) {
        Alert.alert("Saldo Insuficiente", "Você precisa de mais CC🪙! Continue reinando para ganhar mais.");
        return;
      }

      try {
        await userRef.update({
          totalCoins: firestore.FieldValue.increment(-item.price),
          inventory: firestore.FieldValue.arrayUnion(item.id)
        });
        // O onSnapshot vai atualizar a tela sozinho!
      } catch (e) {
        Alert.alert("Erro", "Falha na compra. Tente novamente.");
      }
    }
  };

  if (loading) {
    return (
      <Container style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B2416" />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color="#3B2416" />
        </BackButton>
        <Title>Loja de Itens</Title>
        <CoinContainer>
          <FontAwesome5 name="coins" size={20} color="#ffa500" />
          {/* ✅ Exibe o saldo sincronizado com a Home */}
          <CoinText>{profile?.totalCoins || 0} CC</CoinText>
        </CoinContainer>
      </Header>

      <ItemList
        data={SHOP_ITEMS}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => {
          const isOwned = profile?.inventory?.includes(item.id);
          const isEquipped = profile?.equipped?.[item.id as keyof typeof profile.equipped];

          return (
            <Card>
              <ItemImage source={item.image} resizeMode="contain" />
              <ItemInfo>
                <ItemName>{item.name}</ItemName>
                <ItemPrice>Preço: {item.price} CC🪙</ItemPrice>
              </ItemInfo>

              <ActionButton
                isOwned={isOwned}
                isEquipped={isEquipped}
                onPress={() => handleAction(item)}
              >
                <ActionButtonText>
                  {isEquipped ? "Remover" : (isOwned ? "Equipar" : "Comprar")}
                </ActionButtonText>
              </ActionButton>
            </Card>
          );
        }}
      />
    </Container>
  );
}