export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}
export interface Position {
  lat: number;
  lng: number;
}
