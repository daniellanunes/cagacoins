/**
 * History Screen (extrato):
 * - Lista sessões salvas em /users/{uid}/sessions
 * - Filtra por MÊS selecionado
 * - Mostra resumo mensal (tempo total + ganhos + moedas)
 * - Agrupa por DATA
 * - Mostra horário inicial e final + duração + valores
 * - Ao clicar no card: abre SessionDetail
 */

import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, SectionList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

import { formatBRL } from "../../utils/money";
import {
  Container,
  HeaderTitle,
  SectionHeader,
  SectionHeaderText,
  Card,
  RowTop,
  RowBottom,
  Left,
  Right,
  TimeRange,
  Small,
  Amount,
  Coins,
  EmptyText,
  HeaderBar,
  BackButton,
} from "./styles";

type SessionItem = {
  id: string;
  startAt?: any; // Firestore Timestamp
  endAt?: any; // Firestore Timestamp
  durationSec?: number;
  moneyEarned?: number;
  coinsEarned?: number;
  createdAt?: any;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDate(ts: any): Date | null {
  if (!ts) return new Date(); // Se for nulo (pendente), assume agora para não quebrar a lista
  if (ts instanceof firestore.Timestamp) return ts.toDate();
  if (typeof ts?.toDate === "function") return ts.toDate();
  if (ts.seconds) return new Date(ts.seconds * 1000);
  return null;
}

function formatHour(d: Date | null) {
  if (!d) return "--:--";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function formatDateHeader(d: Date) {
  // ex: 03/02/2026
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/**
 * Duração em "Xm Ys"
 */
function durationToText(sec?: number) {
  const s = Math.max(0, Math.floor(sec || 0));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}m ${ss}s`;
}

/**
 * "YYYY-MM" para filtrar mês
 */
function monthKeyFromDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Soma de segundos em "Xh Ym"
 */
function secondsToHM(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

/**
 * Move um monthKey (YYYY-MM) em +delta meses
 */
function shiftMonthKey(monthKey: string, deltaMonths: number) {
  const [yStr, mStr] = monthKey.split("-");
  const y = Number(yStr);
  const m = Number(mStr);

  // cria data no dia 1 e soma meses
  const d = new Date(y, (m || 1) - 1, 1);
  d.setMonth(d.getMonth() + deltaMonths);

  return monthKeyFromDate(d);
}

export default function HistoryScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SessionItem[]>([]);

  // ✅ mês selecionado (default: mês atual)
  const [selectedMonthKey, setSelectedMonthKey] = useState(() =>
    monthKeyFromDate(new Date())
  );

  /**
   * Listener realtime nas sessões
   */
  useEffect(() => {
    const user = auth().currentUser;

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const unsub = firestore()
      .collection("users")
      .doc(user.uid)
      .collection("sessions")
      .orderBy("createdAt", "desc")
      .limit(200)
      .onSnapshot(
        (snap) => {
          const list: SessionItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          }));

          setItems(list);
          setLoading(false);
        },
        (err) => {
          console.log("HISTORY SNAP ERROR =>", err?.code, err?.message, err);
          setLoading(false);
        }
      );

    return () => unsub();
  }, []);

  /**
   * ✅ Filtra itens para o mês selecionado
   */
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const start = toDate(it.startAt) || toDate(it.createdAt);
      if (!start) return false;
      return monthKeyFromDate(start) === selectedMonthKey;
    });
  }, [items, selectedMonthKey]);

  /**
   * ✅ Resumo mensal (tempo total + dinheiro + moedas) do mês selecionado
   */
  const monthlySummary = useMemo(() => {
    let totalSeconds = 0;
    let totalMoney = 0;
    let totalCoins = 0;

    filteredItems.forEach((it) => {
      totalSeconds += it.durationSec || 0;
      totalMoney += it.moneyEarned || 0;
      totalCoins += it.coinsEarned || 0;
    });

    return { totalSeconds, totalMoney, totalCoins };
  }, [filteredItems]);

  /**
   * ✅ Agrupa por DIA (apenas itens do mês filtrado)
   */
  const sections = useMemo(() => {
    const map = new Map<string, SessionItem[]>();

    filteredItems.forEach((it) => {
      const start = toDate(it.startAt) || toDate(it.createdAt) || new Date();
      const key = `${start.getFullYear()}-${pad2(start.getMonth() + 1)}-${pad2(
        start.getDate()
      )}`;

      const arr = map.get(key) || [];
      arr.push(it);
      map.set(key, arr);
    });

    const keys = Array.from(map.keys()).sort((a, b) => (a < b ? 1 : -1));

    return keys.map((k) => {
      const [y, m, d] = k.split("-").map(Number);
      const dateObj = new Date(y, (m || 1) - 1, d || 1);

      return {
        title: formatDateHeader(dateObj),
        data: map.get(k) || [],
      };
    });
  }, [filteredItems]);

  /**
   * ✅ Helpers UI do mês
   */
  const monthLabel = useMemo(() => {
    // "YYYY-MM" -> "MM/YYYY"
    const [y, m] = selectedMonthKey.split("-");
    return `${m}/${y}`;
  }, [selectedMonthKey]);

  const goPrevMonth = () => setSelectedMonthKey((k) => shiftMonthKey(k, -1));
  const goNextMonth = () => setSelectedMonthKey((k) => shiftMonthKey(k, +1));
  const goCurrentMonth = () => setSelectedMonthKey(monthKeyFromDate(new Date()));

  if (loading) {
    return (
      <Container style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </Container>
    );
  }

  return (
    <Container>
      {/* HEADER */}
      <HeaderBar>
        <BackButton onPress={() => navigation.goBack()}>
          {/* Verifique se a cor não está misturando com o fundo */}
          <FontAwesome5 name="chevron-left" size={20} color="#3B2416" />
        </BackButton> 

        <HeaderTitle>Histórico 💩🪙</HeaderTitle>
      </HeaderBar>

      {/* ✅ RESUMO MENSAL + FILTRO DE MÊS */}
      <Card style={{ marginBottom: 14 }}>
        <RowTop>
          <Left>
            <TimeRange>Mês: {monthLabel}</TimeRange>
            <Small>Tempo total: {secondsToHM(monthlySummary.totalSeconds)}</Small>
          </Left>

          <Right>
            <Amount>{formatBRL(monthlySummary.totalMoney)}</Amount>
            <Coins>+{Math.round(monthlySummary.totalCoins)} CC</Coins>
          </Right>
        </RowTop>

        <RowBottom style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={goPrevMonth}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e0c3a0",
              backgroundColor: "#fff",
            }}
          >
            <Small>← Anterior</Small>
          </Pressable>

          <Pressable
            onPress={goCurrentMonth}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e0c3a0",
              backgroundColor: "#fff",
            }}
          >
            <Small>Mês atual</Small>
          </Pressable>

          <Pressable
            onPress={goNextMonth}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e0c3a0",
              backgroundColor: "#fff",
            }}
          >
            <Small>Próximo →</Small>
          </Pressable>
        </RowBottom>
      </Card>

      {/* LISTA */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <EmptyText>Sem sessões nesse mês. Sente no trono 👑</EmptyText>
        }
        renderSectionHeader={({ section }) => (
          <SectionHeader>
            <SectionHeaderText>{section.title}</SectionHeaderText>
          </SectionHeader>
        )}
        renderItem={({ item }) => {
          const start = toDate(item.startAt);
          const end = toDate(item.endAt);

          const startStr = formatHour(start);
          const endStr = formatHour(end);

          const dur = durationToText(item.durationSec);

          const money = formatBRL(item.moneyEarned || 0);
          const coins = Math.round(item.coinsEarned || 0);

          return (
            <Card
              as={Pressable}
              onPress={() =>
                navigation.navigate("SessionDetail", { session: item })
              }
            >
              <RowTop>
                <Left>
                  <TimeRange>
                    {startStr} → {endStr}
                  </TimeRange>
                  <Small>Duração: {dur}</Small>
                </Left>

                <Right>
                  <Amount>{money}</Amount>
                  <Coins>+{coins} CC</Coins>
                </Right>
              </RowTop>

              <RowBottom>
                <Small>“Sessão no trono”</Small>
              </RowBottom>
            </Card>
          );
        }}
      />
    </Container>
  );
}
