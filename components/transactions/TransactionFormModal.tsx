import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useTransaction, useCreateTransaction } from "@/hooks/api/useTransactions";
import { TransactionPayload } from "@/lib/api/transactions";
import { Error } from "@/components/ui/Error";

interface Props {
  positionId: string;
  transactionId?: string | null;
  onClose: () => void;
}

export const TransactionFormModal: React.FC<Props> = ({
  positionId,
  transactionId,
  onClose,
}) => {
  const { data: existing } = useTransaction(transactionId || "");
  const createMutation = useCreateTransaction();

  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [fees, setFees] = useState(0);
  const [type, setType] = useState<"buy" | "sell">("buy");

  useEffect(() => {
    if (existing) {
      setQuantity(existing.quantity || 0);
      setPrice(existing.price || 0);
      setFees(existing.fees || 0);
      setType(existing.type || "buy");
    }
  }, [existing]);

  const handleSubmit = async () => {
    if (quantity <= 0 || price <= 0) {
      return;
    }

    try {
      const data: TransactionPayload = {
        positionId,
        quantity,
        price,
        fees,
        type,
      };
      // Backend documentation does not specify update transaction, only create and delete.
      // For simplicity, we'll only implement create for now.
      await createMutation.mutateAsync(data);
      onClose();
    } catch (err) {
      // Error handled by mutation
    }
  };

  const loading = createMutation.isPending;
  const error = createMutation.error;

  return (
    <Modal open={true} onClose={onClose} title="Add New Transaction">
      <div className="space-y-4 text-white">
        {error && <Error message={(error as any)?.message || "Failed to save transaction"} />}

        <div>
          <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
            Type
          </label>
          <select
            className="w-full p-3 rounded-lg bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#00ff88] focus:outline-none transition-colors"
            value={type}
            onChange={(e) => setType(e.target.value as "buy" | "sell")}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
            Quantity *
          </label>
          <input
            type="number"
            required
            className="w-full p-3 rounded-lg bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#00ff88] focus:outline-none transition-colors"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
            Price per share *
          </label>
          <input
            type="number"
            required
            className="w-full p-3 rounded-lg bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#00ff88] focus:outline-none transition-colors"
            placeholder="Price per share"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min="0.01"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
            Fees (optional)
          </label>
          <input
            type="number"
            className="w-full p-3 rounded-lg bg-[#121212] border border-[#2a2a2a] text-white focus:border-[#00ff88] focus:outline-none transition-colors"
            placeholder="Fees"
            value={fees}
            onChange={(e) => setFees(Number(e.target.value))}
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            variant="primary"
            className="flex-1"
            disabled={loading}
            loading={loading}
          >
            Add Transaction
          </Button>
          <Button onClick={onClose} variant="secondary" disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
