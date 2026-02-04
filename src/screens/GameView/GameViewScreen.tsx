import React from "react";
import { WebView } from "react-native-webview";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { Container } from "../Home/styles";

type Props = NativeStackScreenProps<RootStackParamList, "GameView">;

export default function GameViewScreen({ route }: Props) {
  const { url } = route.params;

  return (
    <Container style={{ padding: 0 }}> 
      <WebView 
        source={{ uri: url }} 
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </Container>
  );
}