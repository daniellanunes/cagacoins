import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { RootStackParamList } from "../../navigation/types";
import { loadSettings, getMonthKey } from "../../storage/settings";
import { calcValuePerMinute, clamp, formatBRL } from "../../utils/money";
import { useTimer } from "../../context/TimerContext";

// Import das imagens
import ImgTrono from "../../assets/trono.png";
import ImgPositivo from "../../assets/positivo.png";

import {
  Container,
  Big,
  Money,
  MainButton,
  MainButtonText,
  MenuButton,
  MenuBackdrop,
  MenuCard,
  MenuItem,
  MenuRow,
  MenuText,
  MainArea,
  Footer,
  FooterTitle,
  FooterCard,
  RowTop,
  Left,
  Right,
  TimeRange,
  Small,
  Amount,
  Coins,
  EmptyFooterText,
  CharacterImage,
  PlayButton,
  PlayButtonText,
} from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type SessionItem = {
  id: string;
  startAt?: any;
  endAt?: any;
  durationSec?: number;
  moneyEarned?: number;
  coinsEarned?: number;
  createdAt?: any;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDate(ts: any): Date | null {
  if (!ts) return null;
  if (typeof ts?.toDate === "function") return ts.toDate();
  if (ts instanceof Date) return ts;
  return null;
}

function formatHour(d: Date | null) {
  if (!d) return "--:--";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function durationToText(sec?: number) {
  const s = Math.max(0, Math.floor(sec || 0));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}m ${ss}s`;
}

export default function HomeScreen({ navigation }: Props) {
  // Motor global do Contexto
  const {
    seconds,
    setSeconds,
    isActive: running,
    setIsActive: setRunning,
    formatTime,
  } = useTimer();

  const [ready, setReady] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [money, setMoney] = useState(0);
  const [lastSession, setLastSession] = useState<SessionItem | null>(null);

  const valuePerMinuteRef = useRef(0);
  const startAtRef = useRef<Date | null>(null);

  useEffect(() => {
    (async () => {
      const s = await loadSettings();
      if (!s) {
        navigation.reset({ index: 0, routes: [{ name: "Setup" }] });
        return;
      }
      const currentMonth = getMonthKey();
      if (s.settingsMonthKey !== currentMonth) {
        navigation.reset({ index: 0, routes: [{ name: "Setup" }] });
        return;
      }
      valuePerMinuteRef.current = calcValuePerMinute(s);
      setReady(true);
    })();
  }, [navigation]);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) {
      setLastSession(null);
      return;
    }
    const unsub = firestore()
      .collection("users")
      .doc(user.uid)
      .collection("sessions")
      .orderBy("createdAt", "desc")
      .limit(1)
      .onSnapshot((snap) => {
        if (snap.empty) {
          setLastSession(null);
          return;
        }
        const d = snap.docs[0];
        setLastSession({ id: d.id, ...(d.data() as any) });
      });
    return () => unsub();
  }, []);

  useEffect(() => {
    const minutes = seconds / 60;
    setMoney(valuePerMinuteRef.current * minutes);
  }, [seconds]);

  const start = () => {
    if (running) return;
    startAtRef.current = new Date();
    setRunning(true);
  };

  const stop = async () => {
    if (!running) return;
    const durationSec = seconds;
    const minutes = durationSec / 60;
    const earned = valuePerMinuteRef.current * minutes;
    const coins = Math.round(earned * 10);
    const durationClamped = clamp(durationSec, 15, 20 * 60);
    const startAt = startAtRef.current;
    const endAt = new Date();

    setRunning(false);
    setSeconds(0);
    setMoney(0);
    startAtRef.current = null;

    const previewSession: SessionItem = {
      id: `local-${Date.now()}`,
      startAt: startAt ? firestore.Timestamp.fromDate(startAt) : null,
      endAt: firestore.Timestamp.fromDate(endAt),
      durationSec: durationClamped,
      moneyEarned: earned,
      coinsEarned: coins,
      createdAt: endAt,
    };
    setLastSession(previewSession);

    try {
      const user = auth().currentUser;
      if (user) {
        await firestore()
          .collection("users")
          .doc(user.uid)
          .collection("sessions")
          .add({
            startAt: startAt ? firestore.Timestamp.fromDate(startAt) : null,
            endAt: firestore.Timestamp.fromDate(endAt),
            durationSec: durationClamped,
            moneyEarned: earned,
            coinsEarned: coins,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
      }
    } catch (err: any) {
      console.log("SAVE SESSION ERROR =>", err);
    }
  };

  const footerData = useMemo(() => {
    if (!lastSession) return null;
    const start = toDate(lastSession.startAt) || toDate(lastSession.createdAt);
    const end = toDate(lastSession.endAt);
    return {
      startStr: formatHour(start),
      endStr: formatHour(end),
      durStr: durationToText(lastSession.durationSec),
      moneyStr: formatBRL(lastSession.moneyEarned || 0),
      coins: Math.round(lastSession.coinsEarned || 0),
      session: lastSession,
    };
  }, [lastSession]);

  if (!ready) return null;

  return (
    <Container>
      <MenuButton onPress={() => setMenuVisible(true)}>
        <FontAwesome5 name="bars" size={20} color="#3b2416" />
      </MenuButton>

      <MainArea>
        <CharacterImage
          source={running ? ImgTrono : ImgPositivo}
          resizeMode="contain"
        />

        <Big>{formatTime(seconds)}</Big>
        <Money>{formatBRL(money)}</Money>

        <MainButton
          variant={running ? "secondary" : "primary"}
          onPress={running ? stop : start}
        >
          <MainButtonText>
            {running ? "Levantei 🚽" : "Sentei no trono 👑"}
          </MainButtonText>
        </MainButton>

        {/* Botão condicional que aparece apenas quando rodando */}
        {running && (
          <PlayButton
            onPress={() => {
              // Navega para a tela de galeria que acabamos de tipar
              navigation.navigate("GameGallery");
            }}
          >
            <PlayButtonText>Jogue enquanto reina 🎮</PlayButtonText>
          </PlayButton>
        )}
      </MainArea>

      <Footer>
        <FooterTitle>Última Reinada</FooterTitle>
        {!footerData ? (
          <EmptyFooterText>
            Ainda não tem sessões. Bora inaugurar o trono 👑
          </EmptyFooterText>
        ) : (
          <FooterCard
            onPress={() =>
              navigation.navigate("SessionDetail", {
                session: footerData.session,
              })
            }
          >
            <RowTop>
              <Left>
                <TimeRange>
                  {footerData.startStr} → {footerData.endStr}
                </TimeRange>
                <Small>Duração: {footerData.durStr}</Small>
              </Left>
              <Right>
                <Amount>{footerData.moneyStr}</Amount>
                <Coins>+{footerData.coins} CC</Coins>
              </Right>
            </RowTop>
            <Small style={{ marginTop: 10 }}>Toque para ver detalhes</Small>
          </FooterCard>
        )}
      </Footer>

      <Modal visible={menuVisible} transparent animationType="fade">
        <MenuBackdrop onPress={() => setMenuVisible(false)}>
          <MenuCard>
            <MenuItem
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("History");
              }}
            >
              <MenuRow>
                <FontAwesome5 name="receipt" size={16} color="#3b2416" />
                <MenuText>Histórico</MenuText>
              </MenuRow>
            </MenuItem>
            <MenuItem
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Profile");
              }}
            >
              <MenuRow>
                <FontAwesome5 name="user" size={16} color="#3b2416" />
                <MenuText>Perfil</MenuText>
              </MenuRow>
            </MenuItem>
            <MenuItem
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Setup");
              }}
            >
              <MenuRow>
                <FontAwesome5 name="cog" size={16} color="#3b2416" />
                <MenuText>Configurações</MenuText>
              </MenuRow>
            </MenuItem>
          </MenuCard>
        </MenuBackdrop>
      </Modal>
    </Container>
  );
}