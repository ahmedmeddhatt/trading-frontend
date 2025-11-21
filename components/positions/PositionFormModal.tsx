import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { usePositionsStore } from "@/store/positionsStore";

interface Props {
  positionId?: string | null;
  onClose: () => void;
}

export const PositionFormModal: React.FC<Props> = ({ positionId, onClose }) => {
  const { positions, addPosition, updatePosition } = usePositionsStore();
  const existing = positions.find(p => p._id === positionId);

  const [companyName, setCompanyName] = useState(existing?.companyName || "");
  const [stockPrice, setStockPrice] = useState(existing?.stockPrice || 0);
  const [quantity, setQuantity] = useState(existing?.quantity || 0);
  const [status, setStatus] = useState<"holding" | "sold" | "watching">(existing?.status || "holding");

  const handleSubmit = async () => {
    const data = { companyName, stockPrice, quantity, status };
    if (positionId) await updatePosition(positionId, data);
    else await addPosition(data);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="space-y-4 text-white bg-gray-900 p-6 rounded-lg neon-shadow">
        <h2 className="text-xl font-bold text-green-400">
          {positionId ? "Edit Position" : "Add New Position"}
        </h2>
        <input
          className="w-full p-2 rounded bg-gray-800 border border-green-400 text-white"
          placeholder="Company Name"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 rounded bg-gray-800 border border-green-400 text-white"
          placeholder="Stock Price"
          value={stockPrice}
          onChange={e => setStockPrice(Number(e.target.value))}
        />
        <input
          type="number"
          className="w-full p-2 rounded bg-gray-800 border border-green-400 text-white"
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
        />
        <select
          className="w-full p-2 rounded bg-gray-800 border border-green-400 text-white"
          value={status}
          onChange={e => setStatus(e.target.value as any)}
        >
          <option value="holding">Holding</option>
          <option value="sold">Sold</option>
          <option value="watching">Watching</option>
        </select>
        <Button onClick={handleSubmit} variant="primary">
          {positionId ? "Update" : "Add"}
        </Button>
      </div>
    </Modal>
  );
};
