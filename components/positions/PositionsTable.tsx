import React, { useState, useEffect } from "react";
import { usePositionsStore } from "@/store/positionsStore";
import { Button } from "@/components/ui/Button";
import { PositionFormModal } from "./PositionFormModal";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmation } from "./DeleteConfirmation";

export const PositionsTable: React.FC = () => {
  const { positions, fetchPositions, deletePosition, loading, error } = usePositionsStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchPositions(); }, []);

  return (
    <div className="space-y-4 neon-container">
      <div className="flex justify-between">
        <Button onClick={() => { setEditId(null); setShowModal(true); }} variant="primary">
          Add Position
        </Button>
      </div>

      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Table className="bg-gray-900 border-green-400">
        <TableHeader>
          <TableRow>
            {["Company", "Qty", "Investment", "Investment+Tax", "Result+Tax", "Gain%", "Status", "Actions"].map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.companyName}</TableCell>
              <TableCell>{p.quantity}</TableCell>
              <TableCell>${p.investment.toFixed(2)}</TableCell>
              <TableCell>${p.investmentWithTax.toFixed(2)}</TableCell>
              <TableCell>${p.resultWithTax.toFixed(2)}</TableCell>
              <TableCell className={p.percentGainLoss >= 0 ? "text-green-400" : "text-red-400"}>
                {p.percentGainLoss.toFixed(2)}%
              </TableCell>
              <TableCell>
                <Badge variant="default">{p.status}</Badge>
              </TableCell>
              <TableCell className="space-x-2">
                <Button variant="secondary" onClick={() => { setEditId(p._id); setShowModal(true); }}>Edit</Button>
                <Button variant="danger" onClick={() => setDeleteId(p._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showModal && (
        <PositionFormModal
          positionId={editId}
          onClose={() => setShowModal(false)}
        />
      )}

      {deleteId && (
        <DeleteConfirmation
          open={!!deleteId}
          onConfirm={() => { deletePosition(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};
