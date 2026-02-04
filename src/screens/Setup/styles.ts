/**
 * Styled-components da tela Setup
 * Padrão visual CagaCoins
 */

import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  gap: 10px;
  background-color: #fff5eb; /* fundo bege */
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 6px;
  color: #3b2416; /* marrom escuro */
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #3b2416;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: #e0c3a0;   /* borda bege */
  border-radius: 10px;
  padding: 12px;
  font-size: 16px;
  color: #3b2416;
  background-color: #ffffff;
`;

export const Button = styled.Pressable`
  margin-top: 10px;
  background-color: #7a4a2e; /* marrom principal */
  padding: 14px;
  border-radius: 12px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  font-weight: 800;
`;
export const HeaderBar = styled.View`
  height: 48px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

export const BackButton = styled.Pressable`
  position: absolute;
  left: 0px;
  height: 48px;
  width: 48px;
  justify-content: center;
  align-items: center;
  z-index: 10; /* Isso garante que ele fique por cima */
`;

export const HeaderTitle = styled.Text`
  font-size: 22px;
  font-weight: 900;
  color: #3b2416; /* marrom escuro */
  text-align: center;
`;