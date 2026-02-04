import React, { useState, useEffect } from "react";
import { Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { RootStackParamList } from "../../navigation/types";
import { getMonthKey, saveSettings, loadSettings } from "../../storage/settings"; 

import { 
  Container, Label, Input, Button, ButtonText,
  BackButton, HeaderBar, HeaderTitle 
} from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Setup">;

export default function SetupScreen({ navigation }: Props) {
  const [salaryMonthly, setSalaryMonthly] = useState("");
  const [workDaysMonth, setWorkDaysMonth] = useState("");
  const [workHoursDay, setWorkHoursDay] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const saved = await loadSettings(); 
        
        if (saved) {
          setSalaryMonthly(String(saved.salaryMonthly));
          setWorkDaysMonth(String(saved.workDaysMonth));
          setWorkHoursDay(String(saved.workHoursDay));
        } else {
          setSalaryMonthly("3500");
          setWorkDaysMonth("22");
          setWorkHoursDay("8");
        }
      } catch (e) {
        console.error("Erro ao carregar settings", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const onSave = async () => {
    const s = Number(salaryMonthly.replace(",", "."));
    const d = Number(workDaysMonth);
    const h = Number(workHoursDay.replace(",", "."));

    if (!s || !d || !h) {
      Alert.alert("Ops", "Preencha os valores corretamente.");
      return;
    }

    await saveSettings({
      salaryMonthly: s,
      workDaysMonth: d,
      workHoursDay: h,
      currency: "BRL",
      settingsMonthKey: getMonthKey(), 
    });

    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  if (loading) {
    return (
      <Container style={{ justifyContent: 'center' }}>
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
        <HeaderTitle>Configuração rápida 💩</HeaderTitle>
      </HeaderBar>

      <Label>Salário mensal (R$)</Label>
      <Input
        value={salaryMonthly}
        onChangeText={setSalaryMonthly}
        keyboardType="numeric"
      />

      <Label>Dias úteis no mês</Label>
      <Input
        value={workDaysMonth}
        onChangeText={setWorkDaysMonth}
        keyboardType="numeric"
      />

      <Label>Horas por dia</Label>
      <Input
        value={workHoursDay}
        onChangeText={setWorkHoursDay}
        keyboardType="numeric"
      />

      <Button onPress={onSave}>
        <ButtonText>Salvar e continuar</ButtonText>
      </Button>
    </Container>
  );
}