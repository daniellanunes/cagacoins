import React from "react";
import { FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { RootStackParamList } from "../../navigation/types";
import { GAMES_LIST } from "../../constants/games";

import {
  Container,
  FooterTitle, // Usando seu estilo de título
  FooterCard,  // Usando seu estilo de card
  RowTop,
  Left,
  TimeRange,
  Small,
} from "../Home/styles"; // Reaproveitando seus estilos

type Props = NativeStackScreenProps<RootStackParamList, "GameGallery">;

export default function GameGalleryScreen({ navigation }: Props) {
  return (
    <Container>
      <FooterTitle style={{ fontSize: 24, marginBottom: 20 }}>Escolha seu entretenimento 🎮</FooterTitle>
      
      <FlatList
        data={GAMES_LIST}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FooterCard 
            style={{ marginBottom: 12 }}
            onPress={() => navigation.navigate("GameView", { url: item.url, title: item.title })}
          >
            <RowTop>
              <Left style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                <FontAwesome5 name={item.icon} size={24} color="#7a4a2e" />
                <Left>
                  <TimeRange>{item.title}</TimeRange>
                  <Small>{item.description}</Small>
                </Left>
              </Left>
              <FontAwesome5 name="chevron-right" size={16} color="#e0c3a0" />
            </RowTop>
          </FooterCard>
        )}
      />
    </Container>
  );
}