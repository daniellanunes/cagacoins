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

// Import das imagens base
import ImgTrono from "../../assets/trono.png";
import ImgPositivo from "../../assets/positivo.png";

// Import das imagens dos acessórios
import ImgGlasses from "../../assets/glasses.png";
import ImgChain from "../../assets/chain.png";
import ImgPet from "../../assets/pet.png";
import ImgPrivada from "../../assets/privada.png";
import ImgClock from "../../assets/clock.png";

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
  CoinsHeader,
  CharacterContainer,
  GlassesOverlay,
  ChainOverlay,
  PetOverlay,
  PrivadaOverlay,
  ClockOverlay,
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
  const [totalCoins, setTotalCoins] = useState(0);

  const [equipped, setEquipped] = useState({
    glasses: false,
    chain: false,
    pet: false,
    privada: false,
    clock: false,
  });

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
  if (!user) return;

  const unsub = firestore()
    .collection("users")
    .doc(user.uid)
    .onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        // ✅ Atualiza o saldo real acumulado no Firebase
        setTotalCoins(data?.totalCoins || 0); 
        // ✅ Atualiza o que o boneco está vestindo
        setEquipped(data?.equipped || { glasses: false, chain: false, pet: false, privada: false, clock: false });
      }
    }, (err) => console.log("ERRO PERFIL =>", err));

  return () => unsub();
}, []);

// 2. LISTENER DA ÚLTIMA SESSÃO (Rodapé / Última Reinada)
  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsub = firestore()
      .collection("users")
      .doc(user.uid)
      .collection("sessions")
      .orderBy("createdAt", "desc")
      .limit(1)
      .onSnapshot((snap) => {
        if (!snap.empty) {
          const doc = snap.docs[0];
          setLastSession({
            id: doc.id,
            ...doc.data(),
          } as SessionItem);
        }
      }, (err) => console.log("ERRO ÚLTIMA SESSÃO =>", err));

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
    const durationClamped = clamp(durationSec, 15, 20 * 60);
    const startAt = startAtRef.current;
    const endAt = new Date();

    const minutes = durationClamped / 60;
    const earned = valuePerMinuteRef.current * minutes;
    const coins = Math.floor(durationClamped / 120);

    // Reset local imediato para UX
    setRunning(false);
    setSeconds(0);
    setMoney(0);
    startAtRef.current = null;

    const user = auth().currentUser;
    if (!user) return;

    const userRef = firestore().collection("users").doc(user.uid);

    try {
      // 1. Salva a sessão na subcoleção correta
      // Importante: Usar FieldValue.serverTimestamp() para o History conseguir ordenar
      await userRef.collection("sessions").add({
        startAt: startAt ? firestore.Timestamp.fromDate(startAt) : null,
        endAt: firestore.Timestamp.fromDate(endAt),
        durationSec: durationClamped,
        moneyEarned: earned,
        coinsEarned: coins,
        createdAt: firestore.FieldValue.serverTimestamp(), 
      });

      // 2. Atualiza o saldo global de moedas
      await userRef.update({
        totalCoins: firestore.FieldValue.increment(coins)
      });

      console.log("DADOS SINCRONIZADOS COM FIREBASE ✅");
    } catch (err: any) {
      console.log("ERRO AO SALVAR NO FIREBASE =>", err?.message);
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
        <CharacterContainer>
          <CharacterImage
            source={running ? ImgTrono : ImgPositivo}
            resizeMode="contain"
          />

          {!running && (
            <>
              {equipped.glasses && (
                <GlassesOverlay source={ImgGlasses} resizeMode="contain" />
              )}
              {equipped.chain && (
                <ChainOverlay source={ImgChain} resizeMode="contain" />
              )}
              {equipped.pet && (
                <PetOverlay source={ImgPet} resizeMode="contain" />
              )}
              {equipped.privada && (
                <PrivadaOverlay source={ImgPrivada} resizeMode="contain" />
              )}
              {equipped.clock && (
                <ClockOverlay source={ImgClock} resizeMode="contain" />
              )}
            </>
          )}
        </CharacterContainer>

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

        {running && (
          <PlayButton onPress={() => navigation.navigate("GameGallery")}>
            <PlayButtonText>Jogue enquanto reina 🎮</PlayButtonText>
          </PlayButton>
        )}
      </MainArea>
      
      <CoinsHeader style={{ marginBottom: 10 }}>Saldo: {totalCoins} CC🪙</CoinsHeader>

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
                navigation.navigate("ShopScreen");
              }}
            >
              <MenuRow>
                <FontAwesome5 name="shopping-basket" size={16} color="#3b2416" />
                <MenuText>Loja</MenuText>
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