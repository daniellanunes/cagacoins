import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #fff5eb; /* bege claro */
`;

/* ================= HEADER ================= */

export const HeaderBar = styled.View`
  height: 48px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

export const HeaderTitle = styled.Text`
  font-size: 22px;
  font-weight: 900;
  color: #3b2416; /* marrom escuro */
  text-align: center;
`;

// No seu arquivo de styles
export const BackButton = styled.Pressable`
  position: absolute;
  left: 0px;
  height: 48px;
  width: 48px;
  justify-content: center;
  align-items: center;
  z-index: 10; /* Isso garante que ele fique por cima */
`;

/* ================= SECTIONS ================= */

export const SectionHeader = styled.View`
  margin-top: 14px;
  margin-bottom: 8px;
`;

export const SectionHeaderText = styled.Text`
  font-size: 13px;
  font-weight: 900;
  color: #7a4a2e; /* marrom médio */
  opacity: 0.9;
`;

/* ================= CARD ================= */

export const Card = styled.View`
  border-width: 1px;
  border-color: #e0c3a0;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 10px;
`;

/* ================= ROWS ================= */

export const RowTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
`;

export const RowBottom = styled.View`
  margin-top: 10px;
`;

export const Left = styled.View`
  flex: 1;
`;

export const Right = styled.View`
  align-items: flex-end;
`;

/* ================= TEXTS ================= */

export const TimeRange = styled.Text`
  font-size: 16px;
  font-weight: 900;
  color: #3b2416;
`;

export const Small = styled.Text`
  font-size: 12px;
  font-weight: 800;
  color: #7a4a2e;
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
`;

/* ================= EMPTY ================= */

export const EmptyText = styled.Text`
  margin-top: 20px;
  font-size: 14px;
  font-weight: 800;
  color: #7a4a2e;
  text-align: center;
`;
