import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 12px;
  background-color: #fff5eb;
`;

export const Big = styled.Text`
  font-size: 56px;
  font-weight: 900;
  text-align: center;
  color: #3b2416;
`;

export const Money = styled.Text`
  margin-top: 5px;
  font-size: 28px;
  font-weight: 900;
  color: #7a4a2e;
  text-align: center;
`;

export const CharacterContainer = styled.View`
  width: 320px;
  height: 320px;
  margin-bottom: 1px;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const CharacterImage = styled.Image`
  width: 320px;
  height: 320px;
`;

export const GlassesOverlay = styled.Image`
  position: absolute;
  width: 35%; 
  height: 45%;
  top: 35%;
  left: 31%;
`;

export const ChainOverlay = styled.Image`
  position: absolute;
  width: 40%;
  height: 70%;
  top: 35%;
  left: 28%;
`;

export const PetOverlay = styled.Image`
  position: absolute;
  width: 70px;
  height: 60px;
  right: 10px;
  bottom: 55px;
`;

export const PrivadaOverlay = styled.Image`
  position: absolute;
  width: 570px;
  height: 150px;
  right: 10px;
  bottom: 55px;
`;

export const ClockOverlay = styled.Image`
  position: absolute;
  width: 30%;
  height: 100%;
  right: 10px;
  bottom: 55px;
`;

export const MainArea = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 12px;
`;

export const MainButton = styled.Pressable<{ variant?: "primary" | "secondary" }>`
  margin-top: 24px;
  width: 100%;
  max-width: 340px;
  padding: 18px;
  border-radius: 20px;
  align-items: center;
  background-color: ${props => props.variant === "secondary" ? "#d9534f" : "#7a4a2e"};
  elevation: 3;
`;

export const MainButtonText = styled.Text`
  font-size: 18px;
  font-weight: 900;
  color: #ffffff;
`;

export const MenuButton = styled.Pressable`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  padding: 10px;
`;

export const MenuBackdrop = styled.Pressable`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-start;
  align-items: flex-end;
  padding-top: 60px;
  padding-right: 16px;
`;

export const MenuCard = styled.View`
  background-color: #ffffff;
  width: 220px;
  border-radius: 14px;
  padding: 8px;
  elevation: 8;
`;

export const MenuItem = styled.Pressable`
  padding: 14px;
  border-radius: 10px;
`;

export const MenuRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const MenuText = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: #3b2416;
`;

export const Footer = styled.View`
  margin-top: auto;
  padding-top: 12px;
`;

export const FooterTitle = styled.Text`
  font-size: 14px;
  font-weight: 900;
  color: #7a4a2e;
  margin-bottom: 8px;
`;

export const EmptyFooterText = styled.Text`
  font-size: 13px;
  font-weight: 800;
  color: #3b2416;
  opacity: 0.7;
`;

export const FooterCard = styled.Pressable`
  border-width: 1px;
  border-color: #e0c3a0;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 14px;
`;

export const RowTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
`;

export const Left = styled.View`
  flex: 1;
`;

export const Right = styled.View`
  align-items: flex-end;
`;

export const TimeRange = styled.Text`
  font-size: 16px;
  font-weight: 900;
  color: #3b2416;
`;

export const Small = styled.Text`
  font-size: 12px;
  font-weight: 800;
  color: #3b2416;
  opacity: 0.75;
`;

export const Amount = styled.Text`
  font-size: 16px;
  font-weight: 900;
  color: #3b2416;
`;

export const Coins = styled.Text`
  margin-top: 2px;
  font-size: 13px;
  font-weight: 900;
  color: #7a4a2e;
  opacity: 0.9;
`;

export const CoinsHeader = styled.Text`
  font-size: 18px;
  font-weight: 900;
  color: #3b2416;
  opacity: 0.9;
`;

export const PlayButton = styled.Pressable`
  margin-top: 12px;
  width: 100%;
  max-width: 340px;
  padding: 14px;
  border-radius: 20px;
  align-items: center;
  background-color: #7a4a2e;
  border-width: 2px;
  border-color: #e0c3a0;
  elevation: 2;
`;

export const PlayButtonText = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
`;