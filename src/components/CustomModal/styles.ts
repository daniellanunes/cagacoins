import styled from "styled-components/native";

export const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const ModalCard = styled.View`
  background-color: #fff;
  width: 100%;
  border-radius: 20px;
  padding: 24px;
  align-items: center;
  border: 2px solid #e0c3a0;
`;

export const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #3b2416;
  margin-bottom: 12px;
  text-align: center;
`;

export const ModalMessage = styled.Text`
  font-size: 16px;
  color: #6d4c41;
  text-align: center;
  margin-bottom: 24px;
  line-height: 22px;
`;

export const ModalFooter = styled.View`
  flex-direction: row;
  width: 100%;
  gap: 12px;
`;

export const ModalButton = styled.Pressable`
  flex: 1;
  padding: 14px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
`;

export const ConfirmButton = styled(ModalButton)<{ isDanger?: boolean }>`
  background-color: ${(props) => (props.isDanger ? "#d32f2f" : "#3b2416")};
`;

export const CancelText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #3b2416;
`;

export const ConfirmText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;