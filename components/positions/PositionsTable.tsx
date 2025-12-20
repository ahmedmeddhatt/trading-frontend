import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePositions, useDeletePosition } from "@/hooks/api/usePositions";
import { Button } from "@/components/ui/Button";
import { PositionFormModal } from "./PositionFormModal";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { PositionList } from "./PositionList";
import Link from "next/link";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { Skeleton } from "@/components/ui/Skeleton";
import { Error } from "@/components/ui/Error";
import { cn } from "@/lib/utils";

export const PositionsTable: React.FC = () => {
  const { data: positions = [], isLoading, error, refetch } = usePositions();
  const deletePositionMutation = useDeletePosition();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deletePositionMutation.mutateAsync(id);
      setDeleteId(null);
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleEdit = (positionId: string) => {
    setEditId(positionId);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height="60px" />
        ))}
      </div>
    );
  }

  if (error) {
    return <Error message={(error as any)?.message || "Failed to load positions"} />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setEditId(null); setShowModal(true); }} variant="primary">
          Add Position
        </Button>
      </div>

      {/* Mobile: Card List */}
      <div className="md:hidden">
        <PositionList
          positions={positions}
          onEdit={(p) => handleEdit(p._id)}
          onDelete={(id) => setDeleteId(id)}
          onAdd={() => { setEditId(null); setShowModal(true); }}
          useVirtualization={positions.length > 20}
        />
      </div>

      {/* Desktop: Table */}
      {positions.length === 0 ? (
        <div className="bg-dark-elevated p-8 rounded-xl text-center text-text-secondary border border-dark-border">
          <p>No positions found. Click "Add Position" to get started.</p>
        </div>
      ) : (
        <div className="hidden md:block">
          <Table className="bg-dark-elevated border border-dark-border">
            <TableHeader>
              <TableRow className="bg-dark-surface">
                {["Company", "Qty", "Avg. Price", "Investment", "Current Value", "Unrealized PnL", "Status", "Actions"].map((col) => (
                  <TableHead key={col} className="p-3 border-b border-dark-border text-text-secondary">{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((p) => (
                <TableRow key={p._id} className="text-center border-b border-dark-border last:border-b-0 hover:bg-dark-surface/50 transition-colors duration-normal">
                  <TableCell className="p-3 text-green-primary hover:underline">
                    <Link href={`/position/${p._id}`}>{p.companyName}</Link>
                  </TableCell>
                  <TableCell className="p-3">{p.totalQuantity}</TableCell>
                  <TableCell className="p-3">{formatCurrency(p.avgPurchasePrice)}</TableCell>
                  <TableCell className="p-3">{formatCurrency(p.investmentWithFees)}</TableCell>
                  <TableCell className="p-3">
                    {(() => {
                      // Use backend currentValue if available
                      if (p.currentValue !== undefined && p.currentValue !== null) {
                        return formatCurrency(p.currentValue);
                      }
                      // Calculate from currentPrice × totalQuantity
                      if (
                        p.currentPrice !== undefined &&
                        p.currentPrice !== null &&
                        p.totalQuantity !== undefined &&
                        p.totalQuantity !== null
                      ) {
                        const calculated = p.currentPrice * p.totalQuantity;
                        return formatCurrency(calculated);
                      }
                      return "N/A";
                    })()}
                  </TableCell>
                  <TableCell className={`p-3 ${p.unrealizedPnL && p.unrealizedPnL >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                    {p.unrealizedPnL !== undefined ? (
                      <>
                        {formatCurrency(p.unrealizedPnL, { showSign: true })}
                        {" "}
                        ({formatPercentage(p.unrealizedPct || 0, { showSign: true })})
                      </>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className="p-3">
                    <Badge variant="default">{p.status}</Badge>
                  </TableCell>
                  <TableCell className="p-3 space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(p._id)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteId(p._id)}>Delete</Button>
                    <Link href={`/transactions/${p._id}`}>
                      <Button variant="ghost" size="sm">Txns</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {showModal && (
        <PositionFormModal
          positionId={editId}
          onClose={async () => {
            setShowModal(false);
            // Force refresh positions list after update
            queryClient.invalidateQueries({ queryKey: ["positions"] });
            if (editId) {
              queryClient.invalidateQueries({ queryKey: ["positions", editId] });
            }
            // Refetch after a short delay to ensure backend has processed
            setTimeout(() => {
              refetch();
            }, 300);
          }}
        />
      )}

      {deleteId && (
        <DeleteConfirmation
          open={!!deleteId}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};
