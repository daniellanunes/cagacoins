import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #fdf5e6;
  padding: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #3b2416;
`;

export const CoinContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid #e0c3a0;
`;

export const CoinText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #ffa500;
  margin-left: 8px;
`;

export const ItemList = styled.FlatList`
  flex: 1;
`;

export const Card = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  border: 1px solid #e0c3a0;
  elevation: 3;
`;

export const ItemImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  background-color: #f9f9f9;
`;

export const ItemInfo = styled.View`
  flex: 1;
  margin-left: 16px;
`;

export const ItemName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #3b2416;
`;

export const ItemPrice = styled.Text`
  font-size: 14px;
  color: #6d4c41;
  margin-top: 4px;
`;

export const ActionButton = styled.TouchableOpacity<{ isOwned?: boolean; isEquipped?: boolean }>`
  background-color: ${props => 
    props.isEquipped ? '#d32f2f' : (props.isOwned ? '#4caf50' : '#3b2416')};
  padding: 10px 16px;
  border-radius: 8px;
  min-width: 100px;
  align-items: center;
`;

export const ActionButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 14px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-bottom: 10px;
`;