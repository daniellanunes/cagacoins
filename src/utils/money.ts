/**
 * Funções auxiliares de cálculo.
 * Mantém a lógica separada das telas -> fica mais fácil testar e evoluir.
 */

/**
 * Limita um número entre min e max (anti-fraude básico e segurança)
 */
export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Calcula quanto vale 1 minuto de trabalho baseado no salário mensal.
 * Fórmula:
 *   salário mensal / (dias úteis * horas por dia * 60)
 */
export function calcValuePerMinute(params: {
  salaryMonthly: number;
  workDaysMonth: number;
  workHoursDay: number;
}) {
  const { salaryMonthly, workDaysMonth, workHoursDay } = params;

  const minutesMonth = workDaysMonth * workHoursDay * 60;
  if (!minutesMonth) return 0;

  return salaryMonthly / minutesMonth;
}

/**
 * Formata valor em BRL sem usar Intl
 * (porque em alguns android antigos pode dar dor de cabeça)
 */
export function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
