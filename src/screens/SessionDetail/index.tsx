import React from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { formatBRL } from "../../utils/money";

import {
  Container,
  Title,
  Label,
  Value,
  Card,
  BackButton,
  HeaderBar,
  HeaderTitle
} from "./styles";

type RouteProps = RouteProp<RootStackParamList, "SessionDetail">;

export default function SessionDetail() {
  const { params } = useRoute<RouteProps>();
  const navigation = useNavigation<any>();

  const { session } = params;

  const start = session.startAt?.toDate?.();
  const end = session.endAt?.toDate?.();

  return (
    <Container>
      <HeaderBar>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="chevron-left" size={18} color="#111" />
        </BackButton>

        <HeaderTitle>Detalhes da Sessão 💩🪙</HeaderTitle>
      </HeaderBar>

      <Card>
        <Label>Data</Label>
        <Value>{start?.toLocaleDateString()}</Value>

        <Label>Início</Label>
        <Value>{start?.toLocaleTimeString()}</Value>

        <Label>Fim</Label>
        <Value>{end?.toLocaleTimeString()}</Value>

        <Label>Duração</Label>
        <Value>{session.durationSec}s</Value>

        <Label>Valor</Label>
        <Value>{formatBRL(session.moneyEarned)}</Value>

        <Label>Moedas</Label>
        <Value>{session.coinsEarned} CC</Value>
      </Card>
    </Container>
  );
}
