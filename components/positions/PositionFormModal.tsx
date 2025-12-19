import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { usePosition, useCreatePosition, useUpdatePosition } from "@/hooks/api/usePositions";
import { PositionPayload } from "@/lib/api/positions";
import { Error } from "@/components/ui/Error";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import { Building2 } from "lucide-react";

interface Props {
  positionId?: string | null;
  onClose: () => void;
}

export const PositionFormModal: React.FC<Props> = ({ positionId, onClose }) => {
  const { data: existing } = usePosition(positionId || "");
  const createMutation = useCreatePosition();
  const updateMutation = useUpdatePosition();

  const [companyName, setCompanyName] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [status, setStatus] = useState<"holding" | "sold" | "watching">("holding");
  const [errors, setErrors] = useState<{ companyName?: string; currentPrice?: string }>({});

  useEffect(() => {
    if (existing) {
      setCompanyName(existing.companyName || "");
      setCurrentPrice(existing.currentPrice || 0);
      setStatus(existing.status || "holding");
    }
  }, [existing]);

  const validate = () => {
    const newErrors: { companyName?: string; currentPrice?: string } = {};
    
    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    
    if (currentPrice < 0) {
      newErrors.currentPrice = "Price cannot be negative";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      const data: PositionPayload = {
        companyName: companyName.trim(),
        ...(currentPrice > 0 && { currentPrice }),
        status,
      };
      
      if (positionId) {
        await updateMutation.mutateAsync({ id: positionId, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      
      onClose();
    } catch (err) {
      // Error handled by mutation
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <Modal open={true} onClose={onClose} title={positionId ? "Edit Position" : "Add New Position"}>
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        {error && <Error message={getErrorMessage(error)} />}

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Company Name / Ticker *
          </label>
          <input
            className="w-full p-3 rounded-lg bg-dark-surface border border-dark-border text-text-primary focus:border-green-primary focus:outline-none transition-colors duration-normal"
            placeholder="e.g., AAPL, TSLA, Microsoft"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Current Price (optional)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full p-3 rounded-lg bg-dark-surface border border-dark-border text-text-primary focus:border-green-primary focus:outline-none transition-colors duration-normal"
            placeholder="Current stock price"
            value={currentPrice || ""}
            onChange={e => setCurrentPrice(Number(e.target.value))}
          />
          <p className="text-xs text-text-tertiary mt-1">
            Leave empty if unknown. You can update this later.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Status
          </label>
          <select
            className="w-full p-3 rounded-lg bg-dark-surface border border-dark-border text-text-primary focus:border-green-primary focus:outline-none transition-colors duration-normal"
            value={status}
            onChange={e => setStatus(e.target.value as "holding" | "sold" | "watching")}
          >
            <option value="holding">Holding</option>
            <option value="sold">Sold</option>
            <option value="watching">Watching</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button 
            type="submit"
            onClick={(e) => handleSubmit(e as any)} 
            variant="primary" 
            className="flex-1"
            disabled={loading || !companyName.trim()}
            loading={loading}
          >
            {positionId ? "Update Position" : "Create Position"}
          </Button>
          <Button onClick={onClose} variant="secondary" disabled={loading}>
            Cancel
          </Button>
        </div>

        {!positionId && (
          <p className="text-xs text-text-tertiary mt-2">
            Note: After creating a position, add transactions to build your position.
          </p>
        )}
      </form>
    </Modal>
  );
};
