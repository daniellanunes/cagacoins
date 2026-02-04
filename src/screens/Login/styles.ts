import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  justify-content: center;
  gap: 10px;
  background-color: #fff5eb; /* bege claro */
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 60px;
  color: #3b2416; /* marrom escuro */
`;

export const Label = styled.Text`
  font-weight: 800;
  color: #3b2416;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: #e0c3a0;
  border-radius: 10px;
  padding: 12px;
  font-size: 16px;
  color: #3b2416;
  background-color: #ffffff;
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

export const Link = styled.Pressable`
  padding: 10px;
  align-items: center;
`;

export const LinkText = styled.Text`
  color: #7a4a2e;
  font-weight: 800;
  text-decoration: underline;
`;

export const ErrorText = styled.Text`
  color: #b00020;
  font-weight: 700;
`;
