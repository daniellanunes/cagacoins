/**
 * Aqui vamos salvar configurações do usuário localmente no celular:
 * - Salário mensal
 * - Dias úteis
 * - Horas por dia
 *
 * Por que local?
 * - É rápido e não precisa de internet
 * - No MVP, não precisamos sincronizar isso em nuvem ainda
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Tipo das configurações do usuário.
 * Você pode expandir isso no futuro (ex: salário por hora, moeda, etc).
 */
export type Settings = {
  salaryMonthly: number;  // Ex: 3500
  workDaysMonth: number;  // Ex: 22
  workHoursDay: number;   // Ex: 8
  currency: "BRL";
  settingsMonthKey: string;
};

/**
 * Chave que usamos dentro do AsyncStorage.
 * Boas práticas: usar prefixo do app
 */
const KEY = "@cagacoins:settings";

/**
 * Salva as configs no celular
 */
export async function saveSettings(s: Settings) {
  await AsyncStorage.setItem(KEY, JSON.stringify(s));
}

/**
 * Lê as configs do celular
 * - Se não existir nada salvo, retorna null
 */
export async function loadSettings(): Promise<Settings | null> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Settings) : null;
}

export const getMonthKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // ex: "2026-02"
};

