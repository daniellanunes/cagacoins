import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  gap: 12px;
  background-color: #fff5eb; /* bege claro */
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: 900;
  color: #3b2416; /* marrom escuro */
`;

export const Card = styled.View`
  border-width: 1px;
  border-color: #e0c3a0;
  border-radius: 16px;
  padding: 14px;
  gap: 10px;
  background-color: #ffffff;
`;

export const Label = styled.Text`
  font-size: 12px;
  font-weight: 900;
  color: #3b2416;
  opacity: 0.7;
`;

export const Value = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: #3b2416;
`;

export const Button = styled.Pressable<{ variant?: "danger" | "neutral" }>`
  padding: 14px;
  border-radius: 14px;
  align-items: center;

  background-color: ${(p) =>
    p.variant === "danger" ? "#b00020" : "#7a4a2e"};
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  font-weight: 900;
`;

export const SecondaryButton = styled.Pressable`
  padding: 14px;
  border-radius: 14px;
  align-items: center;
  border-width: 1px;
  border-color: #e0c3a0;
  background-color: #ffffff;
`;

export const SecondaryButtonText = styled.Text`
  color: #7a4a2e;
  font-weight: 900;
`;

export const Hint = styled.Text`
  color: #3b2416;
  opacity: 0.7;
  font-weight: 700;
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