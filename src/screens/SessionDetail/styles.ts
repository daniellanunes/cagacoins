import styled from "styled-components/native";

/**
 * Fundo padrão CagaCoins
 */
export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #fff5eb;
`;

/**
 * Botão de voltar (topo)
 */
export const BackButton = styled.Pressable`
  position: absolute;
  left: 0px;
  height: 48px;
  width: 48px;
  justify-content: center;
  align-items: center;
`;
/**
 * Título da tela
 */
export const Title = styled.Text`
  margin-top: 12px;
  margin-bottom: 12px;
  font-size: 22px;
  font-weight: 900;
  color: #3b2416;
`;

/**
 * Card branco com borda suave
 */
export const Card = styled.View`
  background-color: #ffffff;
  border-width: 1px;
  border-color: #e0c3a0;
  border-radius: 16px;
  padding: 14px;
  gap: 10px;
`;

/**
 * Label (nome do campo)
 */
export const Label = styled.Text`
  font-size: 12px;
  font-weight: 900;
  color: #7a4a2e;
  opacity: 0.9;
`;

/**
 * Valor (conteúdo)
 */
export const Value = styled.Text`
  font-size: 16px;
  font-weight: 900;
  color: #3b2416;
`;

export const HeaderTitle = styled.Text`
  font-size: 22px;
  font-weight: 900;
  color: #3b2416; /* marrom escuro */
  text-align: center;
`;

export const HeaderBar = styled.View`
  height: 48px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;
