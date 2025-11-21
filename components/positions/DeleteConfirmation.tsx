import React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";


interface Props {
  open: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmation: React.FC<Props> = ({ open, message = "Are you sure?", onConfirm, onCancel }) => (
  <Modal open={open} onClose={onCancel}>
    <div className="bg-gray-900 p-6 rounded-lg neon-shadow text-white space-y-4">
      <p className="text-red-400 font-bold">{message}</p>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </div>
    </div>
  </Modal>
);
