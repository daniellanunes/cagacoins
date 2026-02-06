import React from "react";
import { Modal } from "react-native";
import {
  ModalBackdrop,
  ModalCard,
  ModalTitle,
  ModalMessage,
  ModalFooter,
  ModalButton,
  CancelText,
  ConfirmText,
  ConfirmButton
} from "./styles";

interface CustomModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: "info" | "confirm" | "danger";
  onClose: () => void;
  onConfirm?: () => void;
}

export default function CustomModal({
  visible,
  title,
  message,
  type = "info",
  onClose,
  onConfirm,
}: CustomModalProps) {
  const isActionModal = type === "confirm" || type === "danger";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <ModalBackdrop>
        <ModalCard>
          <ModalTitle>{title}</ModalTitle>
          <ModalMessage>{message}</ModalMessage>

          <ModalFooter>
            <ModalButton onPress={onClose}>
              <CancelText>{isActionModal ? "Cancelar" : "Fechar"}</CancelText>
            </ModalButton>

            {isActionModal && (
              <ConfirmButton
                onPress={onConfirm}
                isDanger={type === "danger"}
              >
                <ConfirmText>Confirmar</ConfirmText>
              </ConfirmButton>
            )}
          </ModalFooter>
        </ModalCard>
      </ModalBackdrop>
    </Modal>
  );
}