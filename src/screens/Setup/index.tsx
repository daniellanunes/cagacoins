/**
 * Tela de configuração do usuário (MVP).
 * Aqui salvamos as configs no AsyncStorage.
 * Depois de salvar, redireciona para Home.
 */

import React, { useState } from "react";
import { Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { RootStackParamList } from "../../navigation/types";
import { getMonthKey, saveSettings } from "../../storage/settings";
import { 
  Container, 
  Title, 
  Label, 
  Input, 
  Button, 
  ButtonText,
  BackButton,
  HeaderBar,
  HeaderTitle,
} 
  from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Setup">;

export default function SetupScreen({ navigation }: Props) {
  // Estados locais (inputs)
  const [salaryMonthly, setSalaryMonthly] = useState("3500");
  const [workDaysMonth, setWorkDaysMonth] = useState("22");
  const [workHoursDay, setWorkHoursDay] = useState("8");

  /**
   * Ao clicar em salvar:
   * 1) converte texto -> número
   * 2) valida se está tudo ok
   * 3) salva no AsyncStorage
   * 4) reseta navegação e manda pra Home
   */
  const onSave = async () => {
    // Aceita "3500" e "3500,50"
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

    // Reset: evita voltar pra setup pelo botão de voltar
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

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
