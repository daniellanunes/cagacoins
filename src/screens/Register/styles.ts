import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  margin-top: 5px;
  padding: 16px;
  gap: 10px;
  background-color: #fff5eb; /* bege claro */
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: 900;
  color: #3b2416; /* marrom escuro */
`;

export const Label = styled.Text`
  font-weight: 800;
  color: #3b2416;
`;

export const Input = styled.TextInput`
  flex: 1;
  padding: 12px 15px; /* Adicionei um pouco mais de respiro lateral */
  font-size: 16px;
  color: #3b2416;
  border-width: 0;
  background-color: transparent;
`;

export const Button = styled.Pressable`
  background-color: #7a4a2e; /* marrom principal */
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  margin-top: 6px;
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  font-weight: 900;
`;

export const ErrorText = styled.Text`
  color: #b00020;
  font-weight: 700;
`;

export const Link = styled.Pressable`
  padding: 10px;
  align-items: center;
`;

export const LinkText = styled.Text`
  color: #7a4a2e; /* marrom principal */
  font-weight: 800;
  text-decoration: underline;
`;
export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #e0c3a0;
  border-radius: 10px;
  margin-bottom: 10px; /* Aumentei um pouco o espaçamento entre campos */
  min-height: 50px;    /* Garante altura padrão em todos */
  overflow: hidden;
`;

export const EyeButton = styled.Pressable`
  padding: 10px;
  justify-content: center;
  align-items: center;
`;